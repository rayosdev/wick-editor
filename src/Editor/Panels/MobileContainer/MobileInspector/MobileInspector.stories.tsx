import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MobileInspector");

const meta: Meta = {
  title: "Editor/Panels/MobileContainer/MobileInspector/MobileInspector",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MobileInspector"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
