import { Router } from "express";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { BlogController } from "./blog.controller.js";
import { BlogValidation } from "./blog.validation.js";

const router = Router();

router.get("/", BlogController.getAllPosts);
router.get("/:id", BlogController.getPostById);
router.post(
  "/",
  auth("ADMIN", "PROVIDER"),
  validateRequest(BlogValidation.createBlogSchema),
  BlogController.createPost
);
router.patch(
  "/:id",
  auth("ADMIN", "PROVIDER"),
  validateRequest(BlogValidation.updateBlogSchema),
  BlogController.updatePost
);
router.delete(
  "/:id",
  auth("ADMIN", "PROVIDER"),
  BlogController.deletePost
);

export const BlogRoutes = router;
