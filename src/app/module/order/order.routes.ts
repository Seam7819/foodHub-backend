import { Router } from "express";

import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";

import { OrderController } from "./order.controller.js";
import { OrderValidation } from "./order.validation.js";

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

router.post(
  "/confirm/:id",
  auth("CUSTOMER"),
  OrderController.getOrderPaymentIntent
);

export const OrderRoutes =
  router;