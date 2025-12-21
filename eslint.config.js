// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  // 👇 ЭТОТ БЛОК ОБЯЗАТЕЛЕН
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.storybook/**",
      "webpack.config.cjs",   // ← обратите внимание: .cjs!
      "tailwind.config.js",
      "postcss.config.js",
      "eslint.config.js",
    ],
  },
  ...compat.extends('./.eslintrc.json'),
];