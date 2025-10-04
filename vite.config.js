import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
  ],
  resolve: {
    alias: {
      Editor: "/src/Editor",
      resources: "/src/resources",
    },
  },
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.js$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
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
