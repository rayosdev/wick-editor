import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MenuBarSupportButton");

const meta: Meta = {
  title: "Editor/Panels/MenuBar/MenuBarSupportButton/MenuBarSupportButton",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MenuBarSupportButton"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
