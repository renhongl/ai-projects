# Commit 规范

## 这是什么

Commit 规范是统一提交信息格式，便于历史追踪、自动生成日志和团队协作。

## 常见格式

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

## 为什么重要

- 历史更可读。
- 便于排查变更。
- 有助于自动化发布与变更日志生成。

## 你需要掌握的能力

- 理解常见提交类型。
- 能写出清晰、可追溯的提交说明。
- 在团队中推动一致使用方式。

## 实践任务

- 为项目配置 `commitlint`。
- 写 10 条符合规范的示例提交信息。
- 总结哪些提交最容易写得含糊。

## 自测清单

- 我能从一条提交信息快速看出变更性质吗？
- 我能区分 `feat`、`fix`、`refactor` 吗？
- 我能让团队成员理解规范价值，而不是把它当负担吗？

根据你正在浏览的 [Commit 规范 | Docs](https://renhongl.github.io/ai-projects/engineering/11-commit-rules) 页面，**Commit Rules（代码提交规范）** 是前端团队工程化建设中非常关键的一环。

简单来说：

> **Commit 规范是一套统一的、结构化的 Git 提交信息（Commit Message）格式要求。** 它通过限制提交信息的开头和内容，让杂乱无章的提交日志变得井然有序。

目前业界最通用的标准是基于 Angular 团队提出的 **Conventional Commits（约定式提交）** 规范。

---

## 🎯 1. 为什么 Commit 规范如此重要？

在没有规范的团队里，你可能会看到类似于 `"fix"`、`"update"`、`"完成了修改"`、甚至 `"1111"` 这样毫无意义的提交信息。这会带来巨大的维护成本：

- **历史无法追溯：** 过了半年你想查某个 Bug 是在哪次代码变更里引入的，面对满屏的 `"update"` 根本无从下手。
- **无法自动生成日志：** 规范的 Commit 允许工具自动提取所有的 `feat` 和 `fix` 记录，一键生成 `CHANGELOG.md`（版本变更日志）。
- **自动化发布卡点：** 结合语义化版本（Semantic Versioning），工具可以根据 Commit 类型自动决定是升级主版本号（Major）、次版本号（Minor）还是修订号（Patch）。

---

## 📋 2. 核心格式：Conventional Commits

标准的 Commit Message 通常包含三个部分：**Header（标题）**、**Body（正文，可选）** 和 **Footer（脚注，可选）**。

```txt
<type>(<scope>): <subject>

```

### ❶ 常见提交类型（Type）

正如你页面中列出的核心格式，以下是最常用的 6 种类型：

- **`feat`**: 引入了新功能（New Feature）。
- **`fix`**: 修复了 Bug。
- **`docs`**: 仅仅修改了文档（如 `README.md`、API 说明等）。
- **`refactor`**: 代码重构（既没有新增功能，也没有修复 Bug 的代码变动）。
- **`test`**: 增加或修改测试用例。
- **`chore`**: 构建过程或辅助工具的变动（如修改 `package.json` 依赖、配置 ESLint、Husky 等）。

### ❷ 作用域（Scope，可选）

说明本次提交影响的范围。例如：`feat(auth): 增加微信登录功能`，`fix(navbar): 修复移动端导航栏遮挡问题`。

---

## ✍️ 3. 10 条符合规范的示例提交信息

为了完成你文档中的**实践任务**，这里为你整理了 10 条涵盖各种场景、清晰且可追溯的规范示例：

1. **`feat(user): add standard registration validation using zod`** _(新功能)_
2. **`fix(auth): resolve memory leak during JWT token expiration`** _(修Bug)_
3. **`docs(readme): update environment setup instructions for monorepo`** _(改文档)_
4. **`refactor(utils): convert currency helper functions to TypeScript`** _(重构)_
5. **`test(api): add continuous integration tests for streaming endpoints`** _(加测试)_
6. **`chore(eslint): upgrade flat config rules to support node environments`** _(常规改动)_
7. **`style(components): fix layout alignment for checkout button`** _(仅格式/样式修改，不改代码逻辑)_
8. **`perf(image): optimize dynamic asset loading using virtual scrolling`** _(性能优化)_
9. **`ci(github): configure auto-deployment workflow for staging branch`** _(修改持续集成配置)_
10. **`fix(cart): prevent duplicate items when double-clicking add button`** _(修Bug)_

---

## 💡 4. 总结：哪些提交最容易写得含糊？

在团队协作中，以下几类变更最容易演变成含糊不清的“垃圾提交”，需要特别注意：

1. **涉及多个变动的混合提交：** 开发者在一次编写中同时“顺手”修了一个 Bug、改了一个样式、还加了一句文档，最后写成 `fix and docs`。**正确做法：** 应该拆分成多次颗粒度更小的 Commit，或者以主要变动（如 `feat` 或 `fix`）为主导。
2. **长周期的中间过程提交：** 比如在一个功能写到一半要下班时，容易写下 `feat: progress` 或 `feat: incomplete`。**建议：** 在本地可以使用这种草稿提交，但在准备 Merge 进主分支前，必须通过 `git rebase` 或 Squash 将它们合并压缩成一条含义明确的规范提交。
3. **重构（refactor）与常规变动（chore）的混淆：** 经常有人把升级 npm 包（属于 `chore`）或者改动业务代码结构（属于 `refactor`）统一写成 `update`。

## 🛠️ 5. 落地团队：如何借助工具强制执行？

正如你自测清单里思考的：_“如何让团队成员理解规范价值，而不是把它当负担？”_ 光靠口头约束是没用的，必须要用**自动化工具**将其固化到工作流中：

1. **代码层面卡死：** 使用 **`commitlint`** 配合 [Husky](https://renhongl.github.io/ai-projects/engineering/09-husky) 的 `commit-msg` 钩子。只要有人输入的 commit 信息不符合 `feat:` 这样的格式，直接在本地拦截，不允许提交。
2. **降低记忆负担：** 引入 **`commitizen`** 工具。开发者不需要硬背这些前缀，只需在终端运行 `git cz`，就会出现一个交互式的连线题菜单，引导你选类型、写作用域、写描述，自动生成完美的 Commit 信息。
