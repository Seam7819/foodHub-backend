import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

export const getMe = catchAsync(
  async (req:Request, res:Response) => {
    const result =
      await AuthService.getMe(
        req.user!.id
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Profile retrieved",
      data: result,
    });
  }
);