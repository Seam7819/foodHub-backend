import { z } from "zod";

const updateProviderSchema =
  z.object({
    businessName:
      z.string().optional(),

    description:
      z.string().optional(),

    address:
      z.string().optional(),

    logo:
      z.string().optional(),
  });

export const ProviderValidation = {
  updateProviderSchema,
};