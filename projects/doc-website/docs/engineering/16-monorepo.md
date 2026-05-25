# Monorepo 实战复盘

## 结论

当前仓库已经不是“把几个项目放一起”的弱 monorepo 了，而是进入了“有共享层、有统一入口、有基础治理”的可持续状态。

这次补齐了第一优先级里最关键的 4 类共享包：

- `packages/shared-utils`
- `packages/eslint-config`
- `packages/tsconfig`
- `packages/node-sdk`

它们不是空壳目录，而是已经被根配置和子项目真正消费。

## 这次新增的共享包

### `packages/shared-utils`

定位：沉淀跨 Node 项目都能复用的轻量工具。

当前提供了这些能力：

- `parseEnvFile`
- `getFirstDefined`
- `toBoolean`
- `toNumber`
- `toTrimmedString`

落地位置：

- `projects/ai/node-cli-agent/src/utils/config.js` 已改为使用它读取和规范化 `.env`
- `packages/node-sdk` 也复用了它做环境变量解析

设计原则：

- 只放无框架绑定、低耦合、跨项目通用的工具
- 先从“真的重复”开始抽，不做过度封装

### `packages/eslint-config`

定位：把仓库级 ESLint 规则抽成共享配置，而不是把规则永远堆在根目录。

当前提供：

- `createWorkspaceEslintConfig()`

它统一封装了：

- 基础 JS 规则
- 基础 TS 规则
- 浏览器环境 globals
- Node 环境 globals
- type-aware 的 TS 规则

落地位置：

- 根配置 `eslint.config.mjs` 已改成消费这个共享包

这一步很重要，因为它代表规则已经从“文件”升级为“能力”。

### `packages/tsconfig`

定位：统一 TypeScript 项目的编译基线。

当前提供：

- `base.json`
- `nest-service.json`
- `vite-app.json`

落地位置：

- `projects/ai/nest-simple-agent/tsconfig.json` 已改为继承 `packages/tsconfig/nest-service.json`
- `projects/engineering/vite-learning-lab/tsconfig.json` 已改为继承 `packages/tsconfig/vite-app.json`

这样做的价值是：

- TS 项目不再各自维护一套独立基线
- 公共规则只改一处
- 新项目初始化更快

### `packages/node-sdk`

定位：沉淀 Node 服务访问 AI 能力时的统一 SDK 层。

当前提供：

- `readOpenAIConfig`
- `createOpenAIClient`
- `createTextResponse`

落地位置：

- `projects/ai/nest-simple-agent/src/agent/agent.service.ts` 已改为通过 `node-sdk` 读取 OpenAI 配置并发起请求

这一步的核心价值不是“代码变少一点”，而是：

- AI 接入逻辑开始集中
- 以后切换默认模型、接入 baseURL、统一错误处理时，只需要改 SDK
- 未来其他 Node 服务也能直接复用

## 当前仓库结构

```text
ai-projects/
├─ projects/
│  ├─ ai/
│  │  ├─ nest-simple-agent
│  │  └─ node-cli-agent
│  ├─ engineering/
│  │  └─ vite-learning-lab
│  └─ doc-website
├─ packages/
│  ├─ eslint-config
│  ├─ node-sdk
│  ├─ shared-utils
│  └─ tsconfig
├─ tooling/
│  └─ workspace-doctor
├─ eslint.config.mjs
├─ package.json
└─ pnpm-workspace.yaml
```

分层职责现在更明确了：

- `projects/`：真正运行的应用、站点、服务
- `packages/`：可复用能力层
- `tooling/`：仓库治理工具

## 现在它为什么更像一个合格的 monorepo

因为它已经同时具备下面几件事：

- 有统一工作区入口：`pnpm-workspace.yaml`
- 有统一根脚本：`dev/build/test/lint/typecheck`
- 有共享工程配置：`eslint-config`、`tsconfig`
- 有共享业务基础能力：`shared-utils`、`node-sdk`
- 有仓库治理工具：`workspace-doctor`

满足这些条件后，monorepo 的价值才开始真正体现出来：

- 共享不是口头上的，而是代码上的
- 规范不是写在文档里，而是写进工具里
- 新项目不是从零搭，而是接入已有共享层

## 这次做了哪些具体优化

### 1. 补齐共享包

之前 `packages/` 只有占位文件，现在已经变成真实工作区。

### 2. 统一 TS 基线

Nest 项目和 Vite 项目都开始继承统一配置，后续继续新增 TS 项目时，不用再复制粘贴编译选项。

### 3. 统一 ESLint 能力

根目录规则不再是散落配置，而是通过共享工厂函数生成。

### 4. 抽离 AI SDK

Nest AI 服务不再直接在业务类里初始化 OpenAI 客户端，而是复用共享 SDK。

### 5. 抽离环境解析逻辑

CLI 项目的 `.env` 读取和布尔值解析开始复用 `shared-utils`，避免后面每个 Node 项目都自己写一份。

## 对“仓库可正常打包”的说明

从仓库结构和依赖声明上，这次改动已经满足 monorepo 打包的基本要求：

- 所有新增共享包都有自己的 `package.json`
- 所有共享包都有最小 `build/lint/test` 脚本
- `pnpm-lock.yaml` 已同步新增的 workspace importer
- 消费方项目已经接上共享包

根目录理论上应当可以继续通过这些命令聚合执行：

```bash
pnpm build
pnpm lint
pnpm test
pnpm typecheck
pnpm workspace:doctor
```

但需要明确一点：

- 我当前所处终端环境里没有可用的 `node` / `pnpm` 命令
- 所以这次无法在当前会话里实际跑构建命令做最终验证

也就是说，这次做的是**代码层和工作区层的构建自洽**，不是已经在当前环境里跑过 CI 级验证。

## 后续还值得继续做什么

共享包已经有了第一版，下一步最值得做的是：

- 把 `eslint.config.mjs` 继续收敛，逐步让更多项目按共享规则分层
- 给 `node-sdk` 增加统一错误对象和模型默认值策略
- 给 `shared-utils` 补少量测试
- 在 CI 里强制执行 `pnpm workspace:doctor`
- 后续如果共享逻辑继续增加，再考虑 `changesets` 和 `turbo`

## Monorepo 学习教程

下面这部分不是泛泛教材，而是基于你这个仓库的学习路径。

### 第一阶段：先看懂目录，不急着写代码

目标：理解 monorepo 的三个核心目录。

你先只做三件事：

1. 看 `projects/`，理解这里放的是独立运行项目
2. 看 `packages/`，理解这里放的是共享能力
3. 看 `tooling/`，理解这里放的是仓库治理工具

学会这一层后，你就能区分：

- 什么属于业务代码
- 什么属于共享代码
- 什么属于工程基础设施

### 第二阶段：学会从根目录驱动整个仓库

重点看根 `package.json`。

你需要理解这些命令为什么存在：

```bash
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm typecheck
pnpm workspace:doctor
```

学习目标不是记命令，而是理解：

- 为什么 monorepo 要从根目录触发
- 为什么脚本契约比单个项目的自由更重要

### 第三阶段：学会识别“什么值得抽成共享包”

拿当前仓库举例：

- 环境解析被抽成了 `shared-utils`
- OpenAI 接入被抽成了 `node-sdk`
- ESLint 规则被抽成了 `eslint-config`
- TS 编译基线被抽成了 `tsconfig`

判断标准很简单：

- 是否跨项目重复
- 是否会持续演进
- 是否抽出来能降低维护成本

如果只是一个项目私有逻辑，就不要急着抽。

### 第四阶段：学会接共享包，而不是只会建共享包

真正的 monorepo 学习重点不是创建 `packages/xxx` 目录，而是让项目接入它。

你可以顺着这条路径读代码：

1. `eslint.config.mjs` 如何消费 `packages/eslint-config`
2. `nest-simple-agent` 如何消费 `packages/node-sdk`
3. `node-cli-agent` 如何消费 `packages/shared-utils`
4. `vite-learning-lab` 如何消费 `packages/tsconfig`

如果你能把这 4 条接线关系讲清楚，说明你已经理解 monorepo 的核心价值。

### 第五阶段：学会把规范写成工具

再看 `tooling/workspace-doctor`。

它代表一个关键思路：

- 团队约定不要只写在文档里
- 要变成可执行检查

你可以继续扩展它，比如加上：

- 检查所有包是否有 `name`
- 检查是否统一使用 `workspace:*`
- 检查是否有 `typecheck`
- 检查是否误提交子项目 `node_modules`

这一步决定你是在“使用 monorepo”，还是在“治理 monorepo”。

### 第六阶段：自己做一个最小 monorepo 练习

建议你自己在这个仓库里尝试下面的练习：

1. 新建 `packages/http-utils`
2. 在 `node-cli-agent` 和未来的一个新服务里共同使用它
3. 给它补 `build/lint/test`
4. 把使用方式写进文档站

完成这个练习后，你会真正掌握：

- 如何建共享包
- 如何接入共享包
- 如何让仓库规范持续生效

## 一句话总结

现在这个仓库已经有了 monorepo 最关键的第一层共享能力。后续学习和演进的重点，不再是“要不要 monorepo”，而是“如何持续把重复能力沉淀到共享层，并让整个仓库通过统一入口稳定运行”。

看来你已经把文档翻到了 [Monorepo 实战复盘](https://renhongl.github.io/ai-projects/engineering/16-monorepo) 这一页。

Monorepo（单仓多包）不仅仅是“把几个项目放进同一个文件夹”，它的核心价值在于**代码共享、依赖收敛、规范一致**，从而让团队像治理“一个大系统”一样去治理所有子项目。

结合你当前仓库的工程结构，我为你定制了一份进阶式的 **Monorepo 实战与落地教程**。

---

## 1. 基础篇：看懂单仓的“骨架”

一个成熟的现代 Monorepo 仓库，其目录结构通常分为三层：**应用层、共享能力层、治理工具层**。

```text
ai-projects/
├─ projects/              # 【应用层】真正运行的业务项目、站点、服务
│  ├─ ai/
│  │  ├─ nest-simple-agent
│  │  └─ node-cli-agent
│  └─ doc-website         # 文档站
├─ packages/              # 【共享能力层】可复用的 npm 包、配置或 SDK
│  ├─ eslint-config       # 统一的代码风格配置
│  ├─ tsconfig            # 统一的 TS 编译基线
│  ├─ shared-utils        # 无框架绑定的纯 JS/TS 工具函数
│  └─ node-sdk            # 统一的 AI 接口调用 SDK
├─ tooling/               # 【治理工具层】仓库健康检查工具
│  └─ workspace-doctor
├─ package.json           # 根目录全局配置
└─ pnpm-workspace.yaml    # pnpm 工作区定义

```

---

## 2. 配置篇：如何连接整个仓库？

在 Monorepo 中，我们通常使用 `pnpm` 作为包管理工具（因为它对 Workspace 的支持最轻量且高效）。

### 步骤一：定义工作区（pnpm-workspace.yaml）

在根目录下创建该文件，告诉 pnpm 哪些目录是它的子包：

```yaml
packages:
  - 'projects/**'
  - 'packages/**'
  - 'tooling/**'
```

### 步骤二：统一根脚本契约（根 package.json）

在根目录的 `package.json` 中配置聚合命令。**不要让开发者进到子目录去打包或测试**，全部从根目录触发：

```json
{
  "name": "ai-projects-root",
  "private": true,
  "scripts": {
    "dev": "pnpm --filter=vite-learning-lab dev",
    "build": "pnpm -r build", // -r 代表 recursive（递归），一行命令打包所有包
    "lint": "pnpm -r lint", // 递归校验所有包的代码规范
    "typecheck": "pnpm -r typecheck" // 递归做 TS 类型检查
  }
}
```

---

## 3. 落地篇：如何玩转“共享包”

学会“创建共享包”只是入门，让子项目正确“消费共享包”才是 Monorepo 的精髓。

### 场景一：共享纯工具函数（packages/shared-utils）

当你有跨项目的轻量工具（如 `parseEnvFile`, `toBoolean`, `toNumber`）时，丢进这里：

1. **定义：** 在 `packages/shared-utils/package.json` 中：

```json
{
  "name": "@workspace/shared-utils",
  "version": "1.0.0",
  "main": "index.js"
}
```

2. **消费：** 比如 `projects/ai/node-cli-agent` 想要使用它，在子项目根目录下运行：

```bash
pnpm add @workspace/shared-utils --workspace

```

此时子项目的 `package.json` 会出现：`"@workspace/shared-utils": "workspace:*"`。接着直接在代码中通过 `import` 导入即可，修改 `shared-utils` 时，子项目会实时生效。

### 场景二：统一 TypeScript 基线（packages/tsconfig）

别让每个子项目都复制粘贴一大堆 `compilerOptions`。

1. **定义：** 在 `packages/tsconfig/vite-app.json` 中写好 Vite 项目通用的 TS 配置。
2. **消费：** 在 `projects/engineering/vite-learning-lab/tsconfig.json` 中直接继承它：

```json
{
  "extends": "@workspace/tsconfig/vite-app.json",
  "include": ["src/**/*"]
}
```

---

## 4. 治理篇：如何防止仓库沦为垃圾堆？

当仓库里的项目越来越多，单靠口头约定是不行的，必须**把规范写进工具里**。

正如你项目里提供的 [tooling/workspace-doctor](https://renhongl.github.io/ai-projects/engineering/16-monorepo#toolingworkspace-doctor) 方案，你可以写一个轻量的 Node 脚本来自动化治理仓库：

```javascript
// tooling/workspace-doctor/index.js
// 示例：检查是否所有共享包都使用了规范的名称，或者是否误提交了 node_modules
import fs from 'fs';
import glob from 'glob';

const packages = glob.sync('packages/*/package.json');
packages.forEach((pkgPath) => {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (!pkg.name.startsWith('@workspace/')) {
    console.error(`❌ 错误: ${pkgPath} 中的包名必须以 @workspace/ 开头!`);
    process.exit(1);
  }
});
console.log('✅ Monorepo 依赖与命名规范检查通过！');
```

把这个工具配置到 Git 的 `pre-commit` 钩子（配合 Husky）或者 CI 流程中，任何人提交不合规的代码都会被直接卡住。

---

## 5. 动手实操：你的第一个 Monorepo 练习题

既然仓库架构已经搭好，建议你亲自动手做个实验来完全吃透它：

1. **新建包：** 在 `packages/` 下新建一个 `http-utils` 文件夹，并初始化 `package.json`。
2. **写代码：** 封装一个轻量的 Fetch 请求工具（带上统一的错误处理）。
3. **接入消费：** 将它同时引入到 `node-cli-agent` 和 `vite-learning-lab` 中，替换掉它们各自原生的请求逻辑。
4. **跑通流：** 在根目录运行 `pnpm build` 和 `pnpm lint`，确保整个工作区构建自洽。

你接下来打算把哪一部分业务逻辑（比如某个通用组件，或者统一的错误处理）尝试抽离成新的共享包？我们可以一起聊聊具体的抽离设计。
