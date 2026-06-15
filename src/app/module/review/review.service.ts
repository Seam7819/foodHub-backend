import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

const createReview = async (
  userId: string,
  payload: {
    mealId: string;
    rating: number;
    comment?: string;
  }
) => {
  const orderedMeal =
    await prisma.orderItem.findFirst({
      where: {
        mealId: payload.mealId,

        order: {
          userId,
          status: "DELIVERED",
        },
      },
    });

  if (!orderedMeal) {
    throw new AppError(
      400,
      "You can review only delivered meals"
    );
  }

  const existingReview =
    await prisma.review.findUnique({
      where: {
        userId_mealId: {
          userId,
          mealId: payload.mealId,
        },
      },
    });

  if (existingReview) {
    throw new AppError(
      400,
      "Review already exists"
    );
  }

  const review =
    await prisma.review.create({
      data: {
        userId,

        mealId: payload.mealId,

        rating: payload.rating,

        comment: payload.comment ?? null,
      },
    });

  await updateMealRating(
    payload.mealId
  );

  return review;
};

const updateMealRating =
  async (
    mealId: string
  ) => {
    const reviews =
      await prisma.review.findMany({
        where: {
          mealId,
        },
      });

    const reviewCount =
      reviews.length;

    const averageRating =
      reviewCount === 0
        ? 0
        : reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviewCount;

    await prisma.meal.update({
      where: {
        id: mealId,
      },

      data: {
        averageRating,

        reviewCount,
      },
    });
  };

  const getMealReviews =
  async (
    mealId: string
  ) => {
    return prisma.review.findMany({
      where: {
        mealId,
      },

      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  };

  const updateReview = async (
  userId: string,
  reviewId: string,
  payload: {
    rating?: number;
    comment?: string;
  }
) => {
  const review =
    await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

  if (!review) {
    throw new AppError(
      404,
      "Review not found"
    );
  }

  if (
    review.userId !== userId
  ) {
    throw new AppError(
      403,
      "Forbidden"
    );
  }

  const updatedReview =
    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: payload,
    });

  await updateMealRating(
    review.mealId
  );

  return updatedReview;
};

const deleteReview = async (
  userId: string,
  reviewId: string
) => {
  const review =
    await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

  if (!review) {
    throw new AppError(
      404,
      "Review not found"
    );
  }

  if (
    review.userId !== userId
  ) {
    throw new AppError(
      403,
      "Forbidden"
    );
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  await updateMealRating(
    review.mealId
  );

  return null;
};

export const ReviewService = {
  createReview,

  getMealReviews,

  updateReview,

  deleteReview,
};