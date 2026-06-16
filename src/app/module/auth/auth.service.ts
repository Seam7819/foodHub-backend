import bcrypt from "bcrypt";




import { generateToken } from "../../../helpers/jwtHelper";

import { AppError } from "../../errors/appError";
import { Role } from "../../../generated/enums";
import { prisma } from "../../../lib/prisma";
import config from "../../../config";

const registerUser = async (
  payload: any
) => {

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

  if (existingUser) {
    throw new AppError(
      400,
      "Email already exists"
    );
  }


  const hashedPassword =
    await bcrypt.hash(
      payload.password,
      12
    );

  const result =
    await prisma.$transaction(
      async (tx) => {
        const user =
          await tx.user.create({
            data: {
              name: payload.name,
              email: payload.email,
              password:
                hashedPassword,
              role:
                payload.role as Role,
            },
          });

        if (payload.role === "PROVIDER") {
          if (!payload.businessName || !payload.address) {
            throw new AppError(
              400,
              "Business name and address are required"
            );
          }
        }

        {
          await tx.providerProfile.create(
            {
              data: {
                businessName:
                  payload.businessName!,
                address:
                  payload.address!,
                userId: user.id,
              },
            }
          );
        }

        return user;
      }
    );

  return result;
};

const loginUser = async (
  payload: any
) => {
  const user =
    await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

  if (!user) {
    throw new AppError(
      404,
      "User not found"
    );
  }

  const matched =
    await bcrypt.compare(
      payload.password,
      user.password
    );

  if (!matched) {
    throw new AppError(
      401,
      "Invalid credentials"
    );
  }
  const { password, ...safeUser } = user;
  const accessToken =
    generateToken(
      {
        id: user.id,
        role: user.role,
      },
      config.jwt
        .accessSecret as string,
      config.jwt
        .accessExpiresIn as string
    );

  const jwtPayload = {
    id: user.id,
    role: user.role,
  };
  const refreshToken =
    generateToken(
      jwtPayload,
      process.env.JWT_REFRESH_SECRET!,
      process.env.JWT_REFRESH_EXPIRES_IN!
    );

  return {
    accessToken,
    refreshToken,
    user: safeUser,
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};