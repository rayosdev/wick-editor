import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./Asset");

const meta: Meta = {
  title: "Editor/Panels/AssetLibrary/Asset/Asset",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="Asset"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
