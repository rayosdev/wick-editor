import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./KeyboardShortcuts");

const meta: Meta = {
  title: "Editor/Modals/SettingsModal/KeyboardShortcuts/KeyboardShortcuts",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="KeyboardShortcuts"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
