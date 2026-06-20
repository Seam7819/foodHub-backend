import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import AppError from "../errors/appError.js";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorDetails: any = [];

  // Zod Error
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    errorDetails = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Generic Error
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;