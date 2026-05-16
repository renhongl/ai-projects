import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.vitepress/cache/**',
      '**/.vitepress/dist/**',
      '**/*.d.ts'
    ]
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },
  {
    files: ['projects/engineering/vite-learning-lab/src/**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: globals.browser
    }
  },
  {
    files: [
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
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: [
      'projects/ai/nest-simple-agent/**/*.{ts,tsx}',
      'projects/engineering/vite-learning-lab/src/**/*.{ts,tsx}',
      'projects/engineering/vite-learning-lab/vite.config.ts',
      'projects/ai/nest-simple-agent/test/**/*.{ts,tsx}',
      'projects/ai/nest-simple-agent/src/**/*.{ts,tsx}',
      'packages/**/*.{ts,tsx}',
      'tooling/**/*.{ts,tsx}'
    ],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error'
    }
  }
);
