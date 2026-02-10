const path = require("path");
const baseConfig = require("./vite.config.cjs");

module.exports = {
  ...baseConfig,
  plugins: (baseConfig.plugins || []).filter(
    (plugin) => !plugin || plugin.name !== "post-build"
  ),
  build: {
    ...baseConfig.build,
    emptyOutDir: true,
    rollupOptions: {
      ...baseConfig.build.rollupOptions,
      input: path.resolve(__dirname, "src/player.ts"),
      output: {
        ...baseConfig.build.rollupOptions.output,
        entryFileNames: "wickplayer.js",
      },
    },
  },
};
