import { z } from "zod";

const updateUserStatusSchema =
  z.object({
    status: z.enum([
      "ACTIVE",
      "SUSPENDED",
    ]),
  });

const updateThemeSchema = z.object({
  theme: z.enum(["LIGHT", "DARK"]),
});

export const UserValidation = {
  updateUserStatusSchema,
  updateThemeSchema,
};