import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ScriptWindowRow");

const meta: Meta = {
  title: "Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/ScriptWindowRow",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ScriptWindowRow"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
