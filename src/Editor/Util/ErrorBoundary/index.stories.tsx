import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./index");

const meta: Meta = {
  title: "Editor/Util/ErrorBoundary",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ErrorBoundary"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
