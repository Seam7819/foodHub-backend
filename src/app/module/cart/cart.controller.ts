import { Request, Response } from "express";


import { CartService } from "./cart.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";

const addToCart = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CartService.addToCart(
        req.user!.id,
        req.body
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Added to cart successfully",
      data: result,
    });
  }
);

const getMyCart = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CartService.getMyCart(
        req.user!.id
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Cart retrieved successfully",
      data: result,
    });
  }
);

const updateCartItem = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CartService.updateCartItem(
        req.user!.id,
        req.params.id as string,
        req.body.quantity
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Cart updated successfully",
      data: result,
    });
  }
);

const removeCartItem = catchAsync(
  async (req: Request, res: Response) => {
    await CartService.removeCartItem(
      req.user!.id,
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Item removed successfully",
      data: null,
    });
  }
);

const clearCart = catchAsync(
  async (req: Request, res: Response) => {
    await CartService.clearCart(
      req.user!.id
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Cart cleared successfully",
      data: null,
    });
  }
);

export const CartController = {
  addToCart,
  getMyCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};