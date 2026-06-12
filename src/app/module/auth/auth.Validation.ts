import { z } from "zod";

export const registerValidation = z.object({
  name: z.string(),

  email: z.email(),

  password: z
    .string()
    .min(6),

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

export const loginValidation = z.object({
  email: z.email(),

  password: z.string(),
});