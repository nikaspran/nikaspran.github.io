import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({
  baseDirectory: __dirname
});

const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**']
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  }
];

export default config;
