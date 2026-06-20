import { Router } from "express";

import auth from "../../middleware/auth.js";

import { OrderController } from "./order.controller.js";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  OrderController.getAllOrders
);

export const AdminOrderRoutes =
  router;