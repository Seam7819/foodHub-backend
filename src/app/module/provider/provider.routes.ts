import { Router } from "express";

import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";

import { ProviderController } from "./provider.controller.js";
import { ProviderValidation } from "./provider.validation.js";

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