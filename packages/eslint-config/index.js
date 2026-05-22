import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export function createWorkspaceEslintConfig({
  browserFiles = [],
  nodeFiles = [],
  typeAwareFiles = [],
} = {}) {
  return [
    {
      ignores: [
        '**/dist/**',
        '**/node_modules/**',
        '**/.vite/**',
        '**/.vitepress/cache/**',
        '**/.vitepress/dist/**',
        '**/*.d.ts',
      ],
    },
    {
      files: ['**/*.{js,mjs,cjs}'],
      extends: [js.configs.recommended],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'no-console': ['warn', { allow: ['warn'] }],
      },
    },
    {
      files: ['**/*.{ts,tsx,mts,cts}'],
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      rules: {
        'no-console': ['warn', { allow: ['warn'] }],
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_' },
        ],
      },
    },
    browserFiles.length > 0
      ? {
          files: browserFiles,
          languageOptions: {
            globals: globals.browser,
          },
        }
      : null,
    nodeFiles.length > 0
      ? {
          files: nodeFiles,
          languageOptions: {
            globals: globals.node,
          },
        }
      : null,
    typeAwareFiles.length > 0
      ? {
          files: typeAwareFiles,
          extends: [...tseslint.configs.recommendedTypeChecked],
          languageOptions: {
            parserOptions: {
              projectService: true,
            },
          },
          rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
          },
        }
      : null,
  ].filter(Boolean);
}
