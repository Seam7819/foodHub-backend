import { Router } from "express";


import { CategoryController } from "./category.controller";
import { CategoryValidation } from "./category.validation";
import validateRequest from "../middleware/validateRequest";
import auth from "../middleware/auth";

const router = Router();

router.post(
  "/",
  auth("ADMIN"),
  validateRequest(
    CategoryValidation.createCategoryValidationSchema
  ),
  CategoryController.createCategory
);

router.get(
  "/",
  CategoryController.getAllCategories
);

router.get(
  "/:id",
  CategoryController.getSingleCategory
);

router.patch(
  "/:id",
  auth("ADMIN"),
  validateRequest(
    CategoryValidation.updateCategoryValidationSchema
  ),
  CategoryController.updateCategory
);

router.delete(
  "/:id",
  auth("ADMIN"),
  CategoryController.deleteCategory
);

export const CategoryRoutes = router;