import { Router } from "express";

import auth from "../../middleware/auth.js";

import { ProviderDashboardController } from "./providerDashboard.controller.js";

const router = Router();

router.get(
  "/",
  auth("PROVIDER"),
  ProviderDashboardController.getProviderDashboard
);

export const ProviderDashboardRoutes =
  router;