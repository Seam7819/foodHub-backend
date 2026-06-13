import { prisma } from "../../lib/prisma";

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

export const AuthService = {
    getMe,
}

