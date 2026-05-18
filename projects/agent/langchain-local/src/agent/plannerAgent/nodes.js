import * as z from "zod";
import { llm } from "../../utils/llm.js";
import {
  getExecutorPrompt,
  getFinalizerPrompt,
  getPlannerPrompt,
} from "./prompts.js";
import { plannerToolMap, plannerTools } from "./tools.js";
import { getLastMessage, getLatestUserMessage } from "./utils.js";

const PlanSchema = z.object({
  steps: z
    .array(
      z.object({
        description: z.string().min(1),
        needsTool: z.boolean().default(false),
      }),
    )
    .min(1)
    .max(5),
});

export async function plannerNode(state) {
  const latestUserMessage = getLatestUserMessage(state.messages);
  const structuredLLM = llm.withStructuredOutput(PlanSchema);
  const plan = await structuredLLM.invoke([
    {
      role: "system",
      content: getPlannerPrompt(),
    },
    {
      role: "user",
      content: latestUserMessage?.content || "",
    },
  ]);

  return {
    plan: {
      steps: plan.steps.map((step, index) => ({
        id: index + 1,
        description: step.description,
        needsTool: step.needsTool,
        status: index === 0 ? "in_progress" : "pending",
      })),
    },
    currentStep: 0,
    stepResults: [],
  };
}

export async function executorNode(state) {
  const llmWithTools = llm.bindTools(plannerTools);
  const response = await llmWithTools.invoke([
    {
      role: "system",
      content: getExecutorPrompt({
        plan: state.plan,
        currentStep: state.currentStep,
        stepResults: state.stepResults,
      }),
    },
    ...state.messages,
  ]);

  return {
    messages: [response],
  };
}

export async function toolNode(state) {
  const lastMessage = getLastMessage(state.messages);
  const toolCalls = lastMessage?.tool_calls || [];
  const results = [];

  for (const call of toolCalls) {
    const tool = plannerToolMap[call.name];
    if (!tool) {
      continue;
    }

    console.log(`\n[tool] ${call.name}`);
    const result = await tool.invoke(call.args);
    console.log("[tool-result]", result);

    results.push({
      role: "tool",
      content: result,
      tool_call_id: call.id,
    });
  }

  return {
    messages: results,
  };
}

export function progressNode(state) {
  const currentStep = state.plan?.steps?.[state.currentStep];
  const lastMessage = getLastMessage(state.messages);
  const nextStepIndex = state.currentStep + 1;
  const nextStepResults = [
    ...state.stepResults,
    {
      step: currentStep?.description || `Step ${state.currentStep + 1}`,
      result: lastMessage?.content || "",
    },
  ];
  const nextPlan = {
    steps: state.plan.steps.map((step, index) => {
      if (index < nextStepIndex) {
        return { ...step, status: "completed" };
      }

      if (index === nextStepIndex) {
        return { ...step, status: "in_progress" };
      }

      return step;
    }),
  };

  return {
    plan: nextPlan,
    currentStep: nextStepIndex,
    stepResults: nextStepResults,
  };
}

export async function finalizerNode(state) {
  const latestUserMessage = getLatestUserMessage(state.messages);
  const response = await llm.invoke([
    {
      role: "system",
      content: getFinalizerPrompt({
        plan: state.plan,
        stepResults: state.stepResults,
        userRequest: latestUserMessage?.content || "",
      }),
    },
    {
      role: "user",
      content: "Generate the final answer.",
    },
  ]);

  return {
    messages: [response],
  };
}

export function routeAfterExecutor(state) {
  const lastMessage = getLastMessage(state.messages);
  return lastMessage?.tool_calls?.length ? "tool" : "progress";
}

export function routeAfterProgress(state) {
  return state.currentStep >= state.plan.steps.length ? "finalize" : "executor";
}
