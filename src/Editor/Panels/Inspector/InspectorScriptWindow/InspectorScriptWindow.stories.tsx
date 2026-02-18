import type { Meta, StoryObj } from "@storybook/react-vite";
import InspectorScriptWindow from "./InspectorScriptWindow";

const meta: Meta<typeof InspectorScriptWindow> = {
  title: "Editor/Panels/Inspector/InspectorScriptWindow/InspectorScriptWindow",
  parameters: {
    layout: "padded",
  },
  args: {
    scriptInfoInterface: {
      scriptsByType: {
        mouse: ["click", "mouseenter"],
        keyboard: ["keydown"],
      },
      scriptTypeColors: {
        mouse: "green",
        keyboard: "yellow",
      },
    },
    script: {
      scripts: [{ name: "click" }, { name: "mouseenter" }, { name: "keydown" }],
    },
    deleteScript: () => undefined,
    editScript: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 bg-[#2f2f2f] p-2">
      <InspectorScriptWindow {...args} />
    </div>
  ),
};
