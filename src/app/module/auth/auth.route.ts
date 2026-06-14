import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";

import {
  login,
  register,
} from "./auth.controller";
import { AuthValidation } from "./auth.Validation";

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