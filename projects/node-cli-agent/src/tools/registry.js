import { createEchoTool } from "./echo-tool.js";
import { createShellTool } from "./shell-tool.js";

export function createToolRegistry(config) {
  const tools = [createEchoTool(), createShellTool(config)];
  const toolMap = new Map(tools.map((tool) => [tool.name, tool]));

  return {
    getDefinitions() {
      return tools.map((tool) => tool.definition);
    },
    async execute(name, input) {
      const tool = toolMap.get(name);

      if (!tool) {
        throw new Error(`Unknown tool: ${name}`);
      }

      return tool.execute(input);
    }
  };
}
