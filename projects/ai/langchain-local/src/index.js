import { weatherAgent, multiAgent, stateAgent } from "./agent/index.js";
import { ask, stateAsk } from "./utils/cli.js";
// const result = await agent.invoke({
//   messages: [
//     {
//       role: "user",
//       content: "What is the weather like in 北京?",
//     },
//   ],
// });

// const lastMessage = result.messages?.[result.messages.length - 1];
// console.log(lastMessage?.content ?? result);

stateAsk(stateAgent);
