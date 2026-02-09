import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ModalHandler");

const meta: Meta = {
  title: "Editor/Modals/ModalHandler/ModalHandler",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ModalHandler"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
