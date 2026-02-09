import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./WickButton");

const meta: Meta = {
  title: "Editor/Util/WickInput/WickButton/WickButton",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="WickButton"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
