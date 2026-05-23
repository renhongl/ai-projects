import { createEmptyMemory } from './memory.js';

export function createInitialAgentState() {
  return {
    messages: [],
    memory: createEmptyMemory(),
  };
}

export const AgentState = createInitialAgentState();
