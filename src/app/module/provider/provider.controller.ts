
import { catchAsync } from "../../../shared/catchAsync.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import { ProviderService } from "./provider.service.js";

const getAllProviders =
  catchAsync(async (req, res) => {
    const result =
      await ProviderService.getAllProviders();

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message:
        "Providers retrieved successfully",
      data: result,
    });
  });

const getSingleProvider =
  catchAsync(async (req, res) => {
    const result =
      await ProviderService.getSingleProvider(
        req.params.id as string
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message:
        "Provider retrieved successfully",
      data: result,
    });
  });

const updateProviderProfile =
  catchAsync(async (req, res) => {
    const result =
      await ProviderService.updateProviderProfile(
        req.user!.id,
        req.body
      );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message:
        "Provider updated successfully",
      data: result,
    });
  });

export const ProviderController = {
  getAllProviders,
  getSingleProvider,
  updateProviderProfile,
};