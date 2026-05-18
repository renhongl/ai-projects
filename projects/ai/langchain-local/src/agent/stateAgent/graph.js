import { StateGraph, END } from "@langchain/langgraph";

import { llm } from "../../utils/llm.js";

import { weatherTool, calculatorTool } from "../../tools/index.js";
import { AgentState } from "./state.js";

async function llmNode(state) {
  const llmWithTools = llm.bindTools([weatherTool, calculatorTool]);
  const response = await llmWithTools.invoke(state.messages);
  return {
    messages: [...state.messages, response],
  };
}

const tools = {
  get_weather: weatherTool,
  calculator: calculatorTool,
};

async function toolNode(state) {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.tool_calls || [];
  const results = [];
  for (const call of toolCalls) {
    const tool = tools[call.name];
    if (!tool) continue;
    const result = await tool.invoke(call.args);
    results.push({
      role: "tool",
      content: result,
      tool_call_id: call.id,
    });
  }
  return {
    messages: [...state.messages, ...results],
  };
}

function router(state) {
  const last = state.messages[state.messages.length - 1];
  if (last.tool_calls?.length > 0) {
    return "tool";
  }

  return "end";
}

const graph = new StateGraph({
  channels: AgentState,
});

graph.addNode("llm", llmNode);
graph.addNode("tool", toolNode);

graph.setEntryPoint("llm");

graph.addConditionalEdges("llm", router, {
  tool: "tool",
  end: END,
});

graph.addEdge("tool", "llm");

export const stateAgent = graph.compile();
