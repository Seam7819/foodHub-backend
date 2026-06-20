import { Router } from "express";

import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";

import { UserController } from "./user.controller.js";
import { UserValidation } from "./user.validation.js";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  UserController.getAllUsers
);

router.patch(
  "/:id/status",
  auth("ADMIN"),
  validateRequest(
    UserValidation.updateUserStatusSchema
  ),
  UserController.updateUserStatus
);

export const UserRoutes =
  router;