import { defineConfig } from 'eslint/config';
import { createWorkspaceEslintConfig } from './packages/eslint-config/index.js';

export default defineConfig(
  ...createWorkspaceEslintConfig({
    browserFiles: ['projects/engineering/vite-learning-lab/src/**/*.{js,mjs,cjs,ts,tsx}'],
    nodeFiles: [
      'eslint.config.mjs',
      '**/*.config.{js,ts,mjs,cjs}',
      'projects/ai/node-cli-agent/**/*.{js,mjs,cjs}',
      'projects/ai/nest-simple-agent/**/*.{js,mjs,cjs,ts,tsx}',
      'projects/engineering/vite-learning-lab/vite.config.ts',
      'projects/doc-website/docs/.vitepress/config.ts',
      'projects/doc-website/scripts/**/*.{js,mjs,cjs,ts}',
      'packages/**/*.{js,mjs,cjs,ts}',
      'tooling/**/*.{js,mjs,cjs,ts}'
    ],
    typeAwareFiles: [
      'projects/engineering/vite-learning-lab/src/**/*.{ts,tsx}',
      'projects/engineering/vite-learning-lab/vite.config.ts',
      'projects/ai/nest-simple-agent/src/**/*.{ts,tsx}',
      'packages/**/*.{ts,tsx}',
      'tooling/**/*.{ts,tsx}'
    ]
  })
);
