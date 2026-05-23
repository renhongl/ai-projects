/* eslint-disable no-undef */
import { StateGraph, END } from '@langchain/langgraph';

import { llm } from '../../utils/llm.js';
import { MemorySaver } from '@langchain/langgraph';

const memory = new MemorySaver();

import {
  weatherTool,
  calculatorTool,
  flightSearchTool,
  cameraControlTool,
} from '../../tools/index.js';
import { AgentState } from './state.js';
import { updateMemory } from './memory.js';

function getCurrentTurnMessages(messages = []) {
  const latestUserIndex = [...messages]
    .map((message) => message.role)
    .lastIndexOf('user');

  if (latestUserIndex === -1) {
    return [];
  }

  return messages.slice(latestUserIndex);
}

async function streamLlmNode(state) {
  if (!state.memory) {
    state.memory = {};
  }
  const newMemory = updateMemory(state.memory, state.messages);
  const currentTurnMessages = getCurrentTurnMessages(state.messages);
  const memoryText = `
  用户信息：
  - 姓名：${newMemory.userName || '未知'}
  - 位置：${newMemory.location || '未知'}
  `;
  const messages = [
    {
      role: 'system',
      content: `
        你是一个带记忆的助手。
        ${memoryText}
      `,
    },
    ...currentTurnMessages,
  ];
  const llmWithTools = llm.bindTools([
    weatherTool,
    calculatorTool,
    flightSearchTool,
    cameraControlTool,
  ]);
  const stream = await llmWithTools.stream(messages);
  let finalMessage;
  for await (const chunk of stream) {
    process.stdout.write(chunk.content || '');
    if (!finalMessage) {
      finalMessage = chunk;
    } else {
      finalMessage = finalMessage.concat(chunk);
    }
  }

  console.log('\n');

  return {
    messages: [...state.messages, finalMessage],
    memory: newMemory,
  };
}

const tools = {
  get_weather: weatherTool,
  calculator: calculatorTool,
  search_flights: flightSearchTool,
  control_camera: cameraControlTool,
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
    console.log('📦 Tool结果:', result);
    results.push({
      role: 'tool',
      content: result,
      tool_call_id: call.id,
    });
  }

  return {
    messages: [...state.messages, ...results],
    memory: state.memory,
  };
}

function router(state) {
  const last = state.messages[state.messages.length - 1];
  if (last.tool_calls?.length > 0) {
    return 'tool';
  }

  return 'end';
}

const graph = new StateGraph({
  channels: AgentState,
});

graph.addNode('llm', streamLlmNode);
graph.addNode('tool', toolNode);

graph.setEntryPoint('llm');

graph.addConditionalEdges('llm', router, {
  tool: 'tool',
  end: END,
});

graph.addEdge('tool', 'llm');

export const stateAgent = graph.compile({
  checkpointer: memory,
});
