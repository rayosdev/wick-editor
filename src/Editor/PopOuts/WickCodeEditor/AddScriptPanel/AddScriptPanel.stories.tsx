import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./AddScriptPanel");

const meta: Meta = {
  title: "Editor/PopOuts/WickCodeEditor/AddScriptPanel/AddScriptPanel",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="AddScriptPanel"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
