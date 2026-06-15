import { Router } from "express";

import auth from "../../middleware/auth";

import { DashboardController } from "./dashboard.controller";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  DashboardController.getAdminDashboardStats
);

export const DashboardRoutes =
  router;