import { Request, Response } from "express";

import { AuthService } from "./auth.service";

import { catchAsync } from "../../../shared/catchAsync";

import { sendResponse } from "../../../shared/sendResponse";

export const register = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
      console.log("BODY RECEIVED:", req.body); // 🔥 ADD THIS

    const result =
      await AuthService.registerUser(
        req.body
      );

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message:
        "Registration successful",
      data: result,
    });
  }
);

export const login = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await AuthService.loginUser(
        req.body
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message:
        "Login successful",
      data: result,
    });
  }
);