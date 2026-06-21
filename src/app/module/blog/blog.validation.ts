import { z } from "zod";

const createBlogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  isPublished: z.boolean().optional(),
});

const updateBlogSchema = z.object({
  title: z.string().min(5).optional(),
  content: z.string().min(20).optional(),
  isPublished: z.boolean().optional(),
});

export const BlogValidation = {
  createBlogSchema,
  updateBlogSchema,
};
