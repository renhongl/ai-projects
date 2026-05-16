# Node CLI Agent

这是一个最小可运行的 Node.js CLI agent 项目，结构参考了你提供的文档里 `s01 Agent 循环` 的核心闭环：

```text
messages -> model -> tool_use -> tool_result -> next turn
```

## 项目目标

- 用最少代码搭出一个正确的 agent loop
- 用 CLI 的方式接收用户输入
- 把工具结果重新写回消息历史
- 预留 provider 抽象，后面可以接你自己的模型

## 目录结构

```text
src/
  cli.js
  index.js
  agent-loop.js
  providers/
    demo-provider.js
  tools/
    registry.js
    echo-tool.js
    shell-tool.js
  utils/
    config.js
test/
  agent-loop.test.js
```

## 快速开始

```bash
cd D:\FE\ai-projects\projects\node-cli-agent
node ./src/cli.js ask "请回显 hello"
node ./src/cli.js ask "请告诉我当前目录"
```

默认使用 `demo provider`，它会模拟模型发起 `tool_use`，帮助你先把 loop 跑通。

## 开启 shell 工具

默认禁用 shell 命令执行。如果你确认要让 CLI 真正调用系统命令，可以在 `.env` 中配置：

```bash
ALLOW_SHELL=true
```

然后再执行：

```bash
node ./src/cli.js ask "请告诉我当前目录"
```

## 你接下来怎么扩展

1. 把 `demo-provider.js` 换成真正的大模型 provider
2. 在 `tools/registry.js` 注册更多工具
3. 给 agent 增加规划、权限、上下文压缩等能力

## 对应文档里的关键点

- assistant 回复必须写回 `messages`
- tool result 必须写回 `messages`
- loop 是否继续，取决于这一轮是否产生了 `tool_use`

这也是这个项目最想帮你建立的核心心智模型。
