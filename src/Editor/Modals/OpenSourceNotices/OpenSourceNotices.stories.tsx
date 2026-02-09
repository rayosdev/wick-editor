import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./OpenSourceNotices");

const meta: Meta = {
  title: "Editor/Modals/OpenSourceNotices/OpenSourceNotices",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="OpenSourceNotices"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
