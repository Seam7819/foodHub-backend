import { Router } from "express";

import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";

import { OrderController } from "./order.controller.js";
import { OrderValidation } from "./order.validation.js";

const router = Router();

router.post(
  "/",
  auth("CUSTOMER", "ADMIN"),
  validateRequest(
    OrderValidation.createOrderValidationSchema
  ),
  OrderController.createOrder
);

router.get(
  "/",
  auth("CUSTOMER", "ADMIN"),
  OrderController.getMyOrders
);

router.get(
  "/:id",
  auth("CUSTOMER", "ADMIN"),
  OrderController.getSingleOrder
);

router.patch(
  "/cancel/:id",
  auth("CUSTOMER", "ADMIN"),
  OrderController.cancelOrder
);

router.post(
  "/confirm/:id",
  auth("CUSTOMER", "ADMIN"),
  OrderController.getOrderPaymentIntent
);

export const OrderRoutes =
  router;