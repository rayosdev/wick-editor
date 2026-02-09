import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./GeneralWarning");

const meta: Meta = {
  title: "Editor/Modals/GeneralWarning/GeneralWarning",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="GeneralWarning"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
