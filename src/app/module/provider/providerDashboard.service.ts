import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

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
        (order) =>
          order.status ===
            "PLACED" ||
          order.status ===
            "PREPARING"
      ).length;

    const completedOrders =
      providerOrders.filter(
        (order) =>
          order.status ===
          "DELIVERED"
      ).length;

    const totalRevenue =
      providerOrders
        .filter(
          (order) =>
            order.status ===
            "DELIVERED"
        )
        .reduce(
          (sum, order) =>
            sum +
            order.totalPrice,
          0
        );

    return {
      totalMeals,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
    };
  };

export const ProviderDashboardService =
  {
    getProviderDashboard,
  };