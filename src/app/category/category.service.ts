import { prisma } from "../../lib/prisma";
import AppError from "../errors/appError";


const createCategory = async (
  payload: {
    name: string;
  }
) => {
  const existingCategory =
    await prisma.category.findUnique({
      where: {
        name: payload.name,
      },
    });

  if (existingCategory) {
    throw new AppError(
      400,
      "Category already exists"
    );
  }

  const result =
    await prisma.category.create({
      data: payload,
    });

  return result;
};

const getAllCategories = async () => {
  const result =
    await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return result;
};

const getSingleCategory = async (
  id: string
) => {
  const category =
    await prisma.category.findUnique({
      where: { id },
    });

  if (!category) {
    throw new AppError(
      404,
      "Category not found"
    );
  }

  return category;
};

const updateCategory = async (
  id: string,
  payload: {
    name?: string;
  }
) => {
  const category =
    await prisma.category.findUnique({
      where: { id },
    });

  if (!category) {
    throw new AppError(
      404,
      "Category not found"
    );
  }

  const result =
    await prisma.category.update({
      where: { id },
      data: payload,
    });

  return result;
};

const deleteCategory = async (
  id: string
) => {
  const category =
    await prisma.category.findUnique({
      where: { id },
    });

  if (!category) {
    throw new AppError(
      404,
      "Category not found"
    );
  }

  await prisma.category.delete({
    where: { id },
  });

  return null;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};