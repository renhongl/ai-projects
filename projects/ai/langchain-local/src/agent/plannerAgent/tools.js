import { weatherTool, calculatorTool } from "../../tools/index.js";

export const plannerTools = [weatherTool, calculatorTool];

export const plannerToolMap = {
  [weatherTool.name]: weatherTool,
  [calculatorTool.name]: calculatorTool,
};
