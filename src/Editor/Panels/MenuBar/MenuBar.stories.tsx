import type { Meta, StoryObj } from "@storybook/react-vite";
import MenuBar from "./MenuBar";

const noop = () => undefined;

const meta: Meta<typeof MenuBar> = {
  title: "Editor/Panels/MenuBar/MenuBar",
  parameters: {
    layout: "padded",
  },
  args: {
    renderSize: "large",
    projectName: "My Project",
    exporting: false,
    openModal: noop,
    openNewProjectConfirmation: noop,
    openProjectFileDialog: noop,
    exportProjectAsWickFile: noop,
    openExportMedia: noop,
    openExportOptions: noop,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="h-10 w-[1100px]">
      <MenuBar {...args} />
    </div>
  ),
};

export const Mobile: Story = {
  args: {
    renderSize: "small",
  },
  render: (args) => (
    <div className="h-10 w-[420px]">
      <MenuBar {...args} />
    </div>
  ),
};
