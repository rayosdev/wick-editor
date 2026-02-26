import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import WickField, { type WickFieldOption } from "./WickField";

const QUALITY_OPTIONS: WickFieldOption[] = [
  { label: "Draft", value: "draft" },
  { label: "Balanced", value: "balanced" },
  { label: "Ultra", value: "ultra" },
];

const meta: Meta = {
  title: "Editor/Util/WickInputV2/WickField",
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Workbench: Story = {
  render: () => {
    const [projectName, setProjectName] = useState("Wick Neo");
    const [fps, setFps] = useState(24);
    const [quality, setQuality] = useState("balanced");
    const [snapToGrid, setSnapToGrid] = useState(true);
    const [onionOpacity, setOnionOpacity] = useState(60);
    const [accent, setAccent] = useState("#2ca8ff");
    const [applyCount, setApplyCount] = useState(0);

    const summary = useMemo(
      () =>
        [
          `Project: ${projectName}`,
          `FPS: ${fps}`,
          `Quality: ${quality}`,
          `Snap: ${snapToGrid ? "on" : "off"}`,
          `Onion: ${onionOpacity}%`,
          `Accent: ${accent}`,
          `Applied: ${applyCount}`,
        ].join(" | "),
      [projectName, fps, quality, snapToGrid, onionOpacity, accent, applyCount]
    );

    return (
      <div
        style={{
          width: "min(620px, 92vw)",
          borderRadius: "18px",
          padding: "18px",
          border: "1px solid #2f4662",
          background:
            "linear-gradient(140deg, rgba(10, 20, 34, 0.98), rgba(18, 33, 48, 0.98))",
          boxShadow: "0 20px 40px rgba(2, 8, 17, 0.35)",
          display: "grid",
          gap: "12px",
        }}
      >
        <div style={{ color: "#d4ebff", fontSize: "0.95rem", fontWeight: 700 }}>
          WickField Workbench
        </div>

        <WickField
          label="Project Name"
          value={projectName}
          onValueChange={setProjectName}
          hint="Modern API: `onValueChange` for all value-based controls."
        />

        <WickField
          kind="number"
          label="Frame Rate"
          value={fps}
          min={1}
          max={60}
          precision={0}
          onValueChange={setFps}
        />

        <WickField
          kind="select"
          label="Preview Quality"
          value={quality}
          options={QUALITY_OPTIONS}
          onValueChange={setQuality}
        />

        <WickField
          kind="toggle"
          label="Snap To Grid"
          checked={snapToGrid}
          onValueChange={setSnapToGrid}
        />

        <WickField
          kind="range"
          label="Onion Skin Opacity"
          value={onionOpacity}
          min={0}
          max={100}
          onValueChange={setOnionOpacity}
        />

        <WickField
          kind="color"
          label="Accent Color"
          value={accent}
          onValueChange={setAccent}
        />

        <WickField
          kind="action"
          intent="primary"
          onPress={() => setApplyCount((count) => count + 1)}
        >
          Apply Field Preset
        </WickField>

        <output
          data-testid="wick-field-workbench-summary"
          style={{
            borderRadius: "10px",
            border: "1px solid #2f4f74",
            padding: "9px 10px",
            color: "#e6f3ff",
            fontSize: "0.82rem",
            background: "rgba(7, 16, 27, 0.7)",
          }}
        >
          {summary}
        </output>
      </div>
    );
  },
};
