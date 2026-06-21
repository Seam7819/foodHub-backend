import { catchAsync } from "../../../shared/catchAsync.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import { BlogService } from "./blog.service.js";

const getAllPosts = catchAsync(async (req, res) => {
  const result = await BlogService.getAllPosts();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Blog posts retrieved successfully",
    data: result,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const result = await BlogService.getPostById(req.params.id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Blog post retrieved successfully",
    data: result,
  });
});

const createPost = catchAsync(async (req, res) => {
  const result = await BlogService.createPost(req.user!.id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Blog post created successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res) => {
  const result = await BlogService.updatePost(
    req.user!.id,
    req.params.id as string,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Blog post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res) => {
  const result = await BlogService.deletePost(
    req.user!.id,
    req.params.id as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Blog post deleted successfully",
    data: result,
  });
});

export const BlogController = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
