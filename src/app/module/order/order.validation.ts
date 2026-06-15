import { z } from "zod";

const createOrderValidationSchema = z.object({
  deliveryAddress: z
    .string({
      error:
        "Delivery address is required",
    })
    .min(
      5,
      "Delivery address is too short"
    ),
});

export const OrderValidation = {
  createOrderValidationSchema,
};