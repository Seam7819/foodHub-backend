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
import { ProviderOrderRoutes } from "../module/order/providerOrder.routes";
import { UserRoutes } from "../module/user/user.routes";
import { AdminOrderRoutes } from "../module/order/adminOrder.routes";
import { ProviderRoutes } from "../module/provider/provider.routes";
import { DashboardRoutes } from "../module/dashboard/dashboard.routes";
import { ProviderDashboardRoutes } from "../module/provider/providerDashboard.routes";
import { HomeRoutes } from "../module/home/home.routes";


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

router.use(notFound);
router.use(globalErrorHandler);

export const indexRoute = router;