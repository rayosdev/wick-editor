import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import AddScriptPanel from "./AddScriptPanel";

type ScriptType = "Mouse" | "Keyboard" | "Timeline";

type StoryScript = {
  name: string;
  type: ScriptType;
  description: string;
};

const meta: Meta<typeof AddScriptPanel> = {
  title: "Editor/PopOuts/WickCodeEditor/AddScriptPanel/AddScriptPanel",
  component: AddScriptPanel,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [tab, setTab] = useState<ScriptType>("Mouse");
    const [lastScript, setLastScript] = useState("none");

    const scriptsByTab = useMemo<Record<ScriptType, StoryScript[]>>(
      () => ({
        Mouse: [
          {
            name: "click",
            type: "Mouse",
            description: "Runs when the object is clicked",
          },
          {
            name: "mouseenter",
            type: "Mouse",
            description: "Runs when the pointer enters the object",
          },
        ],
        Keyboard: [
          {
            name: "keydown",
            type: "Keyboard",
            description: "Runs when a key is pressed",
          },
          {
            name: "keyup",
            type: "Keyboard",
            description: "Runs when a key is released",
          },
        ],
        Timeline: [
          {
            name: "load",
            type: "Timeline",
            description: "Runs when the timeline starts",
          },
          {
            name: "update",
            type: "Timeline",
            description: "Runs on each timeline update",
          },
        ],
      }),
      []
    );

    const activeScripts = scriptsByTab[tab];

    return (
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "520px" }}>
        <AddScriptPanel
          addScriptTab={tab}
          changeTab={(newTab) => setTab(newTab as ScriptType)}
          scripts={activeScripts}
          availableScripts={activeScripts.map((script) => script.name)}
          addScript={(name) => setLastScript(name)}
        />
        <output data-testid="add-script-active-tab">Tab: {tab}</output>
        <output data-testid="add-script-last-script">
          Last Script: {lastScript}
        </output>
      </div>
    );
  },
};
