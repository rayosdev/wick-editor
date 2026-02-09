import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./AudioPlayer");

const meta: Meta = {
  title: "Editor/Util/AudioPlayer/AudioPlayer",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="AudioPlayer"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
