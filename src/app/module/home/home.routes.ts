import { Router } from "express";
import { HomeController } from "./home.controller.js";

const router = Router();

router.get("/", HomeController.getHome);

export const HomeRoutes = router;
