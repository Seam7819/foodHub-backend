import { Prisma } from "../../../generated/client.js";
import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/appError.js";
import { mealSearchableFields } from "./meal.constants.js";



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

  const allowedSortFields = [
    "name",
    "price",
    "createdAt",
    "updatedAt",
    "averageRating",
    "reviewCount",
    "isAvailable",
    "categoryId",
    "providerId",
  ] as const;

  const sortByField = String(sortBy || "createdAt");
  const sortOrderValue =
    String(sortOrder).toLowerCase() === "asc"
      ? "asc"
      : "desc";

  if (!allowedSortFields.includes(sortByField as any)) {
    throw new AppError(
      400,
      `Invalid sortBy value. Allowed values: ${allowedSortFields.join(", ")}`
    );
  }

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

  const priceFilter: Prisma.FloatFilter = {};

  if (
    minPrice !== undefined &&
    minPrice !== null &&
    minPrice !== ""
  ) {
    priceFilter.gte = Number(minPrice);
  }

  if (
    maxPrice !== undefined &&
    maxPrice !== null &&
    maxPrice !== ""
  ) {
    priceFilter.lte = Number(maxPrice);
  }

  if (Object.keys(priceFilter).length > 0) {
    andConditions.push({
      price: priceFilter,
    });
  }

  const whereConditions: Prisma.MealWhereInput =
    andConditions.length > 0
      ? { AND: andConditions }
      : {};

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    throw new AppError(400, "Invalid page value");
  }

  if (Number.isNaN(limitNumber) || limitNumber < 1) {
    throw new AppError(400, "Invalid limit value");
  }

  const skip = (pageNumber - 1) * limitNumber;

  const result = await prisma.meal.findMany({
    where: whereConditions,

    include: {
      category: true,

      provider: {
        select: {
          id: true,
          userId: true,
          businessName: true,
        },
      },
    },

    skip,

    take: limitNumber,

    orderBy: {
      [sortByField]: sortOrderValue,
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