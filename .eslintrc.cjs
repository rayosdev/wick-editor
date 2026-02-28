module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: ["prettier"],
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    "build/",
    "coverage/",
    "dist/",
    "engine/lib/",
    "node_modules/",
    "playwright-report/",
    "public/corelibs/",
    "storybook-static/",
    "test-results/",
  ],
  rules: {
    "react/react-in-jsx-scope": "off"
  },
};
