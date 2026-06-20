import { catchAsync } from "../../../shared/catchAsync.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import { HomeService } from "./home.service.js";

const getHome = catchAsync(async (req, res) => {
  const data = await HomeService.getHomeData();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Home data retrieved",
    data,
  });
});

export const HomeController = { getHome };
