import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/appError.js";

const getProviderDashboard =
  async (userId: string) => {
    const provider =
      await prisma.providerProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!provider) {
      throw new AppError(
        404,
        "Provider profile not found"
      );
    }

    const totalMeals =
      await prisma.meal.count({
        where: {
          providerId: provider.id,
        },
      });

    const providerOrders =
      await prisma.order.findMany({
        where: {
          items: {
            some: {
              meal: {
                providerId:
                  provider.id,
              },
            },
          },
        },

        include: {
          items: {
            include: {
              meal: true,
            },
          },
        },
      });

    const totalOrders =
      providerOrders.length;

    const pendingOrders =
      providerOrders.filter(
        (order): boolean =>
          order.status ===
            "PLACED" ||
          order.status ===
            "PREPARING"
      ).length;

    const completedOrders =
      providerOrders.filter(
        (order): boolean =>
          order.status ===
          "DELIVERED"
      ).length;

    const totalRevenue =
      providerOrders
        .filter(
          (order): boolean =>
            order.status ===
            "DELIVERED"
        )
        .reduce(
          (sum, order): number =>
            sum +
            order.totalPrice,
          0
        );
    // recent orders for provider
    const recentOrders = await prisma.order.findMany({
      where: {
        items: {
          some: {
            meal: { providerId: provider.id },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { include: { meal: true } } },
    });

    // top meals by quantity sold (aggregate in JS)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        meal: { providerId: provider.id },
      },
      include: { meal: true },
    });

    const totalsByMeal: Record<string, { meal: any; quantity: number }> = {};
    for (const oi of orderItems) {
      if (!totalsByMeal[oi.mealId]) {
        totalsByMeal[oi.mealId] = { meal: oi.meal, quantity: 0 };
      }
      totalsByMeal[oi.mealId]!.quantity += oi.quantity;
    }

    const topMeals = Object.values(totalsByMeal)
      .sort((a, b): number => b.quantity - a.quantity)
      .slice(0, 5);

    return {
      totalMeals,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      recentOrders,
      topMeals,
    };
  };

export const ProviderDashboardService =
  {
    getProviderDashboard,
  };