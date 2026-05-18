import { END, StateGraph } from "@langchain/langgraph";
import {
  executorNode,
  finalizerNode,
  plannerNode,
  progressNode,
  routeAfterExecutor,
  routeAfterProgress,
  toolNode,
} from "./nodes.js";
import { PlannerAgentState } from "./state.js";

const graph = new StateGraph({
  channels: PlannerAgentState,
});

graph.addNode("planner", plannerNode);
graph.addNode("executor", executorNode);
graph.addNode("tool", toolNode);
graph.addNode("progress", progressNode);
graph.addNode("finalize", finalizerNode);

graph.setEntryPoint("planner");

graph.addEdge("planner", "executor");
graph.addConditionalEdges("executor", routeAfterExecutor, {
  tool: "tool",
  progress: "progress",
});
graph.addEdge("tool", "executor");
graph.addConditionalEdges("progress", routeAfterProgress, {
  executor: "executor",
  finalize: "finalize",
});
graph.addEdge("finalize", END);

export const plannerAgent = graph.compile();
