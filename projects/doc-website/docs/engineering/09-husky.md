# Husky

## 这是什么

`Husky` 用来接管 Git Hook，在提交代码前自动执行检查任务。

## 核心价值

- 在代码进入仓库前做质量兜底。
- 减少低质量提交流入主分支。

## 常见场景

- `pre-commit` 执行 lint 和格式化。
- `commit-msg` 检查提交信息规范。

## 你需要掌握的能力

- 为项目配置基础 Git Hook。
- 让常见检查自动化执行。
- 避免把过重任务放在提交前导致体验很差。

## 实践任务

- 配置 `pre-commit`。
- 配置 `commit-msg`。
- 测试非法提交能否被拦截。

## 自测清单

- 我知道为什么不是所有检查都放到 `pre-commit` 吗？
- 我能判断哪些检查适合本地，哪些适合 CI 吗？
- 我能独立排查 Hook 失效问题吗？

根据你正在浏览的工程化文档，[Husky](https://renhongl.github.io/ai-projects/engineering/09-husky) 是前端工程化中非常核心的一个工具。简单来说：

> **Husky 是一个用来“接管” Git Hooks（Git 钩子）的工具，让你可以非常轻松地在代码提交的不同阶段（如 commit 之前、push 之前）自动执行检查任务。**

---

## 🎯 为什么需要 Husky？（核心价值）

在没有 Husky 之前，如果我们想让团队在提交代码前自动运行一遍 `Prettier` 格式化或 `ESLint` 检查，我们需要让每个人手动去 `.git/hooks` 目录里写 Shell 脚本。因为 `.git` 文件夹不会被提交到 Git 仓库，这就导致**无法实现团队规范的同步**。

Husky 完美解决了这个问题：

1. **本地兜底机制：** 在代码进入本地仓库、甚至推送到远程主分支之前进行质量拦截，减少低质量和错误代码流入。
2. **团队规范强力同步：** 它将 Git Hooks 的配置直接映射到项目根目录下的普通文件中，能够随着 Git 仓库一起提交，确保团队里每个人都强制执行同一套检查流程。

---

## 🏃 常见的使用场景

在前端开发中，Husky 最常用于以下两个关键的 Git 生命周期阶段：

- **`pre-commit`（提交前）：** 在执行 `git commit` 的瞬间触发。通常配合 `lint-staged` 使用，只对你**当前修改并暂存（staged）的文件**运行 `eslint --fix`、`prettier --write` 或单元测试。如果检查报错，直接拦截提交。
- **`commit-msg`（提交信息检查）：**
  在输入 commit message 之后触发。通常配合 `commitlint` 使用，用来检查你的提交信息是否符合团队规范（例如是否符合 `feat: 增加XX功能` 或 `fix: 修复XX bug` 的 Angular 规范）。

---

## 🛠️ 如何在项目中快速配置 Husky

以下是现代（Husky v9+）最通用的极简配置步骤：

### 1. 安装与初始化

在项目根目录下运行以下命令，它会自动安装 `husky` 并创建 `.husky/` 目录：

```bash
npx husky-init && npm install

```

### 2. 添加一个 pre-commit 钩子

如果你希望在每次用户 `git commit` 时自动运行代码格式化和校验：

```bash
npx husky add .husky/pre-commit "npm run lint"

```

这会在 `.husky/` 目录下生成一个 `pre-commit` 脚本文件，内容如下：

```bash
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

npm run lint

```

当团队成员运行 `git commit -m "feat: login"` 时，系统就会自动先跑 `npm run lint`。如果 lint 失败，代码就不会被成功提交。

---

## 💡 生产环境下的进阶思维（如自测清单所述）

正如你页面中提到的自测思考，在实际生产中我们通常需要注意以下几点：

1. **避免把“过重”的任务放在 `pre-commit`：** 如果你的项目非常庞大，每次 commit 都去跑全局的 `npm run test` 或全局编译，会导致开发者每提交一次代码就要卡顿几分钟，极大地影响开发体验。
2. **结合 `lint-staged` 实现增量检查：** 完美方案是让 Husky 触发 `lint-staged`，只对本次修改的代码进行 Prettier 格式化，不仅速度极快，还能保证老代码不受影响。
3. **本地检查与 CI 的权衡：** 本地（Husky）适合做**轻量、快速**的语法与格式纠错（几秒内完成）；而耗时较长的全量单元测试、全量端到端测试（E2E）或打包构建检查，更适合放到 **CI/CD（如 GitHub Actions）** 阶段去兜底。
