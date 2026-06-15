import { Router } from "express";

import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";

import { OrderController } from "./order.controller";
import { OrderValidation } from "./order.validation";

const router = Router();

router.post(
  "/",
  auth("CUSTOMER"),
  validateRequest(
    OrderValidation.createOrderValidationSchema
  ),
  OrderController.createOrder
);

router.get(
  "/",
  auth("CUSTOMER"),
  OrderController.getMyOrders
);

router.get(
  "/:id",
  auth("CUSTOMER"),
  OrderController.getSingleOrder
);

router.patch(
  "/cancel/:id",
  auth("CUSTOMER"),
  OrderController.cancelOrder
);

export const OrderRoutes =
  router;