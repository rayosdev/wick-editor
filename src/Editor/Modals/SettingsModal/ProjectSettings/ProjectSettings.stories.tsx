import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ProjectSettings");

const meta: Meta = {
  title: "Editor/Modals/SettingsModal/ProjectSettings/ProjectSettings",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    project: {
      name: "My Project",
      width: 720,
      height: 480,
      framerate: 12,
      backgroundColor: "#ffffff",
    },
    updateProjectSettings: () => undefined,
    toggle: () => undefined,
    isMobile: false,
    colorPickerType: "chrome",
    changeColorPickerType: () => undefined,
    updateLastColors: () => undefined,
    lastColorsUsed: ["#ffffff", "#01C094", "#4F4F4F"],
  },
  render: (args) => (
    <DynamicComponentStory
      componentName="ProjectSettings"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
