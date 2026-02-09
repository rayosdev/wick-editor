import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MakeAnimated");

const meta: Meta = {
  title: "Editor/Modals/MakeAnimated/MakeAnimated",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MakeAnimated"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
