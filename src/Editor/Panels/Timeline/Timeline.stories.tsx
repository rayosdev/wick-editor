import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./Timeline");

const meta: Meta = {
  title: "Editor/Panels/Timeline/Timeline",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="Timeline"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
