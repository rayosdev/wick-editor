import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./AutosaveWarning");

const meta: Meta = {
  title: "Editor/Modals/AutosaveWarning/AutosaveWarning",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="AutosaveWarning"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
