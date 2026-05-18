function formatPlanSteps(plan) {
  if (!plan?.steps?.length) {
    return "No plan available.";
  }

  return plan.steps
    .map((step, index) => `${index + 1}. ${step.description}`)
    .join("\n");
}

function formatStepResults(stepResults) {
  if (!stepResults?.length) {
    return "No completed steps yet.";
  }

  return stepResults
    .map(
      (item, index) =>
        `${index + 1}. ${item.step}\nResult: ${item.result || "No result"}`,
    )
    .join("\n\n");
}

export function getPlannerPrompt() {
  return `
You are a task planner.
Break the user's request into a short execution plan with 1 to 5 steps.

Rules:
- Keep steps concrete and executable.
- Preserve the user's language when possible.
- Mark needsTool as true only when a tool is likely required.
  `;
}

export function getExecutorPrompt({ plan, currentStep, stepResults }) {
  return `
You are executing a plan one step at a time.

Full plan:
${formatPlanSteps(plan)}

Current step:
${currentStep + 1}. ${plan.steps[currentStep]?.description || "Unknown step"}

Completed step results:
${formatStepResults(stepResults)}

Rules:
- Focus only on the current step.
- Use tools when needed.
- If you call a tool, wait for the tool result and then continue.
- When you finish the current step, respond with the step result only.
- Do not produce the final overall answer yet.
  `;
}

export function getFinalizerPrompt({ plan, stepResults, userRequest }) {
  return `
You are preparing the final answer for the user.

User request:
${userRequest}

Plan:
${formatPlanSteps(plan)}

Execution results:
${formatStepResults(stepResults)}

Write a concise final answer for the user based on the completed steps.
If the user wrote in Chinese, answer in Chinese.
  `;
}
