import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./SettingsNumericSlider");

const meta: Meta = {
  title: "Editor/Panels/Toolbox/ToolSettings/ToolSettingsInput/SettingsNumericSlider/SettingsNumericSlider",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="SettingsNumericSlider"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
