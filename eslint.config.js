// eslint.config.js
import vue from "eslint-plugin-vue";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["*.ts", "*.tsx", "*.vue"],
    languageOptions: {
      parser: "vue-eslint-parser",
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      vue,
      "@typescript-eslint": tsPlugin,
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "vue/no-unused-vars": "off",
      "vue/multi-word-component-names": ["error", { ignores: ["App"] }],
    },
  },
];
