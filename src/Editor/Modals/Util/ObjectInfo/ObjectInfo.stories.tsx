import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ObjectInfo");

const meta: Meta = {
  title: "Editor/Modals/Util/ObjectInfo/ObjectInfo",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ObjectInfo"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
