import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  // Combined plugins array (react + dev middleware) is defined below
  resolve: {
    alias: {
      Editor: "/src/Editor",
      resources: "/src/resources",
    },
  },
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
    // Dev-only plugin: serve files requested at /src/resources/... from the local src/resources folder
    {
      name: "serve-src-resources",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          // strip query and hash
          const cleanUrl = req.url.split("?")[0].split("#")[0];
          // Only serve static resource files from /src/resources or /resources (public)
          // Don't intercept /src/* module requests (JS/TS/etc.) — let Vite handle those.
          const prefixes = ["/resources/"];
          const matched = prefixes.find((p) => cleanUrl.startsWith(p));
          if (!matched) return next();

          // Only allow certain static extensions to be served here
          const allowedExts = new Set([
            ".svg",
            ".png",
            ".jpg",
            ".jpeg",
            ".gif",
            ".webp",
            ".ico",
            ".json",
            ".css",
            ".xml",
            ".txt",
            ".webmanifest",
            ".woff",
            ".woff2",
            ".ttf",
            ".eot",
          ]);

          let filePath;
          try {
            if (cleanUrl.startsWith("/resources/")) {
              // public/resources/...
              filePath = path.join(
                process.cwd(),
                "public",
                cleanUrl.replace(/^\//, "")
              );
            } else {
              return next();
            }
          } catch (e) {
            return next();
          }

          fs.stat(filePath, (err, stat) => {
            if (err || !stat.isFile()) return next();
            const ext = path.extname(filePath).toLowerCase();
            if (!allowedExts.has(ext)) return next();

            const mimeMap = {
              ".svg": "image/svg+xml",
              ".png": "image/png",
              ".jpg": "image/jpeg",
              ".jpeg": "image/jpeg",
              ".gif": "image/gif",
              ".webp": "image/webp",
              ".ico": "image/x-icon",
              ".json": "application/json",
              ".css": "text/css",
              ".xml": "application/xml",
              ".txt": "text/plain",
              ".webmanifest": "application/manifest+json",
              ".woff": "font/woff",
              ".woff2": "font/woff2",
              ".ttf": "font/ttf",
              ".eot": "application/vnd.ms-fontobject",
            };

            const mime = mimeMap[ext] || "application/octet-stream";
            res.setHeader("Content-Type", mime);
            const stream = fs.createReadStream(filePath);
            stream.on("error", () => next());
            stream.pipe(res);
          });
        });
      },
    },
  ],
  publicDir: "public",
  server: {
    host: '0.0.0.0', // Expose to local network
    port: 3002,
    fs: {
      allow: ["."],
    },
  },
  build: {
    outDir: "build",
  },
});
