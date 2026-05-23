import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyparser from 'koa-bodyparser';
import { stateAgent } from './agent/index.js';
import { createInitialAgentState } from './agent/stateAgent/state.js';

const app = new Koa();
const router = new Router();
const sessions = new Map();

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(bodyparser());

function normalizeStateSnapshot(values = {}) {
  return {
    messages: Array.isArray(values.messages) ? values.messages : [],
    memory: {
      userName: values.memory?.userName ?? null,
      location: values.memory?.location ?? values.memory?.localtion ?? null,
    },
  };
}

function getSession(threadId) {
  if (!sessions.has(threadId)) {
    sessions.set(threadId, createInitialAgentState());
  }

  return sessions.get(threadId);
}

function createInputState(session, text) {
  return {
    messages: [
      ...session.messages,
      {
        id: Math.random() + '',
        role: 'user',
        content: text || 'test',
      },
    ],
    memory: { ...session.memory },
  };
}

async function syncSessionFromGraph(threadId, config, fallbackState) {
  try {
    const snapshot = await stateAgent.getState(config);
    const nextState = normalizeStateSnapshot(snapshot.values);
    sessions.set(threadId, nextState);
    return nextState;
  } catch (error) {
    if (!fallbackState) {
      throw error;
    }

    const nextState = normalizeStateSnapshot(fallbackState);
    sessions.set(threadId, nextState);
    return nextState;
  }
}

router.post('/api/messages', bodyparser(), async (ctx) => {
  const body = ctx.request.body;
  const threadId = body?.threadId || 'default_local_user';
  const session = getSession(threadId);
  const inputState = createInputState(session, body?.text);
  const config = {
    configurable: {
      thread_id: threadId,
    },
  };

  console.log(body);

  const result = await stateAgent.invoke(inputState, config);
  const nextState = await syncSessionFromGraph(threadId, config, result);
  const lastMessage = nextState.messages[nextState.messages.length - 1];

  console.log('\nAI:', lastMessage?.content ?? result, '\n');
  ctx.status = 201;
  ctx.body = {
    message: nextState.messages,
    memory: nextState.memory,
    threadId,
  };
});

router.get('/api/messages/stream', async (ctx) => {
  ctx.respond = false;

  const res = ctx.res;
  const threadId = ctx.query.threadId || 'default_local_user';
  const session = getSession(threadId);
  const inputState = createInputState(session, ctx.query.text);
  const config = {
    version: 'v2',
    configurable: {
      thread_id: threadId,
    },
  };

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  res.write('\n');
  console.log('----threadId', threadId);

  try {
    const stream = await stateAgent.streamEvents(inputState, config);

    for await (const event of stream) {
      if (
        event.event !== 'on_chat_model_stream' &&
        event.event !== 'on_llm_stream'
      ) {
        continue;
      }

      const text = event.data?.chunk?.content;

      if (!text) {
        continue;
      }

      res.write(`data: ${JSON.stringify({ delta: text })}\n\n`);
    }

    await syncSessionFromGraph(threadId, config);
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }

  ctx.req.on('close', () => {
    res.end();
  });
});

const port = 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
