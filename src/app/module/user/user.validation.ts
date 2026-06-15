import { z } from "zod";

const updateUserStatusSchema =
  z.object({
    status: z.enum([
      "ACTIVE",
      "SUSPENDED",
    ]),
  });

export const UserValidation = {
  updateUserStatusSchema,
};