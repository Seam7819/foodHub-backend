import { Router } from "express";
import auth from "./auth";
import { getMe } from "./auth.controller";

const router = Router();

router.get(
  "/me",
  auth(),
  getMe
);

 export const middlewareRoute = router;