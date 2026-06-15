import { Router } from "express";

import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";

import { ProviderController } from "./provider.controller";
import { ProviderValidation } from "./provider.validation";

const router = Router();

router.get(
  "/",
  ProviderController.getAllProviders
);

router.get(
  "/:id",
  ProviderController.getSingleProvider
);

router.patch(
  "/profile",
  auth("PROVIDER"),
  validateRequest(
    ProviderValidation.updateProviderSchema
  ),
  ProviderController.updateProviderProfile
);

export const ProviderRoutes =
  router;