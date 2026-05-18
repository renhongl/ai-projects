import { agent as weatherAgent } from "./agent/weatherAgent.js";
import { agent as multiAgent } from "./agent/multiAgent.js";
import { ask } from "./utils/cli.js";
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

ask(multiAgent);
