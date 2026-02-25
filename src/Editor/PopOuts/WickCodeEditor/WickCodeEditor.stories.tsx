import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./WickCodeEditor");

const meta: Meta = {
  title: "Editor/PopOuts/WickCodeEditor/WickCodeEditor",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ height: "760px", width: "100%", minHeight: "760px" }}>
      <DynamicComponentStory
        componentName="WickCodeEditor"
        loader={loadComponent}
        args={args as Record<string, unknown>}
      />
    </div>
  ),
};
