import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./OutlinerTitle");

const meta: Meta = {
  title: "Editor/Panels/Outliner/OutlinerTitle/OutlinerTitle",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="OutlinerTitle"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
