# pnpm Workspace

This directory is initialized as a `pnpm workspace` for frontend apps,
Node.js services, and shared packages.

## Layout

- `projects/`: product apps such as React, Vue, Next.js, Express, or NestJS
- `packages/`: shared UI, utilities, SDKs, eslint configs, tsconfig packages
- `tooling/`: build scripts, generators, local dev tools

## Common Commands

```bash
pnpm install
pnpm -r build
pnpm -r dev
```

## Example

```bash
mkdir projects/my-react-app
mkdir projects/my-node-api
mkdir packages/shared-utils
```

Then run `pnpm init` inside each project folder.

Use `workspace:*` when one package depends on another workspace package:

```json
{
  "dependencies": {
    "@workspace/shared-utils": "workspace:*"
  }
}
```
