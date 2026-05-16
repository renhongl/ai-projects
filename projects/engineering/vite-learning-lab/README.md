# Vite Learning Lab

这个项目用于学习 Vite 的原生能力，重点不是框架集成，而是理解开发服务器、环境变量、别名、静态资源、`public` 目录、动态导入和构建输出。

## 运行

```bash
pnpm install
pnpm --filter vite-learning-lab dev
```

构建与预览：

```bash
pnpm --filter vite-learning-lab build
pnpm --filter vite-learning-lab preview
```

## 可学习的知识点

1. `index.html` 是 Vite 开发入口，`<script type="module">` 会直接加载源码。
2. `vite.config.ts` 里配置了开发端口、路径别名、代理和构建输出。
3. `.env.development` 与 `.env.production` 展示了 `VITE_` 前缀环境变量的使用方式。
4. `src/main.ts` 同时演示了：
   - `import.meta.env`
   - 别名导入 `@/modules/feature`
   - 导入 `src/assets` 中的静态资源
   - 动态导入带来的按需加载
5. `public/robots.txt` 演示了无需打包处理、按原路径暴露的静态文件。

## 代理说明

`vite.config.ts` 中把 `/api` 代理到了 `http://localhost:3001`。如果你本地没有后端服务，请把 target 改成你自己的接口服务，或者先启动一个本地 mock 服务再测试。
