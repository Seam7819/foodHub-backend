import { catchAsync } from "../../../shared/catchAsync";
import { sendResponse } from "../../../shared/sendResponse";
import { HomeService } from "./home.service";

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
