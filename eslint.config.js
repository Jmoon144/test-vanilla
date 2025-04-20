const js = require("@eslint/js");
const parser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-plugin-prettier");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      parser,
      ecmaVersion: 2021,
      sourceType: "module",
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "warn",
    },
  },
];
