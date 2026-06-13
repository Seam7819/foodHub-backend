import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { middlewareRoute } from "../middleware/auth.route";


const router = Router();

router.use(
    "/auth",
    AuthRoutes
);
router.use(
    "/auth",
    middlewareRoute
);
export const indexRoute = router;