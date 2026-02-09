import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ToolButton");

const meta: Meta = {
  title: "Editor/Panels/Toolbox/ToolButton/ToolButton",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ToolButton"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
