import { prisma } from "../../../lib/prisma.js";
import AppError from "../../errors/appError.js";

const getAllPosts = async () => {
  return prisma.blogPost.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPostById = async (id: string) => {
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!post) {
    throw new AppError(404, "Blog post not found");
  }

  return post;
};

const createPost = async (authorId: string, data: { title: string; content: string; isPublished?: boolean }) => {
  return prisma.blogPost.create({
    data: {
      authorId,
      title: data.title,
      content: data.content,
      isPublished: data.isPublished ?? true,
    },
  });
};

const updatePost = async (userId: string, id: string, data: { title?: string; content?: string; isPublished?: boolean }) => {
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    throw new AppError(404, "Blog post not found");
  }

  if (post.authorId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return prisma.blogPost.update({
    where: { id },
    data: {
      title: data.title ?? post.title,
      content: data.content ?? post.content,
      isPublished: data.isPublished ?? post.isPublished,
    },
  });
};

const deletePost = async (userId: string, id: string) => {
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    throw new AppError(404, "Blog post not found");
  }

  if (post.authorId !== userId) {
    throw new AppError(403, "Forbidden");
  }

  return prisma.blogPost.delete({ where: { id } });
};

export const BlogService = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
