import { z } from "zod";

const addToCartValidationSchema = z.object({
  mealId: z.string(),
  quantity: z.number().min(1),
});

const updateCartItemValidationSchema = z.object({
  quantity: z.number().min(1),
});

export const CartValidation = {
  addToCartValidationSchema,
  updateCartItemValidationSchema,
};