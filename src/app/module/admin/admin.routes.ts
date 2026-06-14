import { Router } from "express";
import auth from "../../middleware/auth";

const router = Router();

router.get(
  "/",
  auth("ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin Access Granted",
    });
  }
);

export const AdminRoutes = router;