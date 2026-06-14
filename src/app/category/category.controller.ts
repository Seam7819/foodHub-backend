import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { sendResponse } from "../../shared/sendResponse";
import { catchAsync } from "../../shared/catchAsync";

const createCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.createCategory(
        req.body
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Category created successfully",
      data: result,
    });
  }
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.getAllCategories();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Categories retrieved successfully",
      data: result,
    });
  }
);

const getSingleCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.getSingleCategory(
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Category retrieved successfully",
      data: result,
    });
  }
);

const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await CategoryService.updateCategory(
        req.params.id as string,
        req.body
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Category updated successfully",
      data: result,
    });
  }
);

const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
    await CategoryService.deleteCategory(
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Category deleted successfully",
      data: null,
    });
  }
);

export const CategoryController = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};