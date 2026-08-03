import globals from 'globals';
import tseslint from 'typescript-eslint';
import neostandard from 'neostandard';
import nextPlugin from '@next/eslint-plugin-next';
import reactESLint from 'eslint-plugin-react';
import hooksESLint from 'eslint-plugin-react-hooks';
import importESLint from 'eslint-plugin-import';
import prettierESLint from 'eslint-plugin-prettier/recommended';
import unusedImportsESLint from 'eslint-plugin-unused-imports';

export default tseslint.config(
  ...neostandard({ ts: true, noStyle: true }),
  prettierESLint,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        allowJs: true,
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react: reactESLint,
      '@next/next': nextPlugin,
      'react-hooks': hooksESLint,
      'unused-imports': unusedImportsESLint,
    },
    rules: {
      ...reactESLint.configs['jsx-runtime'].rules,
      ...hooksESLint.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@typescript-eslint/unbound-method': 'off',
      camelcase: 'off',
      'no-void': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { import: importESLint },
    settings: {
      'import/parsers': {
        espree: ['.js', '.jsx'],
      },
      'import/resolver': {
        typescript: true,
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      ...importESLint.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    ignores: ['.next/*', 'coverage/*', 'next-env.d.ts', '.yarn/*'],
  }
);
