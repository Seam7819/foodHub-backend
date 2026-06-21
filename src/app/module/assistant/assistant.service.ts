import getOpenAI from "../../../helpers/openaiHelper.js";
import AppError from "../../errors/appError.js";

const sendPrompt = async (
  userId: string,
  prompt: string
) => {
  if (!prompt || prompt.trim().length === 0) {
    throw new AppError(400, "Prompt is required");
  }

  const openai = getOpenAI();
  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    max_output_tokens: 300,
  });

  const firstOutput = response.output[0] as any;

  return {
    prompt,
    response:
      Array.isArray(firstOutput?.content)
        ? firstOutput.content[0]?.text ?? ""
        : "",
  };
};

export const AssistantService = {
  sendPrompt,
};
