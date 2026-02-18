import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import OutlinerExpandButton from "./OutlinerExpandButton";

const meta: Meta<typeof OutlinerExpandButton> = {
  title: "Editor/Panels/OutlinerExpandButton/OutlinerExpandButton",
  component: OutlinerExpandButton,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(true);

    return (
      <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
        <OutlinerExpandButton
          expanded={expanded}
          toggleOutliner={() => setExpanded((value) => !value)}
        />
        <output data-testid="outliner-expanded-state">
          State: {expanded ? "Expanded" : "Collapsed"}
        </output>
      </div>
    );
  },
};

export const Collapsed: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
      <OutlinerExpandButton expanded={false} toggleOutliner={() => undefined} />
      <output data-testid="outliner-expanded-state">State: Collapsed</output>
    </div>
  ),
};
