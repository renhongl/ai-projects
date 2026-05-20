import {
  plannerAgent,
  createPlannerAgentInput,
  stateAgent,
} from "./agent/index.js";
import { stateCli, plannerCli } from "./utils/cli.js";

// plannerCli(plannerAgent, createPlannerAgentInput());

stateCli(stateAgent);
