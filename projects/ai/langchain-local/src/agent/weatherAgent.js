import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { weatherTool } from "../tools/getWeather.js";
import { model } from "../utils/llm.js";

export const agent = await createReactAgent({
  llm: model,
  tools: [weatherTool],
});
