import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ToolboxBreak");

const meta: Meta = {
  title: "Editor/Panels/Toolbox/ToolboxBreak/ToolboxBreak",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ToolboxBreak"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
