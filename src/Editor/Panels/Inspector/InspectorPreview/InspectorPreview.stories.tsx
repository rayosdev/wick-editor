import type { Meta, StoryObj } from "@storybook/react-vite";
import InspectorPreview from "./InspectorPreview";

const meta: Meta<typeof InspectorPreview> = {
  title: "Editor/Panels/Inspector/InspectorPreview/InspectorPreview",
  parameters: {
    layout: "padded",
  },
  args: {
    info: {
      type: "image",
      src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231EE29A'/%3E%3Ccircle cx='50' cy='50' r='28' fill='%23303030'/%3E%3C/svg%3E",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 bg-[#2f2f2f] p-2">
      <InspectorPreview {...args} />
    </div>
  ),
};

export const Sound: Story = {
  args: {
    info: {
      type: "sound",
      src: "",
      loadSrc: () => undefined,
    },
  },
  render: Default.render,
};
