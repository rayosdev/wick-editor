import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./InspectorPreview");

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorPreview/InspectorPreview",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="InspectorPreview"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
