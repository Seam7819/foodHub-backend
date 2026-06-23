import { z } from "zod";

const createMealValidationSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),

  price: z.coerce.number().positive(),

  categoryId: z.string(),

  image: z.string().optional(),
});

const updateMealValidationSchema = z.object({
  name: z.string().min(2).optional(),

  description: z.string().min(5).optional(),

  price: z.coerce.number().positive().optional(),

  categoryId: z.string().optional(),

  image: z.string().optional(),

  isAvailable: z.coerce.boolean().optional(),
});

export const MealValidation = {
  createMealValidationSchema,
  updateMealValidationSchema,
};