import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./WickTextInput");

const meta: Meta = {
  title: "Editor/Util/WickInput/WickTextInput/WickTextInput",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="WickTextInput"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
