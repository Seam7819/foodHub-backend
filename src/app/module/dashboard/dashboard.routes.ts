import { Router } from "express";

import auth from "../../middleware/auth.js";

import { DashboardController } from "./dashboard.controller.js";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  DashboardController.getAdminDashboardStats
);

export const DashboardRoutes =
  router;