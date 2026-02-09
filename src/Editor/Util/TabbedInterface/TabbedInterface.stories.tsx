import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import TabbedInterface from "./TabbedInterface";

const meta: Meta<typeof TabbedInterface> = {
  title: "Editor/Util/TabbedInterface/TabbedInterface",
  component: TabbedInterface,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [selectedTab, setSelectedTab] = useState("Draw");
    const panels = useMemo(
      () => [
        <div key="draw" data-testid="tab-panel-draw">
          Draw panel content
        </div>,
        <div key="animate" data-testid="tab-panel-animate">
          Animate panel content
        </div>,
        <div key="code" data-testid="tab-panel-code">
          Code panel content
        </div>,
      ],
      []
    );

    return (
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "360px" }}>
        <TabbedInterface
          tabNames={["Draw", "Animate", "Code"]}
          onTabSelect={setSelectedTab}
        >
          {panels}
        </TabbedInterface>
        <output data-testid="selected-tab">Selected: {selectedTab}</output>
      </div>
    );
  },
};
