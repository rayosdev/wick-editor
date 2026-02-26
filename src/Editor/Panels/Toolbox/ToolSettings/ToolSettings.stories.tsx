import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ToolSettings");

const meta: Meta = {
  title: "Editor/Panels/Toolbox/ToolSettings/ToolSettings",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const getToolSetting = (setting: string): string | number | boolean => {
  if (setting === "brushMode") return "none";
  if (setting === "pressureEnabled" || setting === "relativeBrushSize") {
    return false;
  }
  if (setting === "brushSize") return 12;
  if (setting === "brushStabilizerWeight") return 20;
  if (setting === "eraserSize") return 12;
  if (setting === "strokeWidth") return 3;
  if (setting === "cornerRadius") return 8;
  if (setting === "gapFillAmount") return 1;
  return 1;
};

const sharedArgs = {
  renderSize: "large" as const,
  isMobile: false,
  activeTool: "brush",
  getToolSetting,
  setToolSetting: () => undefined,
  getToolSettingRestrictions: () => ({
    min: 0,
    max: 100,
    step: 1,
    options: ["none", "inside", "behind"],
  }),
  toggleBrushModes: () => undefined,
  previewPlaying: false,
};

export const Default: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ToolSettings"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
  args: {
    ...sharedArgs,
    showBrushModes: false,
  },
};

export const BrushModesOpen: Story = {
  render: (args) => (
    <DynamicComponentStory
      componentName="ToolSettings"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
  args: {
    ...sharedArgs,
    showBrushModes: true,
  },
};
