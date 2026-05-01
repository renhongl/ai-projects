#!/usr/bin/env node

import { parseArgs } from "node:util";
import { runAgentLoop } from "./agent-loop.js";
import { createProvider } from "./providers/demo-provider.js";
import { createToolRegistry } from "./tools/registry.js";
import { loadConfig } from "./utils/config.js";

const HELP_TEXT = `
Usage:
  node ./src/cli.js ask "your prompt"
  node ./src/cli.js ask "your prompt" --verbose

Examples:
  node ./src/cli.js ask "请回显 hello"
  node ./src/cli.js ask "请告诉我当前目录"
`;

function renderVerboseEvent(event) {
  if (event.type === "assistant") {
    console.log(`\n[turn ${event.turnCount}] assistant response`);
    console.log(JSON.stringify(event.response.content, null, 2));
    return;
  }

  if (event.type === "tool_result") {
    console.log(`\n[turn ${event.turnCount}] tool result: ${event.toolName}`);
    console.log(event.toolResult.content);
  }
}

async function main() {
  const parsed = parseArgs({
    allowPositionals: true,
    options: {
      verbose: {
        type: "boolean",
        short: "v"
      }
    }
  });

  const [command, ...rest] = parsed.positionals;

  if (!command || command === "help" || command === "--help") {
    console.log(HELP_TEXT.trim());
    return;
  }

  if (command !== "ask") {
    console.error(`Unknown command: ${command}`);
    console.log(HELP_TEXT.trim());
    process.exitCode = 1;
    return;
  }

  const query = rest.join(" ").trim();

  if (!query) {
    console.error("Please provide a prompt after the ask command.");
    process.exitCode = 1;
    return;
  }

  const config = loadConfig();
  const provider = createProvider(config);
  const tools = createToolRegistry(config);

  const result = await runAgentLoop({
    query,
    provider,
    tools,
    systemPrompt:
      "You are a minimal CLI agent. Use tools when the user asks for file system or shell related facts.",
    onTurn: parsed.values.verbose ? renderVerboseEvent : undefined
  });

  if (result.outputText) {
    console.log(`\n${result.outputText}`);
  }

  if (result.stopReason === "max_turns") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
