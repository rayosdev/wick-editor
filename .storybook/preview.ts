import type { Preview } from "@storybook/react-vite";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/Editor/styles/default_styles.css";
import "../src/Editor/styles/default_theme.css";

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
