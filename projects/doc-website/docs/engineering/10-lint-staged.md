# lint-staged

## 这是什么

`lint-staged` 用来只检查本次暂存区里的文件，避免每次提交都全量执行任务。

## 核心价值

- 提升提交速度。
- 保持提交前检查可接受。
- 和 `Husky` 搭配非常常见。

## 重点理解

- 为什么要针对 staged 文件执行。
- 自动修复和失败拦截如何配合。

## 你需要掌握的能力

- 配置 staged 文件级检查。
- 与 `ESLint`、`Prettier` 联动。
- 理解提交流程里的执行顺序。

## 实践任务

- 配置只对暂存文件运行 lint 和 format。
- 验证只改一个文件时不会全量扫描。

## 自测清单

- 我能解释 `lint-staged` 为什么能明显改善提交体验吗？
- 我知道哪些任务适合放进 `lint-staged` 吗？
- 我能避免“自动修复后未重新加入暂存区”这类问题吗？

根据你当前浏览的文档 [lint-staged | Docs](https://renhongl.github.io/ai-projects/engineering/10-lint-staged)，它是前端工程化中与 Husky 齐名的另一个核心神器。

简单来说：

> **`lint-staged` 是一个专门用来“只检查暂存区（Staged）文件”的工具。** 在实际开发中，它绝大多数时候都和 **Husky** 搭配在 `pre-commit` 阶段使用。

---

## 🎯 为什么需要它？（解决什么痛点）

在没有 `lint-staged` 之前，我们通过 Husky 在代码提交前运行 `npm run lint`。但这会带来两个致命痛点：

1. **速度极慢（全量扫描）：** 随着项目变大，哪怕你只改了一个文件的一个空格，提交时都要对全项目成百上千个文件进行全量 ESLint 校验，每次 `git commit` 都要卡顿几十秒甚至几分钟。
2. **“历史债务”轰炸：** 如果你接手了一个老项目，里面有几万行不符合新规范的历史代码。当你只想高高兴兴提交自己写的新功能时，全量 Lint 会把老代码的所有报错一股脑弹出来，导致你无法提交，而你又不敢贸然去改别人的老代码。

**`lint-staged` 的核心价值在于：只对你通过 `git add` 塞进暂存区的文件进行精准检查，老代码只要你没动过，它就绝对不碰。**

---

## 🧩 工作流解密（执行顺序）

当它与 Husky 联动时，整个提交流程如下：

```txt
git commit -m "feat: add login"
   ↓
Husky 触发 pre-commit 钩子
   ↓
lint-staged 拦截并过滤出暂存区的文件
   ↓
匹配文件后缀（如 .ts / .js）
   ↓
自动执行修复任务（如 eslint --fix / prettier --write）
   ↓
自动将修复后的文件重新 git add（现代版本已内置此行为）
   ↓
检查通过 → 成功 Commit

```

---

## 🛠️ 如何在项目中配置 lint-staged

### 1. 安装依赖

在项目根目录下安装：

```bash
npm install -D lint-staged

```

### 2. 配置过滤规则

在根目录的 `package.json` 中添加 `lint-staged` 配置块。你可以针对不同的文件后缀指定不同的检查命令：

```json
{
  "lint-staged": {
    // 匹配暂存区里的所有 JS、TS、JSX、TSX 文件
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix", // 自动修复并检查 ESLint 问题
      "prettier --write" // 自动格式化排版
    ],
    // 匹配暂存区里的样式和 JSON 文件
    "*.{css,md,json}": ["prettier --write"]
  }
}
```

### 3. 在 Husky 中调用

确保你的 `.husky/pre-commit` 脚本中，由原来的全量命令改为了调用 `lint-staged`：

```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged

```

---

## ⚠️ 生产环境踩坑与进阶自测

结合你页面中提到的**重点理解**与**自测清单**，在实际应用中需要掌握以下核心思维：

1. **自动修复与失败拦截的配合：** 如果 `eslint --fix` 自动修好了所有警告，`lint-staged` 会默默帮你把修改后的代码重新放回暂存区并允许通过；但如果代码里有**无法自动修复的严重语法错误**（比如少写了括号），命令会报错退出，Husky 会立刻拦截本次提交，保护远程仓库不受污染。
2. **哪些任务适合放进去？** 适合放**耗时极短、文件级别**的卡点任务（如 `eslint`、`prettier`、甚至针对单个文件的轻量单元测试）。绝对**不适合**放 `npm run build`（打包）或全量集成测试，这类重度任务应该交给 [CI/CD](https://renhongl.github.io/ai-projects/engineering/13-ci-cd) 流程。
