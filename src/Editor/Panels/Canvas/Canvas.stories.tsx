import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./Canvas");

const meta: Meta = {
  title: "Editor/Panels/Canvas/Canvas",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="Canvas"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
