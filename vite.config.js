import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  resolve: {
    alias: {
      Editor: "/src/Editor",
      resources: "/src/resources",
    },
  },
  publicDir: "public",
  server: {
    port: 3000,
    fs: {
      allow: ["."],
    },
  },
  build: {
    outDir: "build",
  },
});
