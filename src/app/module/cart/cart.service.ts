import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

const addToCart = async (
  userId: string,
  payload: {
    mealId: string;
    quantity: number;
  }
) => {
  if (!payload.mealId?.trim()) {
    throw new AppError(
      400,
      "Meal id is required"
    );
  }

  const meal = await prisma.meal.findUnique({
    where: {
      id: payload.mealId.trim(),
    },
  });

  if (!meal) {
    throw new AppError(
      404,
      "Meal not found"
    );
  }

  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  const existingItem =
    await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        mealId: payload.mealId,
      },
    });

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity:
          existingItem.quantity +
          payload.quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      mealId: payload.mealId,
      quantity: payload.quantity,
    },
  });
};

const getMyCart = async (
  userId: string
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

  if (!cart) {
    return {
      items: [],
      totalPrice: 0,
    };
  }

  const totalPrice =
    cart.items.reduce<number>(
      (sum, item) =>
        sum +
        item.quantity *
          item.meal.price,
      0
    );

  return {
    ...cart,
    totalPrice,
  };
};

const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  const item =
    await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
      include: {
        cart: true,
      },
    });

  if (!item) {
    throw new AppError(
      404,
      "Cart item not found"
    );
  }

  if (
    item.cart.userId !== userId
  ) {
    throw new AppError(
      403,
      "Forbidden"
    );
  }

  return prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity,
    },
  });
};

const removeCartItem = async (
  userId: string,
  itemId: string
) => {
  const item =
    await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
      include: {
        cart: true,
      },
    });

  if (!item) {
    throw new AppError(
      404,
      "Cart item not found"
    );
  }

  if (
    item.cart.userId !== userId
  ) {
    throw new AppError(
      403,
      "Forbidden"
    );
  }

  await prisma.cartItem.delete({
    where: {
      id: itemId,
    },
  });

  return null;
};

const clearCart = async (
  userId: string
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  });

  if (!cart) {
    return null;
  }

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return null;
};

export const CartService = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};