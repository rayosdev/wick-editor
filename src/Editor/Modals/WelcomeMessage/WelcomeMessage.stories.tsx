import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./WelcomeMessage");

const meta: Meta = {
  title: "Editor/Modals/WelcomeMessage/WelcomeMessage",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="WelcomeMessage"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
