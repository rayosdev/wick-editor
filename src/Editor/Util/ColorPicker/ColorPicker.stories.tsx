import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ColorPicker");

const meta: Meta = {
  title: "Editor/Util/ColorPicker/ColorPicker",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ColorPicker"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
