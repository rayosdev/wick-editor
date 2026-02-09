import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ConsolePanel");

const meta: Meta = {
  title: "Editor/PopOuts/WickCodeEditor/ConsolePanel",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ConsolePanel"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
