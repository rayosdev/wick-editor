import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./EditorSettings");

const meta: Meta = {
  title: "Editor/Modals/SettingsModal/EditorSettings/EditorSettings",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="EditorSettings"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
