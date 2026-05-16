# Vite

## 它是什么

Vite 是现代前端构建工具，核心目标是把“开发时的启动速度”和“生产构建的产物质量”同时做好。

- 开发阶段：基于浏览器原生 ESM，按需提供源码，不需要一开始就把整个应用打成一个大包。
- 构建阶段：仍然会做正式打包，输出适合部署的静态资源。
- 工程体验：配置相对直接，适合作为现代前端工程化的起点。

## 为什么它快

1. 开发服务器启动时，不先做整包构建。
2. 浏览器请求到哪个模块，Vite 就处理哪个模块。
3. 依赖预构建会把频繁使用的第三方依赖提前整理好，减少开发时的解析成本。
4. 热更新只影响变更模块，而不是整页重编译。

## 需要掌握的核心概念

### 1. 开发入口不是打包后的 bundle，而是 `index.html`

在 Vite 项目里，`index.html` 不是最后才参与流程的模板，而是开发时的直接入口。

对应示例文件：
- `projects/engineering/vite-learning-lab/index.html`

你需要理解：
- `type="module"` 会直接加载源码模块。
- 开发环境下看到的是源码联调，不是传统 bundler 先打包再启动。

### 2. 配置文件统一放在 `vite.config.ts`

Vite 的主要工程能力一般集中在这个文件里。

对应示例文件：
- `projects/engineering/vite-learning-lab/vite.config.ts`

这个学习项目里演示了：
- `server.port`：指定开发端口。
- `server.proxy`：把 `/api` 代理到本地后端。
- `resolve.alias`：把 `@` 指向 `src`。
- `build.outDir`：指定构建输出目录。
- `build.sourcemap`：输出 sourcemap，便于调试构建产物。

### 3. 环境变量只能暴露 `VITE_` 前缀

Vite 不会把所有环境变量直接注入前端代码，只会暴露 `VITE_` 开头的变量。

对应示例文件：
- `projects/engineering/vite-learning-lab/.env.development`
- `projects/engineering/vite-learning-lab/.env.production`
- `projects/engineering/vite-learning-lab/src/main.ts`
- `projects/engineering/vite-learning-lab/src/vite-env.d.ts`

你需要理解：
- `import.meta.env.MODE`、`DEV`、`PROD`、`BASE_URL` 是内置能力。
- 自定义变量要写成 `VITE_XXX`。
- TypeScript 项目里最好补上环境变量类型声明。

### 4. `src/assets` 和 `public` 的职责不同

这两个目录经常一起出现，但处理方式不一样。

对应示例文件：
- `projects/engineering/vite-learning-lab/src/assets/vite-mark.svg`
- `projects/engineering/vite-learning-lab/public/robots.txt`
- `projects/engineering/vite-learning-lab/src/main.ts`

区别：
- `src/assets`：资源会进入模块图，能被 import，构建时会被处理。
- `public`：资源不走打包处理，按原路径直接暴露。

### 5. 路径别名本质是“让源码引用更稳定”

项目越大，`../../../../` 这种相对路径越难维护。Vite 通常配合别名解决这个问题。

对应示例文件：
- `projects/engineering/vite-learning-lab/vite.config.ts`
- `projects/engineering/vite-learning-lab/src/main.ts`
- `projects/engineering/vite-learning-lab/tsconfig.json`

你需要理解：
- `vite.config.ts` 里的 alias 决定运行时解析。
- `tsconfig.json` 里的 `paths` 决定编辑器和 TypeScript 的识别。
- 两边最好保持一致。

### 6. 动态导入是代码分割的基础入口

Vite 支持原生 `import()`，这也是路由懒加载、低频模块按需加载的基础。

对应示例文件：
- `projects/engineering/vite-learning-lab/src/main.ts`
- `projects/engineering/vite-learning-lab/src/modules/feature.ts`

你需要理解：
- 开发时动态导入仍然是按需请求模块。
- 构建后通常会拆成单独 chunk。
- 这和“首屏更轻、非核心功能延后加载”直接相关。

### 7. 代理配置主要解决开发阶段跨域问题

前端本地开发时，请求 `/api/users` 这种地址，Vite 可以先接住，再转发给后端服务。

对应示例文件：
- `projects/engineering/vite-learning-lab/vite.config.ts`

你需要理解：
- 代理只发生在开发服务器阶段。
- 生产环境通常由 Nginx、网关或 BFF 负责转发。
- 不要把 Vite 代理误当成线上部署方案。

## 本次创建的学习项目

项目路径：
- `projects/engineering/vite-learning-lab`

这个项目覆盖的知识点：
- `index.html` 作为开发入口
- `vite.config.ts` 基础配置
- `.env.development` 与 `.env.production`
- `import.meta.env`
- 别名 `@`
- `src/assets` 与 `public`
- 动态导入 `import()`
- 构建输出目录 `dist`
- 开发代理 `server.proxy`

## 建议你的学习顺序

1. 先读 `projects/engineering/vite-learning-lab/README.md`，明确项目目标。
2. 再看 `projects/engineering/vite-learning-lab/vite.config.ts`，把配置项和效果一一对应起来。
3. 然后读 `projects/engineering/vite-learning-lab/src/main.ts`，理解 Vite 在业务代码里的具体用法。
4. 最后执行一次 `build`，观察 `dist` 里哪些文件是入口、哪些是拆包后的静态资源。

## 实践任务

1. 安装依赖并启动项目，观察首屏和动态导入按钮的行为。
2. 修改 `.env.development` 后重启开发服务器，确认页面展示变化。
3. 把 `server.proxy.target` 改成你本地的 mock 服务，验证 `/api` 转发。
4. 新增一个低频模块，继续用 `import()` 做第二个懒加载示例。
5. 执行构建，比较开发态源码引用与生产态 `dist` 产物的差异。

## 自测清单

- 我能解释为什么 Vite 开发阶段不需要先整包构建。
- 我知道 `VITE_` 前缀为什么重要。
- 我能说清 `src/assets` 和 `public` 的区别。
- 我能同时配置好 Vite alias 和 TypeScript paths。
- 我理解动态导入和代码分割的关系。
- 我知道 Vite 代理只解决开发阶段问题。

