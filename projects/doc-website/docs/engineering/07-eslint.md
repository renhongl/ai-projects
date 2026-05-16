# ESLint

## 这是什么
`ESLint` 是代码质量与规范检查工具。它的重点不是“把代码排版得更漂亮”，而是尽早发现潜在问题、统一团队约束，并把低价值的 Review 工作前置到本地和 CI。

## 核心价值
- 提前发现低级错误，例如未使用变量、遗漏 `await`、错误的 Promise 使用方式。
- 统一团队编码习惯，减少“每个人都有一套写法”的沟通成本。
- 让代码审查更聚焦业务设计，而不是反复指出基础规范问题。
- 可以和编辑器、Git Hook、CI 联动，形成稳定的质量门禁。

## 重点理解
- `rules`：真正执行检查的规则集合。
- `plugins`：提供更多规则能力的扩展包。
- `extends`：复用一组已有配置，而不是每条规则都手写。
- `parserOptions.project`：让 TypeScript 规则具备“类型感知”能力，可以检查更深层的问题。
- `lint` 和 `lint:fix` 要分开理解：
  - `lint` 用来发现问题。
  - `lint:fix` 用来自动修复可修复的问题。

## 在仓库中的接入结果
根目录统一接入了 ESLint，配置入口是仓库根部的 `eslint.config.mjs`。

已经补齐以下内容：
- 新增根级 `eslint.config.mjs`，使用 ESLint 9 的 Flat Config。
- 新增根级 `lint` 脚本：`pnpm lint`
- 新增根级 `lint:fix` 脚本：`pnpm lint:fix`
- 把通用规则收敛到仓库根目录，避免每个项目单独维护一份配置。
- 按运行环境拆分浏览器代码和 Node 代码的全局变量。
- 忽略 `dist`、`node_modules`、`*.d.ts` 这类不需要 lint 的内容。

## 当前配置对应的能力
### 1. 基础推荐规则
通过 `@eslint/js` 启用官方推荐规则，覆盖最基础的 JS 问题检查。

### 2. TypeScript 规则
通过 `typescript-eslint` 启用 TypeScript 推荐规则，并开启类型感知检查。这样不仅能检查语法层问题，还能检查类型上下文中的潜在风险。

### 3. 浏览器与 Node 分层
前端应用代码使用 `browser` globals，Node 配置、脚本和服务端代码使用 `node` globals。这样可以避免把 `window`、`document`、`process`、`require` 这类环境变量混在一起。

### 4. 自动修复能力
执行下面命令可以自动修复一部分问题：

```bash
pnpm lint:fix
```

典型可自动修复的内容包括：
- 一部分 import 写法问题
- 明确可推断的类型导入形式
- 某些无歧义的规则格式问题

注意：不是所有规则都能自动修复。和逻辑正确性相关的问题通常仍然需要手动改。

## 当前项目里值得掌握的规则
下面这些规则是这次配置里重点落地的内容：

| 规则 | 作用 | 处理建议 |
| --- | --- | --- |
| `no-console` | 限制随意输出调试日志 | 默认保留 `console.warn` 和 `console.error`，普通 `console.log` 会提示 |
| `@typescript-eslint/consistent-type-imports` | 统一类型导入写法 | 类型导入优先使用 `import type` |
| `@typescript-eslint/no-floating-promises` | 避免 Promise 被创建后没人处理 | Promise 要么 `await`，要么显式处理 |
| `@typescript-eslint/no-misused-promises` | 避免在不合适的位置误用 Promise | 重点检查回调和条件判断场景 |
| `@typescript-eslint/no-unused-vars` | 发现无用变量或无用参数 | 不需要的参数可使用 `_` 前缀 |

## 你至少要能说清楚的 10 条常见规则
1. `no-unused-vars`：变量定义了但没用，通常意味着脏代码或遗留逻辑。
2. `no-undef`：使用了未定义标识符，常见于变量名拼错。
3. `no-console`：限制随意输出调试信息，避免把开发日志带到生产环境。
4. `eqeqeq`：统一使用 `===` 和 `!==`，减少隐式类型转换问题。
5. `no-debugger`：禁止遗留 `debugger`。
6. `@typescript-eslint/no-unused-vars`：TypeScript 场景下更准确地检查无用变量。
7. `@typescript-eslint/consistent-type-imports`：统一类型导入风格，减少混用。
8. `@typescript-eslint/no-floating-promises`：防止异步逻辑悄悄失败。
9. `@typescript-eslint/no-misused-promises`：防止把 Promise 当同步值误用。
10. `@typescript-eslint/await-thenable`：避免对非 Promise 值错误使用 `await`。

## 推荐的使用方式
### 本地开发
先检查：

```bash
pnpm lint
```

能自动修的先修：

```bash
pnpm lint:fix
```

### 提交前
至少保证：
- 没有 error 级别问题
- warning 是你明确接受的，而不是没看

### 在 CI 中
把 `pnpm lint` 作为最基础的一道门禁。这样能确保代码进主分支前已经过统一校验。

## 实践任务
- 在仓库中完成 `ESLint` 接入。
- 能解释根目录 `eslint.config.mjs` 每一段配置的作用。
- 执行一次 `pnpm lint`，看懂报错指向的是哪一类问题。
- 执行一次 `pnpm lint:fix`，观察哪些问题能自动修复，哪些不能。
- 结合团队需求继续扩展规则，例如：
  - 是否禁止 `any`
  - 是否强制函数返回类型
  - 是否接入 React/Vue 专属规则

## 自测清单
- 我能区分“代码风格规则”和“潜在 bug 规则”吗？
- 我知道什么时候该开 warning，什么时候该直接开 error 吗？
- 我能解释 `lint` 和 `lint:fix` 的区别吗？
- 我知道为什么 TypeScript 项目要尽量开启类型感知规则吗？
- 我能定位一条 lint 报错的根因，而不只是机械照着改吗？

