import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./index");

const meta: Meta = {
  title: "Editor/Util/ErrorPage",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ErrorPage"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
