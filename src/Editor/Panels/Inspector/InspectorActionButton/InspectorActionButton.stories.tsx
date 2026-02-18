import type { Meta, StoryObj } from "@storybook/react-vite";
import InspectorActionButton from "./InspectorActionButton";

const meta: Meta<typeof InspectorActionButton> = {
  title: "Editor/Panels/Inspector/InspectorActionButton/InspectorActionButton",
  parameters: {
    layout: "padded",
  },
  args: {
    action: {
      id: "delete-action",
      icon: "delete",
      tooltip: "Delete",
      action: () => undefined,
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <div className="w-64 bg-[#2f2f2f] p-2"><InspectorActionButton {...args} /></div>,
};

export const CustomColor: Story = {
  args: {
    action: {
      id: "break-apart-action",
      icon: "breakapart",
      tooltip: "Break Apart",
      color: "active-blue",
      action: () => undefined,
    },
  },
  render: Default.render,
};
