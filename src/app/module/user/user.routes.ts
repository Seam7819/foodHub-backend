import { Router } from "express";

import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";

import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";

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