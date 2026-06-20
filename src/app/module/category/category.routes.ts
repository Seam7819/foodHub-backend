import { Router } from "express";


import { CategoryController } from "./category.controller.js";
import { CategoryValidation } from "./category.validation.js";
import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

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