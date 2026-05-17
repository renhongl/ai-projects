# Repository Guidelines


## 主题
这个仓库主要是用来学习各种知识，并且创建真实训练项目。并且把学习内容放到文档网站。

## Project Structure & Module Organization
This repository is a `pnpm` workspace for apps, shared packages, and internal tooling.

- `projects/ai/`: runnable agent examples, including `node-cli-agent` (`src/`, `test/`) and `nest-simple-agent` (`src/`, `test/`).
- `projects/doc-website/`: VitePress docs site with content under `docs/`.
- `projects/engineering/vite-learning-lab/`: Vite-based frontend sandbox.
- `packages/`: reusable workspace packages such as `node-sdk`, `shared-utils`, `eslint-config`, and `tsconfig`.
- `tooling/workspace-doctor/`: local workspace diagnostics.
- `.github/workflows/`: CI and deployment workflows.

## Build, Test, and Development Commands
Run commands from the repository root unless a package-specific script is needed.

- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run all available package `dev` scripts in parallel.
- `pnpm build`: run each package build, including Vite/VitePress builds and Node syntax checks.
- `pnpm test`: run all package test scripts.
- `pnpm lint`: run package lint scripts, then root ESLint.
- `pnpm typecheck`: run TypeScript checks where defined.
- `pnpm docs:dev`: start the VitePress site locally.
- `pnpm workspace:doctor`: run internal workspace diagnostics.

## Coding Style & Naming Conventions
Use ESM and keep imports explicit. JavaScript files in this repo currently use double quotes; NestJS TypeScript follows single quotes and trailing commas. Match the surrounding file instead of reformatting unrelated code. Prefer `camelCase` for variables/functions, `PascalCase` for classes and DTOs, and kebab-case for folders and package names.

Linting is driven by [eslint.config.mjs](/ai-projects/eslint.config.mjs). Run `pnpm lint` before opening a PR.

## Testing Guidelines
Testing is package-specific:

- `projects/ai/node-cli-agent` uses Node’s built-in test runner; place tests in `test/*.test.js`.
- `projects/ai/nest-simple-agent` uses Jest; keep unit and e2e specs under `test/`, following `*.spec.ts` or `*.e2e-spec.ts`.
- Some packages treat successful builds as their test gate, so run `pnpm test` and `pnpm build` together for meaningful coverage.

## Commit & Pull Request Guidelines
Recent history uses short Conventional Commit prefixes such as `feat:`, `fix:`, and `chore:`. Keep subjects imperative and focused, for example `feat: add workspace doctor check`.

PRs should include a concise description, affected workspace paths, verification commands run, and linked issues if applicable. Include screenshots for UI changes in `doc-website` or `vite-learning-lab`. Note any required environment variables, especially `OPENAI_API_KEY` for agent-related projects.
