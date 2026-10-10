import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: [".next/**", "out/**", ".wrangler/**", "coverage/**", "next-env.d.ts", "*.cjs"] },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
