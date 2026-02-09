import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MobileInspectorColor");

const meta: Meta = {
  title: "Editor/Panels/MobileContainer/MobileInspector/MobileInspectorRow/MobileInspectorRowTypes/MobileInspectorColor",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MobileInspectorColor"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
