
import { catchAsync } from "../../../shared/catchAsync.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import { DashboardService } from "./dashboard.service.js";

const getAdminDashboardStats =
  catchAsync(
    async (req, res) => {
      const result =
        await DashboardService.getAdminDashboardStats();

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message:
          "Dashboard statistics retrieved successfully",
        data: result,
      });
    }
  );

export const DashboardController = {
  getAdminDashboardStats,
};