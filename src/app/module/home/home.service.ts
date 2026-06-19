import { prisma } from "../../../lib/prisma";

const getHomeData = async () => {
  // carousel: top 5 meals by average rating
  const carousel = await prisma.meal.findMany({
    orderBy: [{ averageRating: "desc" }, { createdAt: "desc" }],
    take: 5,
    include: { provider: true, category: true },
  });

  // featured meals: top 8 by reviewCount
  const featuredMeals = await prisma.meal.findMany({
    orderBy: [{ reviewCount: "desc" }, { averageRating: "desc" }],
    take: 8,
    include: { provider: true, category: true },
  });

  // top providers: providers with most meals
  const providersRaw = await prisma.providerProfile.findMany({
    include: { user: true, meals: true },
  });

  const providers = providersRaw
    .map((p): {
      id: string;
      businessName: string;
      logo: string | null;
      mealCount: number;
      user: { id: string };
    } => ({
      id: p.id,
      businessName: p.businessName,
      logo: p.logo,
      mealCount: p.meals.length,
      user: { id: p.userId },
    }))
    .sort((a, b): number => b.mealCount - a.mealCount)
    .slice(0, 8);

  // categories
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return { carousel, featuredMeals, providers, categories };
};

export const HomeService = { getHomeData };
