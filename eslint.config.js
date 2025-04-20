import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginTS from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      parser,
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": eslintPluginTS,
      prettier: eslintPluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  },
]``;
