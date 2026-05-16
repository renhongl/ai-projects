# Doc Website

基于 VitePress 的学习文档站点，用于展示仓库 `learning` 目录中的内容，并支持部署到 GitHub Pages。

## 本地开发

```bash
pnpm install
pnpm --filter doc-website docs:dev
```

## 构建

```bash
pnpm --filter doc-website docs:build
pnpm --filter doc-website docs:preview
```

## 同步 learning 文档

```bash
pnpm --filter doc-website docs:sync
```

同步脚本会把仓库根目录 `learning` 下的文档复制到站点目录，并生成站点使用的 ASCII slug 文件，避免中文文件名直接进入路由。

## 文档来源

当前站点内容来自：

- `learning/学习工程化`
- `learning/学习英语`

如果 `learning` 目录新增或调整文档，需要同步更新：

- `scripts/sync-learning.mjs`
- `docs/.vitepress/config.ts`

常规内容修改不需要手动改 `docs/learning/*`，执行同步脚本即可。

## GitHub Pages

工作流文件：

- `/.github/workflows/deploy-doc-website.yml`

`base` 会根据 `GITHUB_REPOSITORY` 自动推导：

- 仓库主页站点：`/`
- 仓库子路径站点：`/<repo>/`
