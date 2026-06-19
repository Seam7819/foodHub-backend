import type { Prisma } from "../../../generated/client";
import { OrderStatus } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

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

  const order = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const createdOrder =
        await tx.order.create({
          data: {
            userId,
            deliveryAddress,
            totalPrice,
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

      return createdOrder;
    }
  );

  return order;
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

export const OrderService = {
  createOrder,

  getMyOrders,

  getSingleOrder,

  getProviderOrders,

  updateOrderStatus,

  cancelOrder,

  getAllOrders,
};