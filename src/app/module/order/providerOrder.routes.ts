import { Router } from "express";

import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";

import { OrderController } from "./order.controller";
import { ProviderOrderValidation } from "./order.provider.validation";

const router = Router();

router.get(
  "/",
  auth("PROVIDER"),
  OrderController.getProviderOrders
);

router.patch(
  "/:id",
  auth("PROVIDER"),
  validateRequest(
    ProviderOrderValidation.updateOrderStatusValidationSchema
  ),
  OrderController.updateOrderStatus
);

export const ProviderOrderRoutes =
  router;