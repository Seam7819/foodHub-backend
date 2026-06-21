import bcrypt from "bcrypt";
import {prisma} from "../src/lib/prisma"
import { Role } from "../src/generated/enums";


async function main() {
  const adminEmails = ["admin@arg.com", "admin@org.com"];
  const hashedPassword = await bcrypt.hash(
    "Admin@123",
    12
  );

  for (const email of adminEmails) {
    const adminExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (adminExists) {
      console.log(`Admin account already exists for ${email}`);
      continue;
    }

    await prisma.user.create({
      data: {
        name: "FoodHub Admin",
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        status: "ACTIVE",
      },
    });

    console.log(`Admin created successfully for ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });