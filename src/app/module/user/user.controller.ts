
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

  export const UserController = {
  getAllUsers,
  updateUserStatus,
};