import bcrypt from "bcrypt";
import {prisma} from "../src/lib/prisma"
import { Role } from "../src/generated/enums";


async function main() {
  const adminExists = await prisma.user.findUnique({
    where: {
      email: "admin@foodhub.com",
    },
  });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(
    "Admin@123",
    12
  );

  await prisma.user.create({
    data: {
      name: "FoodHub Admin",
      email: "admin@foodhub.com",
      password: hashedPassword,
      role: Role.ADMIN,
      status: "ACTIVE",
    },
  });

  console.log("Admin created successfully");
  
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });