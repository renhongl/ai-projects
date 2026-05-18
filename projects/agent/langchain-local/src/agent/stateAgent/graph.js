import { StateGraph, END } from "@langchain/langgraph";

import { llm } from "../../utils/llm.js";

import { weatherTool, calculatorTool } from "../../tools/index.js";
import { AgentState } from "./state.js";
import { updateMemory } from "./memory.js";

async function llmNode(state) {
  const llmWithTools = llm.bindTools([weatherTool, calculatorTool]);
  const response = await llmWithTools.invoke(state.messages);
  return {
    messages: [...state.messages, response],
  };
}

async function streamLlmNode(state) {
  if (!state.memory) {
    state.memory = {};
  }
  const newMemory = updateMemory(state.memory, state.messages);
  const memoryText = `
  用户信息：
  - 姓名：${newMemory.userName || "未知"}
  - 位置：${newMemory.location || "未知"}
  `;
  const messages = [
    {
      role: "system",
      content: `
        你是一个带记忆的助手。
        ${memoryText}
      `,
    },
    ...state.messages,
  ];
  const llmWithTools = llm.bindTools([weatherTool, calculatorTool]);
  const stream = await llmWithTools.stream(messages);
  let finalMessage;
  for await (const chunk of stream) {
    process.stdout.write(chunk.content || "");
    if (!finalMessage) {
      finalMessage = chunk;
    } else {
      finalMessage = finalMessage.concat(chunk);
    }
  }

  console.log("\n");

  return {
    messages: [...state.messages, finalMessage],
    memory: newMemory,
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
    console.log(`\n🔧 调用工具: ${call.name}`);
    const tool = tools[call.name];
    if (!tool) continue;
    const result = await tool.invoke(call.args);
    console.log("📦 Tool结果:", result);
    results.push({
      role: "tool",
      content: result,
      tool_call_id: call.id,
    });
  }
  const newMemory = updateMemory(state.memory, state.messages);

  return {
    messages: [...state.messages, ...results],
    memory: newMemory,
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

graph.addNode("llm", streamLlmNode);
graph.addNode("tool", toolNode);

graph.setEntryPoint("llm");

graph.addConditionalEdges("llm", router, {
  tool: "tool",
  end: END,
});

graph.addEdge("tool", "llm");

export const stateAgent = graph.compile();
