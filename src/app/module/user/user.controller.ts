
import { catchAsync } from "../../../shared/catchAsync.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import { UserService } from "./user.service.js";

const getAllUsers =
  catchAsync(
    async (req, res) => {
      const result =
        await UserService.getAllUsers();

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message:
          "Users retrieved successfully",
        data: result,
      });
    }
  );

const updateUserStatus =
  catchAsync(
    async (req, res) => {
      const result =
        await UserService.updateUserStatus(
          req.params.id as string,
          req.body.status
        );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message:
          "User status updated successfully",
        data: result,
      });
    }
  );

const getTheme =
  catchAsync(
    async (req, res) => {
      const result =
        await UserService.getTheme(req.user!.id);

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User theme retrieved successfully",
        data: result,
      });
    }
  );

const updateTheme =
  catchAsync(
    async (req, res) => {
      const result =
        await UserService.updateTheme(
          req.user!.id,
          req.body.theme
        );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "User theme updated successfully",
        data: result,
      });
    }
  );

export const UserController = {
  getAllUsers,
  updateUserStatus,
  getTheme,
  updateTheme,
};