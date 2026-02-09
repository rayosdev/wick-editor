import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./OutlinerExpandButton");

const meta: Meta = {
  title: "Editor/Panels/OutlinerExpandButton/OutlinerExpandButton",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="OutlinerExpandButton"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
