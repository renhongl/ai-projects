import { ChatOpenAICompletions } from "@langchain/openai";

export const llm = new ChatOpenAICompletions({
  model: "lmstudio-model",
  temperature: 0,
  configuration: {
    baseURL: "http://localhost:1234/v1",
  },
  apiKey: "lm-studio",
  streaming: true,
});
