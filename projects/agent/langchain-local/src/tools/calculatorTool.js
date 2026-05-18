import { tool } from "@langchain/core/tools";

export const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = eval(expression);
      return `计算结果: ${result}`;
    } catch (_) {
      return "计算错误";
    }
  },
  {
    name: "calculator",
    description: "用于数学计算，例如：2+2*10",
    schema: {
      type: "object",
      properties: {
        expression: { type: "string" },
      },
      required: ["expression"],
    },
  },
);
