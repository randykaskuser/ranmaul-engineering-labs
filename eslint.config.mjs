import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // Phase 3.7 hardening: prevent common XSS foot-guns from slipping in.
  {
    rules: {
      // Very rare to be acceptable in this repo; require justification if ever needed.
      "react/no-danger": "error",
    },
  },
]);

export default eslintConfig;
