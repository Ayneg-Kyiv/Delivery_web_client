import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    extends: ['next'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Disable unused vars rule
      '@typescript-eslint/no-undef': 'off', // Disable undefined variables rule
      '@typescript-eslint/no-explicit-any': 'off', // Disable explicit any rule
      '@next/next/missing-suspense-with-csr-bailout': 'off', // Disable missingSuspenseWithCSRBailout rule
    }
  })
];

export default eslintConfig;
