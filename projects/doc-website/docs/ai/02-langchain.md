

# LangChain



LangChain 是一个用于构建 LLM 应用的框架，它的核心不是“聊天”，而是：

> 👉 把大模型变成“可调用工具的智能程序”


## 一、你要先理解 LangChain 在做什么

一句话：

> LLM + 工具 + 流程控制 = AI 应用

---

### 传统 LLM：

```text
用户 → 模型 → 输出
```

---

### LangChain：

```text
用户 → 模型 → 判断 → tool → 再模型 → 输出
```

它多了三样东西：

* Prompt 管理
* Tool 调用
* Workflow（链 / agent）

---

## 二、核心概念（必须掌握）

### 1️⃣ LLM（模型）

就是：

* GPT
* Qwen
* Llama
* LM Studio / Ollama 本地模型

---

### 2️⃣ PromptTemplate

用于结构化输入：

```ts
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是一个天气助手"],
  ["human", "{input}"],
]);
```

👉 本质：模板化 prompt

---

### 3️⃣ Tool（工具）

比如：

* 查天气
* 查数据库
* 调 API

---

### 4️⃣ Agent（最重要）

Agent = “会自己决定要不要调用 tool 的模型”

---

## 三、第一个 LangChain Demo（最简单）

```ts
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  apiKey: process.env.OPENAI_API_KEY,
});

const res = await model.invoke("你好");
console.log(res.content);
```

---

## 四、加入 Prompt（结构化）

```ts
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "你是一个天气助手"],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

const res = await chain.invoke({
  input: "北京天气怎么样？",
});
```

---

## 五、加入 Tool（核心能力）

```ts
import { tool } from "@langchain/core/tools";

const weatherTool = tool(
  async ({ city }) => {
    return `城市 ${city} 当前 20°C`;
  },
  {
    name: "get_weather",
    description: "获取天气",
    schema: {
      type: "object",
      properties: {
        city: { type: "string" },
      },
      required: ["city"],
    },
  }
);
```

---

## 六、创建 Agent（关键）

```ts
import { createReactAgent } from "@langchain/langgraph/prebuilt";

const agent = await createReactAgent({
  llm: model,
  tools: [weatherTool],
});
```

---

## 七、运行 Agent

```ts
const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "北京天气怎么样？",
    },
  ],
});

console.log(result.messages);
```

---

## 八、你会看到发生了什么

Agent 会自动：

```text
1. 判断：需要天气信息
2. 调用 get_weather tool
3. 获取结果
4. 再总结成自然语言
```

---

## 九、加入本地模型（Ollama / LM Studio）

你可以不用 API，用本地模型：

### LM Studio（推荐）

```ts
const model = new ChatOpenAI({
  model: "qwen2.5-14b-instruct",
  apiKey: "lm-studio",
  configuration: {
    baseURL: "http://localhost:1234/v1",
  },
});
```

---

## 十、做一个完整天气 Agent（你最终目标）

你最终系统：

```text
用户输入
   ↓
Agent
   ↓
判断是否需要 tool
   ↓
get_weather API
   ↓
LLM总结
   ↓
返回结果
```

---

## 十一、常见问题（非常重要）

### ❌ 1. tool 不调用

原因：

* 模型不支持 tool calling
* prompt 没约束
* temperature 太高

---

### ❌ 2. tool name 丢失

原因：

* 本地模型（Ollama）不稳定

---

### ❌ 3. agent 直接回答不调用 tool

原因：

* 模型太“自由”
* 没有强 system prompt

---

## 十二、进阶路线（非常重要）

如果你学完上面，你可以继续：

---

### 1️⃣ LangGraph（推荐下一步）

LangGraph

👉 做：

* 多 tool agent
* loop
* 状态机

---

### 2️⃣ 多工具系统

* weather
* search
* calculator

---

### 3️⃣ CLI AI Agent

* readline 输入
* streaming 输出

---

### 4️⃣ 前端 AI 应用

* React Chat UI
* streaming response
* tool 可视化

---

## 十三、一句话总结

> LangChain 的本质不是“调用模型”，而是“让模型学会调用工具 + 控制流程”。

---

如果你下一步想，我可以帮你直接升级：

* 🚀 从 0 写一个 CLI AI Agent（可输入天气/搜索）
* 🚀 LangGraph 完整项目结构
* 🚀 前端 React AI Chat（带 streaming）
* 🚀 Cursor 同款 agent 架构

这个已经是 AI 工程核心能力了。
