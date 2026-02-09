import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import ConsolePanel, { type ConsoleEntry } from "./ConsolePanel";

const meta: Meta<typeof ConsolePanel> = {
  title: "Editor/PopOuts/WickCodeEditor/ConsolePanel",
  component: ConsolePanel,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [logs, setLogs] = useState<ConsoleEntry[]>([]);

    const addLog = (): void => {
      setLogs((currentLogs) => {
        const nextIndex = currentLogs.length + 1;
        return [
          ...currentLogs,
          {
            id: `log-${nextIndex}`,
            method: nextIndex % 2 === 0 ? "warn" : "log",
            data: [`entry ${nextIndex}`, { index: nextIndex }],
            timestamp: Date.now(),
          },
        ];
      });
    };

    return (
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "640px" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="button" onClick={addLog}>
            Add Log
          </button>
          <button type="button" onClick={() => setLogs([])}>
            Clear Logs
          </button>
        </div>
        <output data-testid="console-log-count">Count: {logs.length}</output>
        <ConsolePanel logs={logs} />
      </div>
    );
  },
};
