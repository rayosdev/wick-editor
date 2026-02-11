import path from "path";
import { fileURLToPath } from "url";
import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/react-vite",
  staticDirs: ["../public"],
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          Editor: path.resolve(__dirname, "../src/Editor"),
          resources: path.resolve(__dirname, "../src/resources"),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: "modern-compiler",
          },
          sass: {
            api: "modern-compiler",
          },
        },
      },
    });
  },
};

export default config;
