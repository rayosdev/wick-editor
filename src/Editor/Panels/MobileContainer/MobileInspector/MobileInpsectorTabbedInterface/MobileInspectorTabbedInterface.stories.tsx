import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MobileInspectorTabbedInterface");

const meta: Meta = {
  title: "Editor/Panels/MobileContainer/MobileInspector/MobileInpsectorTabbedInterface/MobileInspectorTabbedInterface",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MobileInspectorTabbedInterface"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
