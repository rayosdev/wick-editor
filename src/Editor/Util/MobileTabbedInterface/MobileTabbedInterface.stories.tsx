import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MobileTabbedInterface");

const meta: Meta = {
  title: "Editor/Util/MobileTabbedInterface/MobileTabbedInterface",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MobileTabbedInterface"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
