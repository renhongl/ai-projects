export const PlannerAgentState = {
  messages: {
    value: (left, right) => left.concat(right),
    default: () => [],
  },
  memory: {
    value: (_, right) => right,
    default: () => ({}),
  },
  plan: {
    value: (_, right) => right,
    default: () => null,
  },
  currentStep: {
    value: (_, right) => right,
    default: () => 0,
  },
  stepResults: {
    value: (_, right) => right,
    default: () => [],
  },
};

export function createPlannerAgentInput() {
  return {
    messages: [],
    memory: {},
    plan: null,
    currentStep: 0,
    stepResults: [],
  };
}
