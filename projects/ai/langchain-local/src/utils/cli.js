import readline from "node:readline";
// import { agent } from "../agent/weatherAgent.js";
import { AgentState } from "../agent/stateAgent/state.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function cli(agent) {
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

    cli(agent); // 继续循环输入
  });
}

export function stateCli(agent, initState = AgentState) {
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

    stateCli(agent, initState); // 继续循环输入
  });
}

function cloneState(state) {
  return Object.assign({}, state);
}

export function plannerCli(agent, initialState = {}) {
  const state = cloneState(initialState);

  async function loop() {
    rl.question("Input: ", async (input) => {
      if (input === "exit") {
        rl.close();
        return;
      }

      state.messages.push({
        role: "user",
        content: input,
      });

      try {
        const result = await agent.invoke(state);
        const lastMessage = result.messages?.[result.messages.length - 1];

        state.messages = result.messages ?? state.messages;

        if ("memory" in result) {
          state.memory = result.memory;
        }

        if ("plan" in result) {
          state.plan = result.plan;
        }

        if ("currentStep" in result) {
          state.currentStep = result.currentStep;
        }

        if ("stepResults" in result) {
          state.stepResults = result.stepResults;
        }

        console.log("\nAI:", lastMessage?.content ?? result, "\n");
      } catch (error) {
        console.error("\nAgent error:", error, "\n");
      }

      loop();
    });
  }

  loop();
}
