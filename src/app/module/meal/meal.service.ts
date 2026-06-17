import { Prisma } from "../../../generated/client";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { mealSearchableFields } from "./meal.constants";



const createMeal = async (
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

  const category =
    await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
      },
    });

  if (!category) {
    throw new AppError(
      404,
      "Category not found"
    );
  }

  const result =
    await prisma.meal.create({
      data: {
        name: payload.name,
        description: payload.description,
        image: payload.image,
        price: payload.price,

        providerId: provider.id,

        categoryId: payload.categoryId,
      },
    });

  return result;
};

const getAllMeals = async (
  query: Record<string, any>
) => {
  const {
    searchTerm,

    categoryId,

    minPrice,

    maxPrice,

    isAvailable,

    page = 1,

    limit = 10,

    sortBy = "createdAt",

    sortOrder = "desc",
  } = query;

  const andConditions: Prisma.MealWhereInput[] =
    [];

  // Search

  if (searchTerm) {
    andConditions.push({
      OR: mealSearchableFields.map(
        (field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })
      ),
    });
  }

  // Category Filter

  if (categoryId) {
    andConditions.push({
      categoryId,
    });
  }

  // Availability

  if (
    isAvailable !== undefined
  ) {
    andConditions.push({
      isAvailable:
        isAvailable === "true",
    });
  }

  // Price Range

  if (minPrice || maxPrice) {
    const priceFilter: Prisma.FloatFilter = {};

    if (minPrice) {
      priceFilter.gte = Number(minPrice);
    }

    if (maxPrice) {
      priceFilter.lte = Number(maxPrice);
    }

    andConditions.push({
      price: priceFilter,
    });
  }

  const whereConditions: Prisma.MealWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const skip =
    (Number(page) - 1) *
    Number(limit);

  const result =
    await prisma.meal.findMany({
      where: whereConditions,

      include: {
        category: true,

        provider: {
          select: {
            businessName: true,
          },
        },
      },

      skip,

      take: Number(limit),

      orderBy: {
        [sortBy]: sortOrder,
      },
    });

  const total =
    await prisma.meal.count({
      where: whereConditions,
    });

  return {
    meta: {
      page: Number(page),

      limit: Number(limit),

      total,
    },

    data: result,
  };
};

const getSingleMeal = async (
  id: string
) => {
  if (!id?.trim()) {
    throw new AppError(
      400,
      "Meal id is required"
    );
  }

  const meal =
    await prisma.meal.findUnique({
      where: { id: id.trim() },

      include: {
        category: true,

        provider: true,
      },
    });

  if (!meal) {
    throw new AppError(
      404,
      "Meal not found"
    );
  }

  return meal;
};

const updateMeal = async (
  userId: string,
  mealId: string,
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

  const meal =
    await prisma.meal.findUnique({
      where: {
        id: mealId,
      },
    });

  if (!meal) {
    throw new AppError(
      404,
      "Meal not found"
    );
  }

  if (
    meal.providerId !== provider.id
  ) {
    throw new AppError(
      403,
      "You are not authorized"
    );
  }

  return prisma.meal.update({
    where: {
      id: mealId,
    },
    data: payload,
  });
};

const deleteMeal = async (
  userId: string,
  mealId: string
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

  const meal =
    await prisma.meal.findUnique({
      where: {
        id: mealId,
      },
    });

  if (!meal) {
    throw new AppError(
      404,
      "Meal not found"
    );
  }

  if (
    meal.providerId !== provider.id
  ) {
    throw new AppError(
      403,
      "You are not authorized"
    );
  }

  await prisma.meal.delete({
    where: {
      id: mealId,
    },
  });

  return null;
};

export const MealService = {
  createMeal,
  getAllMeals,
  getSingleMeal,
  updateMeal,
  deleteMeal,
};