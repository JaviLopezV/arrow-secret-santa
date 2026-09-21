import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const sourceSizeRules = {
  "max-lines": [
    "error",
    { max: 300, skipBlankLines: true, skipComments: true },
  ],
  "max-lines-per-function": [
    "error",
    { max: 200, skipBlankLines: true, skipComments: true },
  ],
};

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: sourceSizeRules,
  },
  {
    files: [
      "**/__tests__/**/*.{js,jsx,ts,tsx,mjs,cjs}",
      "**/{test,tests}/**/*.{js,jsx,ts,tsx,mjs,cjs}",
      "**/*.{test,spec}.{js,jsx,ts,tsx,mjs,cjs}",
      "**/{fixtures,__fixtures__}/**/*.{js,jsx,ts,tsx,mjs,cjs}",
    ],
    rules: {
      "max-lines": [
        "error",
        { max: 600, skipBlankLines: true, skipComments: true },
      ],
    },
  },
];

export default eslintConfig;
