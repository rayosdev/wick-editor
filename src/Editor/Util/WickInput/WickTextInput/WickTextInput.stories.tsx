import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import WickTextInput from "./WickTextInput";

const meta: Meta<typeof WickTextInput> = {
  title: "Editor/Util/WickInput/WickTextInput/WickTextInput",
  component: WickTextInput,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("Hello Wick");

    return (
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "280px" }}>
        <WickTextInput
          aria-label="Wick text input"
          value={value}
          onChange={setValue}
        />
        <output data-testid="wick-text-input-value">Current: {value}</output>
      </div>
    );
  },
};

export const DigitsOnly: Story = {
  render: () => {
    const [value, setValue] = useState("42");

    return (
      <div style={{ display: "grid", gap: "0.75rem", maxWidth: "280px" }}>
        <WickTextInput
          aria-label="Digits only input"
          value={value}
          onChange={setValue}
          isValidRegex={/^\d*$/}
        />
        <output data-testid="wick-text-input-digits-value">
          Current: {value}
        </output>
      </div>
    );
  },
};
