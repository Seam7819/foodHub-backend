import { Router } from "express";

import auth from "../../middleware/auth";

import { OrderController } from "./order.controller";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  OrderController.getAllOrders
);

export const AdminOrderRoutes =
  router;