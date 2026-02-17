import type { Preview } from "@storybook/react-vite";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/styles/tailwind.css";
import "../src/Editor/styles/tokens.css";
import "../src/Editor/styles/default_styles.css";
import "../src/Editor/styles/default_theme.css";

declare global {
  interface Window {
    Wick?: Record<string, unknown> & { resourcepath?: string };
  }
}

if (typeof window !== "undefined") {
  window.Wick = window.Wick ?? {};
  window.Wick.resourcepath = window.Wick.resourcepath ?? "corelibs/wick-engine/";
}

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
