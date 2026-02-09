import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./PlayButton");

const meta: Meta = {
  title: "Editor/Util/PlayButton/PlayButton",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="PlayButton"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
