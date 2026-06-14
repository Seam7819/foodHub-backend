import { z } from "zod";

const createCategoryValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Category name is required")
    .max(50, "Category name too long"),
});

const updateCategoryValidationSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .optional(),
});

export const CategoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};