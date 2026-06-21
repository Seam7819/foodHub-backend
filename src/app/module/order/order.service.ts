import type { Prisma } from "../../../generated/client.js";
import { OrderStatus } from "../../../generated/enums.js";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/appError.js";
import Stripe from "stripe";
import config from "../../../config/index.js";
import getStripe from "../../../helpers/stripeHelper.js";

const createOrder = async (
  userId: string,
  deliveryAddress: string
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new AppError(
      400,
      "Cart is empty"
    );
  }

  // Prevent multi-provider order
  const providerIds = [
    ...new Set(
      cart.items.map(
        (item): string => item.meal.providerId
      )
    ),
  ];

  if (providerIds.length > 1) {
    throw new AppError(
      400,
      "All cart items must belong to the same provider"
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item): number =>
      sum +
      item.quantity * item.meal.price,
    0
  );

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const stripe = getStripe();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalPrice * 100),
        currency: config.stripe.currency,
        metadata: {
          userId,
          type: "foodhub_order",
        },
        description: `FoodHub order for user ${userId}`,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      const createdOrder = await tx.order.create({
        data: {
          userId,
          deliveryAddress,
          totalPrice,
          paymentIntentId: paymentIntent.id,
          paymentStatus: "PENDING",
        },
      });

      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: createdOrder.id,
            mealId: item.meal.id,
            mealName: item.meal.name,
            quantity: item.quantity,
            price: item.meal.price,
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return {
        order: createdOrder,
        clientSecret: paymentIntent.client_secret,
      };
    }
  );

  return result;
};

const getMyOrders = async (
  userId: string
) => {
  return prisma.order.findMany({
    where: {
      userId,
    },

    include: {
      items: {
        include: {
          meal: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleOrder = async (
  userId: string,
  orderId: string
) => {
  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },

      include: {
        items: {
          include: {
            meal: true,
          },
        },
      },
    });

  if (!order) {
    throw new AppError(
      404,
      "Order not found"
    );
  }

  if (order.userId !== userId) {
    throw new AppError(
      403,
      "Forbidden"
    );
  }

  return order;
};

const getProviderOrders = async (
  userId: string
) => {
  const provider =
    await prisma.providerProfile.findUnique(
      {
        where: {
          userId,
        },
      }
    );

  if (!provider) {
    throw new AppError(
      404,
      "Provider profile not found"
    );
  }

  return prisma.order.findMany({
    where: {
      items: {
        some: {
          meal: {
            providerId:
              provider.id,
          },
        },
      },
    },

    include: {
      items: {
        include: {
          meal: true,
        },
      },

      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateOrderStatus =
  async (
    userId: string,
    orderId: string,
    status: string
  ) => {
    const provider =
      await prisma.providerProfile.findUnique(
        {
          where: {
            userId,
          },
        }
      );

    if (!provider) {
      throw new AppError(
        404,
        "Provider profile not found"
      );
    }

    const order =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },

        include: {
          items: {
            include: {
              meal: true,
            },
          },
        },
      });

    if (!order) {
      throw new AppError(
        404,
        "Order not found"
      );
    }

    const ownsMeal =
      order.items.some(
        (item) =>
          item.meal.providerId ===
          provider.id
      );

    if (!ownsMeal) {
      throw new AppError(
        403,
        "Forbidden"
      );
    }

    const validStatus =
      Object.values(OrderStatus);

    if (
      !validStatus.includes(
        status as OrderStatus
      )
    ) {
      throw new AppError(
        400,
        "Invalid order status"
      );
    }

    return prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        status:
          status as OrderStatus,
      },
    });
  };

const getOrderPaymentIntent = async (
  userId: string,
  orderId: string
) => {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
  });

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  if (order.userId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  if (order.paymentStatus === "PAID") {
    return {
      order,
      message: "Order already paid",
    };
  }

  let paymentIntent: Stripe.PaymentIntent;

  if (order.paymentIntentId) {
    const stripe = getStripe();
    paymentIntent = await stripe.paymentIntents.retrieve(
      order.paymentIntentId
    );

    if (
      paymentIntent.status === "requires_payment_method" ||
      paymentIntent.status === "requires_confirmation" ||
      paymentIntent.status === "requires_action"
    ) {
      return {
        order,
        clientSecret: paymentIntent.client_secret,
      };
    }

    if (paymentIntent.status === "succeeded") {
      return {
        order,
        message: "Order already paid",
      };
    }
  }

  const stripe = getStripe();
  paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: config.stripe.currency,
    metadata: {
      userId,
      orderId,
      type: "foodhub_order",
    },
    description: `FoodHub order ${order.id}`,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      paymentIntentId: paymentIntent.id,
      paymentStatus: "PENDING",
    },
  });

  return {
    order,
    clientSecret: paymentIntent.client_secret,
  };
};

const cancelOrder = async (
  userId: string,
  orderId: string
) => {
  const order =
    await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

  if (!order) {
    throw new AppError(
      404,
      "Order not found"
    );
  }

  if (order.userId !== userId) {
    throw new AppError(
      403,
      "Forbidden"
    );
  }

  if (
    order.status !==
    OrderStatus.PLACED
  ) {
    throw new AppError(
      400,
      "Order can no longer be cancelled"
    );
  }

  return prisma.order.update({
    where: {
      id: orderId,
    },

    data: {
      status:
        OrderStatus.CANCELLED,
    },
  });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    include: {
      user: true,

      items: {
        include: {
          meal: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

const handleStripeWebhook = async (
  req: import("express").Request
) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) {
    throw new AppError(
      400,
      "Missing Stripe signature"
    );
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
  } catch (error) {
    throw new AppError(
      400,
      "Invalid Stripe webhook signature"
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent =
      event.data.object as Stripe.PaymentIntent;

    if (paymentIntent.id) {
      const order = await prisma.order.findUnique({
        where: {
          paymentIntentId: paymentIntent.id,
        },
      });

      if (order) {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentStatus: "PAID",
          },
        });
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent =
      event.data.object as Stripe.PaymentIntent;

    if (paymentIntent.id) {
      const order = await prisma.order.findUnique({
        where: {
          paymentIntentId: paymentIntent.id,
        },
      });

      if (order) {
        await prisma.order.update({
          where: {
            id: order.id,
          },
          data: {
            paymentStatus: "FAILED",
          },
        });
      }
    }
  }

  return { received: true };
};

export const OrderService = {
  createOrder,

  getMyOrders,

  getSingleOrder,

  getProviderOrders,

  updateOrderStatus,

  cancelOrder,

  getAllOrders,

  getOrderPaymentIntent,
  handleStripeWebhook,
};