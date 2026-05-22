# Prettier

## 这是什么

`Prettier` 是代码格式化工具，目标是统一代码排版，减少无意义争论。

## 核心价值

- 自动统一代码样式。
- 降低格式类 Code Review 成本。
- 与 `ESLint` 配合提升一致性。

## 重点理解

- `Prettier` 管排版，`ESLint` 更偏质量检查。
- 两者冲突时要做好规则边界管理。

## 你需要掌握的能力

- 为项目接入 `Prettier`。
- 配置编辑器自动格式化。
- 处理与 `ESLint` 的冲突。

## 实践任务

- 创建项目格式化配置。
- 配置保存时自动格式化。
- 确保提交前代码风格统一。

## 自测清单

- 我能说清 `Prettier` 和 `ESLint` 的职责边界吗？
- 我能处理常见的格式化冲突吗？
- 我知道哪些场景不该过度定制格式规则吗？

在 VS Code 中配置 Prettier 自动格式化非常简单，主要分为**安装插件**、**修改编辑器设置**和**项目本地配置**三步。

按照以下步骤配置，就能实现“保存时自动格式化”的效果：

---

### 第一步：安装 Prettier 插件

1. 打开 VS Code，点击左侧边栏的 **Extensions（扩展）** 图标（或者快捷键 `Ctrl + Shift + X` / `Cmd + Shift + X`）。
2. 在搜索框中输入 `Prettier`。
3. 找到由 **Prettier** 官方发布的 **Prettier - Code formatter**，点击 **Install（安装）**。

---

### 第二步：配置 VS Code 全局设置（开启保存自动格式化）

你需要告诉 VS Code 在保存时使用 Prettier 作为默认的格式化工具。

1. 快捷键 `Ctrl + ,` (Windows) 或 `Cmd + ,` (Mac) 打开设置。
2. 在右上角点击 **“Open Settings (JSON)”** 图标（一个带弧形箭头的文件的图标），进入 `settings.json` 配置文件。
3. 将以下配置复制粘贴到 JSON 对象中：

```json
{
  // 开启保存时自动格式化
  "editor.formatOnSave": true,

  // 设置 Prettier 为默认的代码格式化器
  "editor.defaultFormatter": "esbenp.prettier-vscode",

  // 针对特定语言（例如 JavaScript/TypeScript/HTML/CSS）单独锁定默认格式化器（可选，推荐）
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

### 第三步：在项目中创建配置文件（强推荐）

为了让团队里所有人（或者你以后在不同电脑上）的代码风格完全一致，建议在**项目根目录**下创建一个 Prettier 配置文件。

1. 在项目根目录下新建一个名为 `.prettierrc` 的文件。
2. 写入你自定义的代码规范，例如：

```json
{
  "semi": true, // 句尾添加分号
  "singleQuote": true, // 使用单引号代替双引号
  "tabWidth": 2, // 缩进字节数
  "trailingComma": "es5" // 在可能的地方加上尾随逗号（如对象、数组的最后一项）
}
```

> 💡 **额外提示（关于 ESLint 冲突）：**
> 如果你的项目同时使用了 **ESLint**（负责代码质量检查）和 **Prettier**（负责排版格式化），它们可能会在诸如“单双引号/是否加分号”的规则上发生冲突。
> **解决办法：** 如果遇到冲突，记得在项目中安装 `eslint-config-prettier`，并在 ESLint 的配置文件（如 `.eslintrc.js`）的 `extends` 数组最后加上 `"prettier"`，以此来关闭所有与 Prettier 冲突的 ESLint 排版规则。
