import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/appError.js";

const getAllProviders = async () => {
  return prisma.providerProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getSingleProvider = async (
  providerId: string
) => {
  const provider =
    await prisma.providerProfile.findUnique({
      where: {
        id: providerId,
      },

      include: {
        meals: {
          where: {
            isAvailable: true,
          },
        },

        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

  if (!provider) {
    throw new AppError(
      404,
      "Provider not found"
    );
  }

  return provider;
};

const updateProviderProfile =
  async (
    userId: string,
    payload: any
  ) => {
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

    return prisma.providerProfile.update({
      where: {
        id: provider.id,
      },
      data: payload,
    });
  };

export const ProviderService = {
  getAllProviders,
  getSingleProvider,
  updateProviderProfile,
};