import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./OutlinerDisplay");

const meta: Meta = {
  title: "Editor/Panels/Outliner/OutlinerRow/OutlinerRowTypes/OutlinerDisplay",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="OutlinerDisplay"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
