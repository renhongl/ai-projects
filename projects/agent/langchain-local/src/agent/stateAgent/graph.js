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

async function streamLlmNode(state) {
  if (!state.memory) {
    state.memory = {};
  }
  const newMemory = updateMemory(state.memory, state.messages);
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
    {
      role: 'system',
      content: `1. 你在解析tool时，只使用最新一条用户的消息解析，不要对历史消息解析tool，每次最多返回一个tool。\n
                2. 将摄像头控制的命令相关的历史消息忽略，只有最新的用户消息是摄像头控制才执行对应的tool。\n
                3. 每次回答只回答最新的问题，或者根据最新的问题调用工具，不要在每个消息里都包含历史消息的信息。更不要每个消息都去执行历史消息对应的工具。
      `,
    },
    ...state.messages,
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
  const newMemory = updateMemory(state.memory, state.messages);

  return {
    messages: [...state.messages, ...results],
    memory: newMemory,
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
