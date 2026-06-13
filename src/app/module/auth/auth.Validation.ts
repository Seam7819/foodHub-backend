import { z } from "zod";

const registerValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required"),

  email: z
    .string()
    .email("Invalid email"),

  password: z
    .string()
    .min(
      6,
      "Password must be at least 6 characters"
    ),

  role: z.enum([
    "CUSTOMER",
    "PROVIDER",
  ]),

  businessName: z
    .string()
    .optional(),

  address: z
    .string()
    .optional(),
});

const loginValidationSchema = z.object({
  email: z
    .string()
    .email(),

  password: z
    .string()
    .min(1),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};