import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import WickInputV2, { type WickInputV2Option } from "./WickInputV2";

const RENDERER_OPTIONS: WickInputV2Option[] = [
  { label: "Canvas (CPU)", value: "cpu" },
  { label: "WebGL (GPU)", value: "gpu" },
  { label: "Hybrid", value: "hybrid" },
];

const meta: Meta = {
  title: "Editor/Util/WickInputV2/WickInputV2",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CompositeForm: Story = {
  render: () => {
    const [projectName, setProjectName] = useState("Project Aurora");
    const [frameRate, setFrameRate] = useState(24);
    const [renderer, setRenderer] = useState("cpu");
    const [lockCamera, setLockCamera] = useState(false);
    const [accentColor, setAccentColor] = useState("#2ca8ff");
    const [canvasOpacity, setCanvasOpacity] = useState(65);
    const [applyCount, setApplyCount] = useState(0);

    return (
      <div
        style={{
          width: "min(540px, 100%)",
          display: "grid",
          gap: "0.8rem",
          padding: "0.95rem",
          borderRadius: "0.85rem",
          border: "1px solid #30394b",
          background:
            "linear-gradient(160deg, rgba(19, 25, 35, 0.92) 0%, rgba(31, 39, 55, 0.92) 100%)",
        }}
      >
        <WickInputV2
          label="Project Name"
          value={projectName}
          onChange={setProjectName}
          hint="Used for save metadata and exported project labels."
        />

        <WickInputV2
          kind="number"
          label="Frame Rate"
          value={frameRate}
          min={1}
          max={60}
          precision={0}
          onChange={setFrameRate}
          hint="Clamp range: 1-60 FPS."
        />

        <WickInputV2
          kind="select"
          label="Renderer"
          value={renderer}
          onChange={setRenderer}
          options={RENDERER_OPTIONS}
        />

        <WickInputV2
          kind="checkbox"
          label="Lock Camera In Preview"
          checked={lockCamera}
          onChange={setLockCamera}
          hint="Prevents accidental panning while animating."
        />

        <WickInputV2
          kind="color"
          label="Accent Color"
          value={accentColor}
          onChange={setAccentColor}
        />

        <WickInputV2
          kind="range"
          label="Canvas Opacity"
          value={canvasOpacity}
          min={0}
          max={100}
          onChange={setCanvasOpacity}
          hint="Controls onion-skin overlay visibility."
        />

        <WickInputV2
          kind="action"
          intent="primary"
          onClick={() => setApplyCount((count) => count + 1)}
        >
          Apply Preset
        </WickInputV2>

        <output
          data-testid="wick-input-v2-summary"
          style={{
            borderRadius: "0.6rem",
            padding: "0.55rem 0.65rem",
            border: "1px solid #30435f",
            color: "#d9ecff",
            fontSize: "0.82rem",
            background: "rgba(15, 23, 36, 0.75)",
          }}
        >
          Project: {projectName} | FPS: {frameRate} | Renderer: {renderer} | Locked:{" "}
          {lockCamera ? "yes" : "no"} | Accent: {accentColor} | Opacity: {canvasOpacity}% |
          Applied: {applyCount}
        </output>
      </div>
    );
  },
};

export const ValidationState: Story = {
  render: () => {
    const [frameRate, setFrameRate] = useState(80);
    const showError = frameRate < 1 || frameRate > 60;

    return (
      <div style={{ width: "min(360px, 100%)", display: "grid", gap: "0.8rem" }}>
        <WickInputV2
          kind="number"
          label="Frame Rate"
          value={frameRate}
          min={1}
          max={120}
          onChange={setFrameRate}
          error={showError ? "Frame rate must stay in the 1-60 FPS editing range." : undefined}
          hint={!showError ? "Current value is valid." : undefined}
        />
        <output data-testid="wick-input-v2-validation-state">
          Current FPS: {frameRate}
        </output>
      </div>
    );
  },
};
