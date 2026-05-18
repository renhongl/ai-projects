import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { weatherTool } from "../tools/weatherTool.js";
import { llm } from "../utils/llm.js";

export const agent = await createReactAgent({
  llm,
  tools: [weatherTool],
});
