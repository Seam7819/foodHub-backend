import { z } from "zod";

const updateOrderStatusValidationSchema =
  z.object({
    status: z.enum([
      "PREPARING",
      "READY",
      "DELIVERED",
      "CANCELLED",
    ]),
  });

  

export const ProviderOrderValidation = {
  updateOrderStatusValidationSchema,
};