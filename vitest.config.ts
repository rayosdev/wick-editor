import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/vitest.setup.js",
    include: ["tests/**/*.test.{js,jsx,ts,tsx}"],
    threads: false,
  },
  resolve: {
    alias: {
      Editor: path.resolve(__dirname, "src/Editor"),
      resources: path.resolve(__dirname, "src/resources"),
    },
  },
});
