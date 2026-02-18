import type { Meta, StoryObj } from "@storybook/react-vite";
import DockedPanel from "./DockedPanel";

const meta: Meta<typeof DockedPanel> = {
  title: "Editor/Panels/DockedPanel/DockedPanel",
  parameters: {
    layout: "padded",
  },
  args: {
    showOverlay: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="h-56 w-80 bg-[#2f2f2f]">
      <DockedPanel {...args}>
        <div className="p-3 text-white">Panel Content</div>
      </DockedPanel>
    </div>
  ),
};

export const WithOverlay: Story = {
  args: {
    showOverlay: true,
  },
  render: Default.render,
};
