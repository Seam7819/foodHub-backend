import { Router } from "express";
import auth from "../../middleware/auth.js";
import { AssistantController } from "./assistant.controller.js";

const router = Router();

router.post(
  "/prompt",
  auth("ADMIN", "CUSTOMER", "PROVIDER"),
  AssistantController.sendPrompt
);

export const AssistantRoutes = router;
