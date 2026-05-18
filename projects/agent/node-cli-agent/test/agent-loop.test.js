import test from "node:test";
import assert from "node:assert/strict";
import { runAgentLoop } from "../src/agent-loop.js";

test("agent loop should write assistant and tool results back into messages", async () => {
  const provider = {
    async respond({ messages }) {
      const lastMessage = messages[messages.length - 1];

      if (typeof lastMessage.content === "string") {
        return {
          stopReason: "tool_use",
          content: [
            { type: "text", text: "Need a tool." },
            {
              type: "tool_use",
              id: "toolu_1",
              name: "echo",
              input: { text: "hello" }
            }
          ]
        };
      }

      return {
        stopReason: "end_turn",
        content: [{ type: "text", text: "done" }]
      };
    }
  };

  const tools = {
    getDefinitions() {
      return [];
    },
    async execute() {
      return "hello";
    }
  };

  const result = await runAgentLoop({
    query: "test",
    provider,
    tools
  });

  assert.equal(result.outputText, "done");
  assert.equal(result.state.messages.length, 4);
  assert.equal(result.state.messages[1].role, "assistant");
  assert.equal(result.state.messages[2].role, "user");
  assert.equal(result.state.messages[2].content[0].type, "tool_result");
});
