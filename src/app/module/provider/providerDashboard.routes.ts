import { Router } from "express";

import auth from "../../middleware/auth";

import { ProviderDashboardController } from "./providerDashboard.controller";

const router = Router();

router.get(
  "/",
  auth("PROVIDER"),
  ProviderDashboardController.getProviderDashboard
);

export const ProviderDashboardRoutes =
  router;