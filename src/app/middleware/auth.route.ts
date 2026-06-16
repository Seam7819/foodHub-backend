import { Router } from "express";
import auth from "./auth";
import { AuthController, getMe } from "./auth.controller";

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