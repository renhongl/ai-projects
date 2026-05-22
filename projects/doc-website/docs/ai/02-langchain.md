
# 🦜🔗 The Definitive LangChain.js (Node.js) Tutorial

## Module 1: Introduction & Environment Setup

### 1. What is LangChain.js?

LangChain.js is a powerful framework designed to orchestrate Large Language Models (LLMs) within JavaScript and TypeScript environments.

Recently, LangChain underwent a major architectural shift to become modular. Instead of installing the massive legacy `langchain` package for everything, the ecosystem is now split into:

* **`@langchain/core`**: Contains base abstractions, types, and the LangChain Expression Language (LCEL).
* **Integration Packages (e.g., `@langchain/openai`)**: Individual packages for specific LLM providers, vector stores, or tools to keep your application's dependency footprint minimal.

### 2. Environment Initialization

Ensure your Node.js runtime is version **18 or higher**. Create a new project directory and initialize it:

```bash
mkdir langchain-tutorial && cd langchain-tutorial
npm init -y
npm install @langchain/core @langchain/openai zod

```

Open your `package.json` and add `"type": "module"` to enable native ESM imports:

```json
{
  "name": "langchain-tutorial",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "@langchain/core": "^0.3.0",
    "@langchain/openai": "^0.3.0",
    "zod": "^3.23.0"
  }
}

```

Set up your OpenAI API Key as an environment variable in your terminal:

```bash
export OPENAI_API_KEY="your-api-key-here"

```

---

## Module 2: Chat Models & Prompt Templates

### 1. LLMs vs. Chat Models

* **LLMs (Legacy)**: Take a raw string as input and return a raw string.
* **Chat Models (Modern Standard)**: Take a structured array of **Messages** as input and return an explicit chat message object.

Messages are divided into functional roles:

* `SystemMessage`: Sets the underlying behavior, tone, or constraints of the AI.
* `HumanMessage`: Represents the user's input.
* `AIMessage`: Represents the model's response.

### 2. Prompt Templates

`ChatPromptTemplate` lets you inject dynamic user runtime values safely into structured message sequences, serving as the blueprint for reproducible prompts.

### 💻 Code Example: `02_chat_prompt.js`

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

// Initialize the Chat Model
const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.5,
});

// Build a dynamic prompt blueprint
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are a professional technical writer. Explain concepts in a concise, {tone} manner."],
  ["user", "Explain what {topic} is."],
]);

async function run() {
  // Format the template with dynamic data
  const formattedMessages = await promptTemplate.formatMessages({
    tone: "humorous",
    topic: "JavaScript Promises",
  });

  console.log("--- Formatted Messages Input ---", formattedMessages);

  // Invoke the model
  const response = await model.invoke(formattedMessages);
  
  console.log("\n--- AI Response ---");
  console.log(response.content);
}

run();

```

---

## Module 3: LangChain Expression Language (LCEL)

### 1. The Power of LCEL

LCEL is a declarative language used to link LangChain primitives seamlessly together using the pipe syntax (`.pipe()`). Any component in an LCEL chain shares a unified interface containing commands like `.invoke()`, `.batch()`, and `.stream()`.

### 2. Output Parsers

Instead of writing manual code to parse `response.content`, Output Parsers automate the structural cleanup of an AI message—transforming raw structural output into raw text strings or even validated JSON objects using `zod`.

### 💻 Code Example: `03_lcel_parser.js`

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const model = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });

// Example 1: Simple Text Output Parsing
const textPrompt = ChatPromptTemplate.fromMessages([
  ["user", "Give me a synonym for {word}."],
]);

// Chain: Prompt -> Model -> String Parser
const textChain = textPrompt.pipe(model).pipe(new StringOutputParser());

// Example 2: Complex JSON Parsing with Zod validation
const jsonParser = StructuredOutputParser.fromZodSchema(
  z.object({
    capital: z.string().describe("The capital city"),
    population: z.string().describe("Approximate population size"),
    landmarks: z.array(z.string()).describe("Top 2 famous landmarks"),
  })
);

const jsonPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Answer the user question. You must follow the formatting instructions strictly.\n{format_instructions}"],
  ["user", "Tell me about the country: {country}"],
]);

// Chain: Prompt -> Model -> Structured Parser
const jsonChain = jsonPrompt.pipe(model).pipe(jsonParser);

async function run() {
  // 1. Text Chain Execution
  const simpleResult = await textChain.invoke({ word: "swift" });
  console.log("Simple Text Output:", simpleResult);

  console.log("\n------------------------------------\n");

  // 2. JSON Chain Execution
  const jsonResult = await jsonChain.invoke({
    country: "Japan",
    format_instructions: jsonParser.getFormatInstructions(),
  });
  console.log("Structured JSON Output:", jsonResult);
  console.log("Accessing Property (Landmark 1):", jsonResult.landmarks[0]);
}

run();

```

---

## Module 4: Streaming & Real-Time Delivery

### 1. Real-Time Streaming

Waiting for an LLM to generate long bodies of text entirely before returning data hurts user retention. By changing `.invoke()` to `.stream()`, LangChain breaks down the network connection into an asynchronous iterator that yields text tokens as soon as the model spits them out.

### 💻 Code Example: `04_streaming.js`

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatOpenAI({ modelName: "gpt-4o-mini" });
const prompt = ChatPromptTemplate.fromMessages([
  ["user", "Write a short creative story about a {character} in 150 words."],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

async function run() {
  console.log("Starting Stream...\n");
  
  const stream = await chain.stream({ character: "cyberpunk detective" });

  // Consume stream chunks sequentially in real-time
  for await (const chunk of stream) {
    // process.stdout.write outputs without adding artificial newlines
    process.stdout.write(chunk);
  }
  
  console.log("\n\nStream Finished.");
}

run();

```

---

## Module 5: State & Memory Management

### 1. Handling Conversational History

LLMs are stateless over separate REST calls; they do not remember context unless you re-feed past turns back into the context window.

To accomplish memory tracking automatically without polluting code layers with local arrays, wrap an operational LCEL pipeline inside a `RunnableWithMessageHistory` object.

### 💻 Code Example: `05_memory.js`

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatMessageHistory } from "@langchain/core/chat_history";

const model = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0.7 });

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful companion."],
  new MessagesPlaceholder("history"), // Location where previous chat logs inject
  ["user", "{input}"],
]);

const chain = prompt.pipe(model);

// In-memory key-value dictionary simulating a persistent user session database
const sessionDatabase = {};

const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: async (sessionId) => {
    // Initialize history store if it doesn't exist for the session yet
    if (!sessionDatabase[sessionId]) {
      sessionDatabase[sessionId] = new ChatMessageHistory();
    }
    return sessionDatabase[sessionId];
  },
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

async function run() {
  const config = { configurable: { sessionId: "user_session_abc123" } };

  // First Interaction
  const res1 = await chainWithHistory.invoke({ input: "Hi! My favorite coding language is TypeScript." }, config);
  console.log("AI Turn 1:", res1.content);

  // Second Interaction (Checking memory retention)
  const res2 = await chainWithHistory.invoke({ input: "What language did I say I like?" }, config);
  console.log("\nAI Turn 2:", res2.content);
}

run();

```

---

## Module 6: Retrieval-Augmented Generation (RAG)

### 1. RAG Core Pipeline

Retrieval-Augmented Generation hooks up external documents (PDFs, internal wiki pages, documentation) to your prompt execution layer.

1. **Documents** $\rightarrow$ Split text chunks via token or character sizes.
2. **Embeddings** $\rightarrow$ Convert raw text blocks into lists of numbers containing semantic meaning.
3. **Vector Store** $\rightarrow$ Database storing coordinates of texts.
4. **Retrieval** $\rightarrow$ Find closely related text fragments and paste them as raw context blocks into the LLM system prompt.

For this local module, we use the lightweight, native memory vector library:

```bash
npm install langchain

```

### 💻 Code Example: `06_rag.js`

```javascript
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

const model = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });

async function run() {
  // 1. Prepare raw domain data (mocking data parsed from local manuals)
  const rawDataDocuments = [
    new Document({ pageContent: "Project Phoenix deployment code is: SECURE-9921-X." }),
    new Document({ pageContent: "Corporate policy mandates casual attire on alternating Thursdays." }),
  ];

  // 2. Vectorize texts and load them directly into memory store
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = await MemoryVectorStore.fromDocuments(rawDataDocuments, embeddings);

  // 3. Expose vectorStore as an abstract Retriever interface
  const retriever = vectorStore.asRetriever({ searchType: "similarity", k: 1 });

  // 4. Create prompt that defines how context data is mixed down
  const ragPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Answer the user question using ONLY the provided context blocks below:\n\n{context}"],
    ["user", "{input}"],
  ]);

  // Stuff chain automatically loops over all returned documents and squashes them into the {context} variable
  const documentSynthesisChain = await createStuffDocumentsChain({
    llm: model,
    prompt: ragPrompt,
  });

  // 5. Build final umbrella chain connecting search layer to synthesis layer
  const fullRagChain = await createRetrievalChain({
    retriever,
    combineDocsChain: documentSynthesisChain,
  });

  // 6. Query the system about internal company secrets
  const executionOutput = await fullRagChain.invoke({
    input: "What is the secret deployment code for Project Phoenix?",
  });

  console.log("RAG Answer Response:", executionOutput.answer);
}

run();

```

---

## Module 7: Tool Calling & Agents

### 1. ReAct Architecture

An Agent isn’t just a simple chain. It operates inside a continuous **State Machine** loop (Reasoning + Acting). Given a user instruction, the Agent decides whether it needs an external tool (like a calculator or database search). It invokes the tool, captures the results, passes them back into its context, and repeats until it arrives at a final answer.

Modern LangChain applications build production agents using the core state-graph tool: **LangGraph**.

```bash
npm install @langchain/langgraph

```

### 💻 Code Example: `07_agent.js`

```javascript
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";

// 1. Declare an explicit functional Tool via the tool constructor
const currencyConverterTool = tool(
  async ({ amount, targetCurrency }) => {
    // Mocking real API conversion logic calculation
    const exchangeRate = targetCurrency.toUpperCase() === "EUR" ? 0.92 : 7.25;
    const finalCalculation = amount * exchangeRate;
    return `Calculated result: ${amount} USD converted into ${targetCurrency} equals ${finalCalculation.toFixed(2)} ${targetCurrency}.`;
  },
  {
    name: "currencyConverter",
    description: "Converts US Dollars (USD) into standard foreign currencies like EUR or CNY.",
    schema: z.object({
      amount: z.number().describe("The number value of USD to convert"),
      targetCurrency: z.string().describe("The target code string like EUR or CNY"),
    }),
  }
);

const model = new ChatOpenAI({ modelName: "gpt-4o-mini", temperature: 0 });
const toolsList = [currencyConverterTool];

// 2. Bind the tool execution capability safely into LangGraph's ReAct state engine
const compiledAgentEngine = createReactAgent({
  llm: model,
  tools: toolsList,
});

async function run() {
  console.log("Initializing Agent Thinking loop...");

  const agentStateOutput = await compiledAgentEngine.invoke({
    messages: [
      ["user", "I have 250 USD. How much would that be worth if I convert it to EUR? Please explain."],
    ],
  });

  console.log("\n--- Full Agent Execution Message History Traversal ---");
  for (const message of agentStateOutput.messages) {
    console.log(`[${message._getType()}]:`, message.content || JSON.stringify(message.tool_calls));
  }
}

run();

```