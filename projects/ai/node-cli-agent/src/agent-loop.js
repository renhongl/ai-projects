function normalizeToolResultContent(value) {
  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

function blocksToText(blocks) {
  return blocks
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

export function createInitialState(query) {
  return {
    messages: [{ role: "user", content: query }],
    turnCount: 1,
    transitionReason: null
  };
}

export async function runAgentLoop({
  query,
  provider,
  tools,
  systemPrompt,
  maxTurns = 8,
  onTurn
}) {
  const state = createInitialState(query);

  while (state.turnCount <= maxTurns) {
    const response = await provider.respond({
      systemPrompt,
      messages: state.messages,
      tools: tools.getDefinitions()
    });

    state.messages.push({
      role: "assistant",
      content: response.content
    });

    await onTurn?.({
      type: "assistant",
      turnCount: state.turnCount,
      response
    });

    if (response.stopReason !== "tool_use") {
      state.transitionReason = null;

      return {
        state,
        outputText: blocksToText(response.content),
        stopReason: response.stopReason
      };
    }

    const results = [];

    for (const block of response.content) {
      if (block.type !== "tool_use") {
        continue;
      }

      const output = await tools.execute(block.name, block.input);
      const toolResult = {
        type: "tool_result",
        toolUseId: block.id,
        toolName: block.name,
        content: normalizeToolResultContent(output)
      };

      results.push(toolResult);

      await onTurn?.({
        type: "tool_result",
        turnCount: state.turnCount,
        toolName: block.name,
        toolResult
      });
    }

    state.messages.push({
      role: "user",
      content: results
    });
    state.turnCount += 1;
    state.transitionReason = "tool_result";
  }

  return {
    state,
    outputText: "Agent reached the maximum number of turns.",
    stopReason: "max_turns"
  };
}
