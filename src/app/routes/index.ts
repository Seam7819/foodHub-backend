import { Router } from "express";
import { AuthRoutes } from "../module/auth/auth.route.js";
import { middlewareRoute } from "../middleware/auth.route.js";
import globalErrorHandler from "../middleware/globalErrorHandler.js";
import notFound from "../middleware/notFound.js";
import { AdminRoutes } from "../module/admin/admin.routes.js";
import { CategoryRoutes } from "../module/category/category.routes.js";
import { MealRoutes } from "../module/meal/meal.routes.js";
import { CartRoutes } from "../module/cart/cart.routes.js";
import { OrderRoutes } from "../module/order/order.routes.js";
import { ProviderOrderRoutes } from "../module/order/providerOrder.routes.js";
import { UserRoutes } from "../module/user/user.routes.js";
import { AdminOrderRoutes } from "../module/order/adminOrder.routes.js";
import { ProviderRoutes } from "../module/provider/provider.routes.js";
import { DashboardRoutes } from "../module/dashboard/dashboard.routes.js";
import { ProviderDashboardRoutes } from "../module/provider/providerDashboard.routes.js";
import { HomeRoutes } from "../module/home/home.routes.js";
import { BlogRoutes } from "../module/blog/blog.routes.js";
import { AssistantRoutes } from "../module/assistant/assistant.routes.js";

const router = Router();

router.use(
    "/auth",
    AuthRoutes
);
router.use(
    "/auth",
    middlewareRoute
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

router.use(
  "/provider/orders",
  ProviderOrderRoutes
);


router.use(
  "/users",
  UserRoutes
);

router.use(
  "/admin/orders",
  AdminOrderRoutes
);

router.use(
  "/providers",
  ProviderRoutes
);

router.use(
  "/admin/dashboard",
  DashboardRoutes
);


router.use(
  "/provider/dashboard",
  ProviderDashboardRoutes
);

router.use(
  "/home",
  HomeRoutes
);

router.use(
  "/blog",
  BlogRoutes
);

router.use(
  "/assistant",
  AssistantRoutes
);

router.use(notFound);
router.use(globalErrorHandler);

export const indexRoute = router;