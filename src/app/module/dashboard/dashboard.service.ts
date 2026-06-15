import { prisma } from "../../../lib/prisma";

const getAdminDashboardStats =
  async () => {
    const totalUsers =
      await prisma.user.count();

    const totalCustomers =
      await prisma.user.count({
        where: {
          role: "CUSTOMER",
        },
      });

    const totalProviders =
      await prisma.user.count({
        where: {
          role: "PROVIDER",
        },
      });

    const totalMeals =
      await prisma.meal.count();

    const totalOrders =
      await prisma.order.count();

    const revenueResult =
      await prisma.order.aggregate({
        _sum: {
          totalPrice: true,
        },
        where: {
          status: "DELIVERED",
        },
      });

    return {
      totalUsers,
      totalCustomers,
      totalProviders,
      totalMeals,
      totalOrders,

      totalRevenue:
        revenueResult._sum
          .totalPrice || 0,
    };
  };

export const DashboardService = {
  getAdminDashboardStats,
};