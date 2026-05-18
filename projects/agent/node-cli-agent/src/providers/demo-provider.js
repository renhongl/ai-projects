function getLastMessage(messages) {
  return messages[messages.length - 1];
}

function getToolResultsFromMessage(message) {
  if (!message || !Array.isArray(message.content)) {
    return [];
  }

  return message.content.filter((block) => block.type === "tool_result");
}

function createTextResponse(text) {
  return {
    stopReason: "end_turn",
    content: [{ type: "text", text }]
  };
}

function createToolUseResponse(toolUse) {
  return {
    stopReason: "tool_use",
    content: [
      {
        type: "text",
        text: `我需要先调用工具 ${toolUse.name}，再继续回答。`
      },
      toolUse
    ]
  };
}

function inferShellCommand(query) {
  const normalized = query.toLowerCase();

  if (
    normalized.includes("当前目录") ||
    normalized.includes("working directory") ||
    normalized.includes("pwd")
  ) {
    return process.platform === "win32" ? "Get-Location" : "pwd";
  }

  if (
    normalized.includes("列出") ||
    normalized.includes("list files") ||
    normalized.includes("目录内容")
  ) {
    return process.platform === "win32" ? "Get-ChildItem" : "ls";
  }

  return null;
}

export function createProvider(config) {
  return {
    name: config.provider,
    async respond({ messages }) {
      const lastMessage = getLastMessage(messages);

      if (typeof lastMessage?.content === "string") {
        const query = lastMessage.content;

        if (query.includes("回显") || query.toLowerCase().startsWith("echo ")) {
          const text = query.replace(/^请?回显\s*/u, "").replace(/^echo\s+/iu, "");

          return createToolUseResponse({
            type: "tool_use",
            id: "toolu_echo_1",
            name: "echo",
            input: { text: text || query }
          });
        }

        const shellCommand = inferShellCommand(query);

        if (shellCommand) {
          return createToolUseResponse({
            type: "tool_use",
            id: "toolu_shell_1",
            name: "shell",
            input: { command: shellCommand }
          });
        }

        return createTextResponse(
          [
            "这是一个最小 demo provider。",
            "目前它只会两类动作：",
            "1. 处理“回显”请求",
            "2. 处理“当前目录 / 列出目录”这类需要 shell 工具的请求",
            "你接下来可以把这里替换成真正的模型调用。"
          ].join("\n")
        );
      }

      const toolResults = getToolResultsFromMessage(lastMessage);

      if (toolResults.length > 0) {
        const summaries = toolResults.map(
          (item) => `工具 ${item.toolName} 的结果如下：\n${item.content}`
        );

        return createTextResponse(summaries.join("\n\n"));
      }

      return createTextResponse("没有拿到可继续处理的消息。");
    }
  };
}
