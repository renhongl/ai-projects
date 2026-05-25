# 多环境配置

## 这是什么

多环境配置是让同一套代码在开发、测试、预发、生产等环境下具备不同配置能力。

## 常见场景

- 接口地址不同
- 日志开关不同
- 调试能力不同
- 功能开关不同

## 为什么重要

- 避免把开发配置带到生产。
- 降低环境切换成本。
- 便于测试和灰度验证。

## 你需要掌握的能力

- 配置环境变量。
- 管理不同环境下的资源与接口。
- 避免把敏感信息写死到前端代码。

## 实践任务

- 创建开发和生产环境配置文件。
- 区分调试日志与生产日志。
- 为不同环境设计变量命名规范。

## 自测清单

- 我能清晰解释哪些配置应放环境变量吗？
- 我知道前端环境变量并不等于保密机制吗？
- 我能设计一套清晰不混乱的环境管理方案吗？

在前端开发中，配置多环境（如开发、测试、预发、生产）的核心思想是：**“一套代码，通过构建命令注入不同的环境变量，从而改变运行时的行为。”**

根据你当前查看的[多环境配置文档](https://renhongl.github.io/ai-projects/engineering/14-multi-env)，结合目前主流的前端构建工具（如 Vite 或 Webpack），以下是落地这一套方案的具体实践步骤：

---

## 1. 创建环境配置文件（.env）

在项目根目录下创建不同的 `.env` 文件。构建工具会自动根据你启动的模式加载对应的文件。

- **`.env.development`**（开发环境）

```ini
# Vite 必须以 VITE_ 开头，Webpack/CRA 通常以 REACT_APP_ 或 VUE_APP_ 开头
VITE_API_BASE_URL=https://api-dev.example.com
VITE_ENABLE_LOG=true
VITE_APP_ENV=development

```

- **`.env.test`**（测试环境）

```ini
VITE_API_BASE_URL=https://api-test.example.com
VITE_ENABLE_LOG=true
VITE_APP_ENV=test

```

- **`.env.production`**（生产环境）

```ini
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_LOG=false
VITE_APP_ENV=production

```

---

## 2. 在代码中使用环境变量

在代码中，你不能再把 API 地址写死（Hardcode），而是要通过工具提供的全局变量来动态获取。

### 封装 Axios / Fetch 示例

```javascript
// src/utils/request.js
import axios from 'axios';

const request = axios.create({
  // 动态获取当前环境的接口地址
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
});

export default request;
```

### 区分调试日志与生产日志

```javascript
// src/utils/logger.js
export const log = (...args) => {
  // 只有在允许日志的环境下才打印
  if (import.meta.env.VITE_ENABLE_LOG === 'true') {
    console.log('[Log]:', ...args);
  }
};
```

> **💡 提示：** 不同工具获取变量的方式不同：
>
> - **Vite:** `import.meta.env.VITE_XXX`
> - **Webpack / Vue CLI:** `process.env.VUE_APP_XXX`
> - **Create React App:** `process.env.REACT_APP_XXX`

---

## 3. 在 package.json 中配置启动与构建命令

通过 `--mode` 参数来指定当前命令对应哪个环境。

```json
{
  "scripts": {
    "dev": "vite",                               # 默认加载 .env.development
    "build:test": "vite build --mode test",       # 打包测试环境，加载 .env.test
    "build:prod": "vite build --mode production"  # 打包生产环境，加载 .env.production
  }
}

```

---

## 4. 核心安全避坑指南（响应自测清单）

正如你看到的文档自测清单中所说：**“前端环境变量并不等于保密机制”**。

1. **绝对不要放敏感信息：** 前端打包后的代码所有人右键「检查」都能看到。像 **阿里云的 SecretKey、支付私钥、数据库密码** 等，绝对不能写在前端的 `.env` 文件里。这些应该由后端通过接口处理，或者由 Node.js 中间层（BFF）来调用。
2. **变量名规范：** 统一使用大写和下划线（如 `VITE_API_URL`），并且只放控制前端行为的变量（如接口 BaseURL、三方 SDK 的 AppID、CDN 路径等）。
3. **配合 CI/CD：** 在流水线（如 GitHub Actions、Jenkins）上部署时，可以通过修改流水线的环境变量，动态生成或覆盖对应的 `.env` 文件，实现自动化部署。

你想基于哪种具体的构建工具（比如 Vite 还是 Webpack）来实现这套配置？我们可以聊聊具体的语法细节。
