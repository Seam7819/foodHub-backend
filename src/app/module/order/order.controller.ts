import { Request, Response } from "express";


import { OrderService } from "./order.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";

const createOrder = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await OrderService.createOrder(
        req.user!.id,
        req.body.deliveryAddress
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Order placed successfully",
      data: result,
    });
  }
);

const getMyOrders = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await OrderService.getMyOrders(
        req.user!.id
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Orders retrieved successfully",
      data: result,
    });
  }
);

const getSingleOrder = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await OrderService.getSingleOrder(
        req.user!.id,
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Order retrieved successfully",
      data: result,
    });
  }
);

const cancelOrder = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await OrderService.cancelOrder(
        req.user!.id,
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Order cancelled successfully",
      data: result,
    });
  }
);

export const OrderController = {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
};