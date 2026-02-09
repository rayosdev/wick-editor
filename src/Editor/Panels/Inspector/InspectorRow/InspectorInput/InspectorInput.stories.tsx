import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./InspectorInput");

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorRow/InspectorInput/InspectorInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="InspectorInput"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
