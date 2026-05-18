import { plannerAgent, createPlannerAgentInput } from "./agent/index.js";
import { stateAsk } from "./utils/cli.js";

stateAsk(plannerAgent, createPlannerAgentInput());
