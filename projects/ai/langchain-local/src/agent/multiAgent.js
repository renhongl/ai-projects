import { createReactAgent } from "@langchain/langgraph/prebuilt";

import { llm } from "../utils/llm.js";

import { weatherTool } from "../tools/weatherTool.js";
import { calculatorTool } from "../tools/calculatorTool.js";

export const agent = await createReactAgent({
  llm,
  tools: [weatherTool, calculatorTool],
  systemMessage: `
  你是一个多工具智能助手：
  你可以使用以下工具：
  1. get_weather: 查询天气
  2. calculator: 计算数学表达式
  
  规则：
  - 天气问题： 用get_weather
  - 数学问题: 用calculator`,
});
