# Doc Website

基于 VitePress 的仓库文档站点，内容直接维护在 `docs` 目录下，并部署到 GitHub Pages。

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

## 文档结构

当前主要栏目：

- `docs/engineering`
- `docs/english`

如果新增栏目、调整导航或修改 slug，需要同步更新：

- `docs/.vitepress/config.ts`
- `docs/index.md`

常规内容编辑直接修改 `docs/*` 即可。

## GitHub Pages

工作流文件：

- `/.github/workflows/deploy-doc-website.yml`

`base` 会根据 `GITHUB_REPOSITORY` 自动推导：

- 仓库主页站点：`/`
- 仓库子路径站点：`/<repo>/`
