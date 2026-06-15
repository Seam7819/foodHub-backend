import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route";
import { middlewareRoute } from "../middleware/auth.route";
import globalErrorHandler from "../middleware/globalErrorHandler";
import notFound from "../middleware/notFound";
import { AdminRoutes } from "../module/admin/admin.routes";
import { CategoryRoutes } from "../module/category/category.routes";
import { MealRoutes } from "../module/meal/meal.routes";
import { CartRoutes } from "../module/cart/cart.routes";
import { OrderRoutes } from "../module/order/order.routes";


const router = Router();

router.use(
    "/auth",
    AuthRoutes
);
router.use(
    "/auth",
    middlewareRoute
);
router.use(
    "/auth",
    globalErrorHandler
);
router.use(
    "/auth",
    notFound
);


router.use('/test-admin', AdminRoutes);


router.use(
  "/categories",
  CategoryRoutes
);

router.use(
  "/meals",
  MealRoutes
);

router.use(
  "/cart",
  CartRoutes
);

router.use(
  "/orders",
  OrderRoutes
);


export const indexRoute = router;