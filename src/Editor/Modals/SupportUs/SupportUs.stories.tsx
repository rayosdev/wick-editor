import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./SupportUs");

const meta: Meta = {
  title: "Editor/Modals/SupportUs/SupportUs",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="SupportUs"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
