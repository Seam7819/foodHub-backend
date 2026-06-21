import OpenAI from "openai";
import config from "../config/index.js";

let openaiClient: OpenAI | null = null;

const getOpenAI = () => {
  if (openaiClient) return openaiClient;

  if (!config.openai.apiKey) {
    throw new Error(
      "Missing OPENAI_API_KEY environment variable"
    );
  }

  openaiClient = new OpenAI({
    apiKey: config.openai.apiKey,
  });

  return openaiClient;
};

export default getOpenAI;
