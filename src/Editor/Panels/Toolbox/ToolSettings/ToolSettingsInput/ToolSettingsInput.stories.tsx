import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ToolSettingsInput");

const meta: Meta = {
  title: "Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/ToolSettingsInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ToolSettingsInput"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
