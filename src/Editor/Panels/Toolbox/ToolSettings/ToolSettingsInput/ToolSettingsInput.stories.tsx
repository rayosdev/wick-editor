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

const renderStory = (args: Story["args"]) => (
  <DynamicComponentStory
    componentName="ToolSettingsInput"
    loader={loadComponent}
    args={(args ?? {}) as Record<string, unknown>}
  />
);

export const Default: Story = {
  render: renderStory,
};

export const Checkbox: Story = {
  render: renderStory,
  args: {
    type: "checkbox",
    name: "Enable Pressure",
    icon: "brushpressure",
    value: false,
  },
};

export const Dropdown: Story = {
  render: renderStory,
  args: {
    type: "dropdown",
    name: "Brush Mode",
    value: "none",
    options: [
      { label: "None", value: "none" },
      { label: "Inside", value: "inside" },
      { label: "Behind", value: "behind" },
    ],
  },
};

export const MobileCheckbox: Story = {
  render: renderStory,
  args: {
    type: "checkbox",
    name: "Enable Pressure",
    icon: "brushpressure",
    value: true,
    renderSize: "small",
    isMobile: true,
  },
};
