
import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { ProviderDashboardService } from "./providerDashboard.service";

const getProviderDashboard =
  catchAsync(
    async (req, res) => {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const result =
        await ProviderDashboardService.getProviderDashboard(
          userId
        );

      sendResponse(res, {
        success: true,
        statusCode: 200,
        message:
          "Provider dashboard retrieved successfully",
        data: result,
      });
    }
  );

export const ProviderDashboardController =
  {
    getProviderDashboard,
  };