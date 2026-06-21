import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const validateRequest = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;