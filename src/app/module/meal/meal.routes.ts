import { Router } from "express";

import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";

import { MealController } from "./meal.controller";
import { MealValidation } from "./meal.validation";

const router = Router();

router.post(
  "/",
  auth("PROVIDER"),
  validateRequest(
    MealValidation.createMealValidationSchema
  ),
  MealController.createMeal
);

router.get(
  "/",
  MealController.getAllMeals
);

router.get(
  "/:id",
  MealController.getSingleMeal
);

router.patch(
  "/:id",
  auth("PROVIDER"),
  validateRequest(
    MealValidation.updateMealValidationSchema
  ),
  MealController.updateMeal
);

router.delete(
  "/:id",
  auth("PROVIDER"),
  MealController.deleteMeal
);

export const MealRoutes = router;