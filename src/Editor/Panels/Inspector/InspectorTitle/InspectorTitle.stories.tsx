import type { Meta, StoryObj } from "@storybook/react-vite";
import InspectorTitle from "./InspectorTitle";

const meta: Meta<typeof InspectorTitle> = {
  title: "Editor/Panels/Inspector/InspectorTitle/InspectorTitle",
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Rectangle",
    type: "shape",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 bg-[#2f2f2f]">
      <InspectorTitle {...args} />
    </div>
  ),
};

export const NameOnly: Story = {
  args: {
    title: undefined,
    type: undefined,
  },
  render: Default.render,
};
