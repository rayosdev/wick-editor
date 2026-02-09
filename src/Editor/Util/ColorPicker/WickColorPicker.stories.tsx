import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./WickColorPicker");

const meta: Meta = {
  title: "Editor/Util/ColorPicker/WickColorPicker",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="WickColorPicker"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
