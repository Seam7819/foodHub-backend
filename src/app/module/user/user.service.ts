import { prisma } from "../../../lib/prisma.js";
import { UserStatus } from "../../../generated/enums.js";
import AppError from "../../errors/appError.js";

const updateUserStatus = async (
  userId: string,
  status: string
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

  if (!user) {
    throw new AppError(
      404,
      "User not found"
    );
  }

  return prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      status:
        status as UserStatus,
    },
  });
};
const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const UserService = {
  getAllUsers,
  updateUserStatus,
};