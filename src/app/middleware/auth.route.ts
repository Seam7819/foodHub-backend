import { Router } from "express";
import auth from "./auth.js";
import { AuthController, getMe } from "./auth.controller.js";

const router = Router();

router.get(
  "/me",
  auth(),
  getMe
);

router.post(
  "/refresh-token",
  AuthController.refreshToken
);

 export const middlewareRoute = router;