import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import WickButton from "./WickButton";

const meta: Meta<typeof WickButton> = {
  title: "Editor/Util/WickInput/WickButton/WickButton",
  component: WickButton,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [primaryCount, setPrimaryCount] = useState(0);
    const [secondaryCount, setSecondaryCount] = useState(0);

    return (
      <div style={{ display: "grid", gap: "0.75rem", justifyItems: "start" }}>
        <WickButton
          className="storybook-wick-button"
          onClick={() => setPrimaryCount((count) => count + 1)}
          secondaryAction={() => setSecondaryCount((count) => count + 1)}
        >
          Trigger
        </WickButton>
        <output data-testid="wick-button-primary">Primary: {primaryCount}</output>
        <output data-testid="wick-button-secondary">
          Secondary: {secondaryCount}
        </output>
      </div>
    );
  },
};
