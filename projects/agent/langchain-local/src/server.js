import Koa from "koa";
import Router from "@koa/router";
import { stateAgent } from "./agent/index.js";
import cors from "@koa/cors";
import bodyparser from "koa-bodyparser";

const app = new Koa();
const router = new Router();

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(bodyparser());

// 获取消息列表
// router.get("/api/messages", async (ctx) => {
//   ctx.body = getMessages();
// });

const state = {
  messages: [],
  memory: {
    userName: "",
    location: "",
  },
};

// 添加消息
router.post("/api/messages", bodyparser(), async (ctx) => {
  const body = ctx.request.body;
  console.log(body);

  state.messages.push({
    role: "user",
    content: body?.text,
  });

  const result = await stateAgent.invoke(state);

  const lastMessage = result.messages?.[result.messages.length - 1];

  state.messages = result.messages;

  console.log("\n🤖 AI:", lastMessage?.content ?? result, "\n");
  ctx.status = 201;
  ctx.body = { message: result.messages };
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
