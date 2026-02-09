import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MenuBarIconButtonComponent");

const meta: Meta = {
  title: "Editor/Panels/MenuBar/MenuBarIconButton/MenuBarIconButtonComponent",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MenuBarIconButtonComponent"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
