import { Router } from "express";

import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";

import { OrderController } from "./order.controller.js";
import { ProviderOrderValidation } from "./order.provider.validation.js";

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