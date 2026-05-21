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

const state = {
  messages: [],
  memory: {
    userName: null,
    localtion: null,
  },
};

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

router.get("/api/messages/stream", async (ctx) => {
  ctx.respond = false;

  const res = ctx.res;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });

  res.write("\n");
  const id = Math.random() + "";
  state.messages.push({
    role: "system",
    content: `You are NOT allowed to derive tool_calls from chat history.
      You may only use tool_calls present in the current model output.`,
  });

  state.messages.push({
    id,
    role: "user",
    content: ctx.query.text || "test",
  });
  const threadId = ctx.query.threadId || "default_local_user";
  console.log("----id", id);

  try {
    // ⭐ 关键：必须用 streamEvents（不是 streamValues）
    const stream = await stateAgent.streamEvents(state, {
      version: "v2",
      configurable: {
        thread_id: threadId,
      },
    });

    for await (const event of stream) {
      /**
       * 🔥 重点：过滤 LLM token stream
       */
      if (
        event.event === "on_chat_model_stream" ||
        event.event === "on_llm_stream"
      ) {
        const chunk = event.data?.chunk;

        const text = chunk?.content;

        if (!text) continue;

        res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
      }

      // 可选：结束
      if (event.event === "on_llm_end") {
        res.write(`data: [DONE]\n\n`);
        res.end();
      }
    }
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }

  ctx.req.on("close", () => {
    res.end();
  });
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
