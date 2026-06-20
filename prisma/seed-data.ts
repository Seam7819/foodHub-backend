import { prisma } from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { Role } from "../src/generated/enums";

async function main() {
  console.log("Seeding sample data...");

  // Create categories
  const categories = [
    { name: "Burgers", image: "" },
    { name: "Pizza", image: "" },
    { name: "Salads", image: "" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: {},
      create: c,
    });
  }

  // Create a provider user
  const providerEmail = "provider@foodhub.com";
  let provider = await prisma.user.findUnique({ where: { email: providerEmail } });
  if (!provider) {
    const hashed = await bcrypt.hash("Provider@123", 12);
    provider = await prisma.user.create({
      data: {
        name: "Sample Provider",
        email: providerEmail,
        password: hashed,
        role: Role.PROVIDER,
        status: "ACTIVE",
      },
    });
  }

  // Create provider profile
  const profile = await prisma.providerProfile.upsert({
    where: { userId: provider.id },
    update: {},
    create: {
      businessName: "Sample Kitchen",
      description: "Tasty sample meals",
      address: "123 Food St",
      userId: provider.id,
    },
  });

  // Create sample meals
  const burgerCategory = await prisma.category.findUnique({ where: { name: "Burgers" } });
  const pizzaCategory = await prisma.category.findUnique({ where: { name: "Pizza" } });

  const meals = [
    {
      name: "Classic Burger",
      description: "Beef patty with lettuce and tomato",
      price: 7.99,
      providerId: profile.id,
      categoryId: burgerCategory?.id || undefined,
    },
    {
      name: "Margherita Pizza",
      description: "Tomato, mozzarella, basil",
      price: 9.5,
      providerId: profile.id,
      categoryId: pizzaCategory?.id || undefined,
    },
  ];

  for (const m of meals) {
    await prisma.meal.upsert({
      where: { name: m.name },
      update: {},
      create: {
        name: m.name,
        description: m.description,
        price: m.price,
        providerId: m.providerId,
        categoryId: m.categoryId,
      },
    });
  }

  console.log("Sample data seeded.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
