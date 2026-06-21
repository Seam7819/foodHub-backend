import { catchAsync } from "../../../shared/catchAsync.js";
import { sendResponse } from "../../../shared/sendResponse.js";
import { AssistantService } from "./assistant.service.js";

const sendPrompt = catchAsync(async (req, res) => {
  const result = await AssistantService.sendPrompt(
    req.user!.id,
    req.body.prompt
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Assistant response generated successfully",
    data: result,
  });
});

export const AssistantController = {
  sendPrompt,
};
