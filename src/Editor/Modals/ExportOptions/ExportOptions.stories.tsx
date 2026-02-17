import type { Meta, StoryObj } from "@storybook/react-vite";
import DynamicComponentStory from "Editor/storybook/DynamicComponentStory";

const loadComponent = () => import("./ExportOptions");

const meta: Meta = {
  title: "Editor/Modals/ExportOptions/ExportOptions",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    toggle: () => undefined,
    projectName: "My Project",
    exportProjectAsGif: () => undefined,
    exportProjectAsVideo: () => undefined,
    exportProjectAsStandaloneZip: () => undefined,
    exportProjectAsStandaloneHTML: () => undefined,
    exportProjectAsImageSequence: () => undefined,
    exportProjectAsAudioTrack: () => undefined,
    exportProjectAsImageSVG: () => undefined,
    queueModal: () => undefined,
    project: {},
    isMobile: false,
  },
  render: (args) => (
    <DynamicComponentStory
      componentName="ExportOptions"
      loader={loadComponent}
      args={args as Record<string, unknown>}
    />
  ),
};
