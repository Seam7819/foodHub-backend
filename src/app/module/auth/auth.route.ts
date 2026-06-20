import { Router } from "express";
import validateRequest from "../../middleware/validateRequest.js";

import {
  login,
  register,
} from "./auth.controller.js";
import { AuthValidation } from "./auth.Validation.js";

const router = Router();

router.post(
  "/register",
  register
);


router.post(
  "/register",
  validateRequest(
    AuthValidation.registerValidationSchema
  ),
  register
);

router.post(
  "/login",
  validateRequest(
    AuthValidation.loginValidationSchema
  ),
  login
);

router.post(
  "/login",
  login
);

export const AuthRoutes =
  router;