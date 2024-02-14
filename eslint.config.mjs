import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import typeScriptESLint from '@typescript-eslint/eslint-plugin';
import typeScriptESLintParser from '@typescript-eslint/parser';
import nextPlugin from '@next/eslint-plugin-next';
import reactESLint from 'eslint-plugin-react';
import hooksESLint from 'eslint-plugin-react-hooks'
import importESLint from 'eslint-plugin-import';
import prettierESLint from 'eslint-plugin-prettier/recommended';
import unusedImportsESLint from 'eslint-plugin-unused-imports';

const compat = new FlatCompat();

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...compat.extends('standard-with-typescript'),
  prettierESLint,
  {
    files: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    languageOptions: {
      parser: typeScriptESLintParser,
      parserOptions: {
        parserOptions: {
          allowJs: true,
          ecmaVersion: 'latest',
          tsconfigRootDir: '.',
          project: ['./tsconfig.json'],
          sourceType: 'module',
        },
      },
    },
    plugins: {
      typescript: typeScriptESLint,
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
    },
  },
  // a workaround for import-plugin errors ref: https://github.com/import-js/eslint-plugin-import/issues/2556#issuecomment-1419518561
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: { import: importESLint },
    settings: {
      "import/parsers": {
        espree: [".js", ".cjs", ".mjs", ".jsx"],
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      ...importESLint.configs["recommended"].rules,
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest
      },
    },
  },
  {
    ignores: ['.next/**/*.ts', 'coverage/*', 'next-env.d.ts'],
  },
];
