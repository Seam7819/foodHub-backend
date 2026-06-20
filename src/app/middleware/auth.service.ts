import { generateToken, verifyToken } from "../../helpers/jwtHelper.js";
import { prisma } from "../../lib/prisma.js";
import AppError from "../errors/appError.js";

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      status: true,
      createdAt: true,
      
    },
    
  });

  return user;
  
};

 const refreshToken = async (
  token: string
) => {
  if (!token) {
    throw new AppError(
      401,
      "Refresh token required"
    );
  }

  const decoded =
    verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as any;

  const user =
    await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

  if (!user) {
    throw new AppError(
      404,
      "User not found"
    );
  }

  const accessToken =
    generateToken(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_ACCESS_SECRET!,
      process.env.JWT_ACCESS_EXPIRES_IN!
    );

  return {
    accessToken,
  };
};

export const AuthService = {
    getMe,
    refreshToken
}

