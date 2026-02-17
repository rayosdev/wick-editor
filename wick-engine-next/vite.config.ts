import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "es2020",
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/browser-standin.ts"),
      formats: ["iife"],
      name: "Wick",
      fileName: () => "wickengine.js"
    },
    rollupOptions: {
      output: {
        banner: "/* wick-engine-next: compatibility rewrite bridge */"
      }
    }
  }
});
