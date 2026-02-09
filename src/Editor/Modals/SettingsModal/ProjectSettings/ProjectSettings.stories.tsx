import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ProjectSettings");

const meta: Meta = {
  title: "Editor/Modals/SettingsModal/ProjectSettings/ProjectSettings",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ProjectSettings"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
