import { prisma } from "../../../lib/prisma.js";

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

    // counts by status
    const placed = await prisma.order.count({ where: { status: "PLACED" } });
    const preparing = await prisma.order.count({ where: { status: "PREPARING" } });
    const ready = await prisma.order.count({ where: { status: "READY" } });
    const delivered = await prisma.order.count({ where: { status: "DELIVERED" } });
    const cancelled = await prisma.order.count({ where: { status: "CANCELLED" } });

    const recentOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { include: { meal: true } } },
    });

    return {
      totalUsers,
      totalCustomers,
      totalProviders,
      totalMeals,
      totalOrders,

      totalRevenue: revenueResult._sum.totalPrice || 0,

      ordersByStatus: {
        placed,
        preparing,
        ready,
        delivered,
        cancelled,
      },

      recentOrders,
    };
  };

export const DashboardService = {
  getAdminDashboardStats,
};