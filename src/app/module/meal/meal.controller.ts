import { Request, Response } from "express";
import { MealService } from "./meal.service";
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";

const createMeal = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await MealService.createMeal(
        req.user!.id,
        req.body
      );

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message:
        "Meal created successfully",
      data: result,
    });
  }
);

const getAllMeals = catchAsync(
  async (req: Request, res: Response) => {
    const result =
  await MealService.getAllMeals(
    req.query as Record<
      string,
      any
    >
  );
  sendResponse(res, {
  statusCode: 200,

  success: true,

  message:
    "Meals retrieved successfully",

  meta: result.meta,

  data: result.data,
});
}

)



const getSingleMeal = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await MealService.getSingleMeal(
        req.params.id as string
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Meal retrieved successfully",
      data: result,
    });
  }
);

const updateMeal = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await MealService.updateMeal(
        req.user!.id,
        req.params.id as string,
        req.body
      );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Meal updated successfully",
      data: result,
    });
  }
);

const deleteMeal = catchAsync(
  async (req: Request, res: Response) => {
    await MealService.deleteMeal(
      req.user!.id,
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message:
        "Meal deleted successfully",
      data: null,
    });
  }
);

export const MealController = {
  createMeal,
  getAllMeals,
  getSingleMeal,
  updateMeal,
  deleteMeal,
};