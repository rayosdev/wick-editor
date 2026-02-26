import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./MobileInspector");

const meta: Meta = {
  title: "Editor/Panels/MobileContainer/MobileInspector/MobileInspector",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="MobileInspector"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};

const mockColor = (value: string) => ({
  toCSS: () => value,
});

export const PathSelection: Story = {
  args: {
    getSelectionType: () => "path",
    getAllSelectionAttributes: () => ({
      originX: 120,
      originY: 80,
      width: 140,
      height: 100,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      strokeColor: mockColor("#1f1f1f"),
      fillColor: mockColor("#2f80ed"),
      strokeWidth: 2,
      opacity: 1,
    }),
  },
  render: (args) => (
    <DynamicComponentStory
      componentName="MobileInspector"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
