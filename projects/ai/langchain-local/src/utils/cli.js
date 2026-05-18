import readline from "node:readline";
// import { agent } from "../agent/weatherAgent.js";
import { AgentState } from "../agent/stateAgent/state.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function ask(agent) {
  rl.question("请输入问题：", async (input) => {
    if (input === "exit") {
      rl.close();
      return;
    }

    const result = await agent.invoke({
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    const lastMessage = result.messages?.[result.messages.length - 1];

    console.log("\n🤖 AI:", lastMessage?.content ?? result, "\n");

    ask(agent); // 继续循环输入
  });
}

export function stateAsk(agent, initState = AgentState) {
  rl.question("请输入问题：", async (input) => {
    if (input === "exit") {
      rl.close();
      return;
    }

    initState.messages.push({
      role: "user",
      content: input,
    });

    const result = await agent.invoke(initState);

    const lastMessage = result.messages?.[result.messages.length - 1];

    initState.messages = result.messages;

    console.log("\n🤖 AI:", lastMessage?.content ?? result, "\n");

    stateAsk(agent, initState); // 继续循环输入
  });
}
