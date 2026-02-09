import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./OutlinerDropdown");

const meta: Meta = {
  title: "Editor/Panels/Outliner/OutlinerObject/OutlinerDropdown/OutlinerDropdown",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="OutlinerDropdown"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
