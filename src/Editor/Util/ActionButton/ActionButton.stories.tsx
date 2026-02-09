import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ActionButton");

const meta: Meta = {
  title: "Editor/Util/ActionButton/ActionButton",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ActionButton"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
