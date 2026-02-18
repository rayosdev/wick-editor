import type { Meta, StoryObj } from "@storybook/react-vite";
import ScriptWindowRow from "./ScriptWindowRow";

const meta: Meta<typeof ScriptWindowRow> = {
  title: "Editor/Panels/Inspector/InspectorScriptWindow/ScriptWindowRow/ScriptWindowRow",
  parameters: {
    layout: "padded",
  },
  args: {
    name: "click",
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
    editScript: () => undefined,
    deleteScript: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80 bg-[#2f2f2f] p-2">
      <ScriptWindowRow {...args} />
    </div>
  ),
};

export const KeyboardColor: Story = {
  args: {
    name: "keydown",
  },
  render: Default.render,
};
