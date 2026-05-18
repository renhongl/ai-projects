import { ChatOpenAICompletions } from "@langchain/openai";

export const model = new ChatOpenAICompletions({
  model: "lmstudio-model",
  temperature: 0,
  configuration: {
    baseURL: "http://localhost:1234/v1",
  },
  apiKey: "lm-studio",
});
