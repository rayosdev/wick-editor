import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import WickInputV2LegacyAdapter from "./WickInputV2LegacyAdapter";

const meta: Meta = {
  title: "Editor/Util/WickInputV2/WickInputV2LegacyAdapter",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const LegacyParityForm: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      name: "Legacy Scene",
      frameRate: 24,
      quality: 60,
      renderer: "cpu",
      loopPlayback: false,
      accent: "#2ca8ff",
      applyCount: 0,
    });

    const update = <K extends keyof typeof settings>(
      key: K,
      value: (typeof settings)[K]
    ) => {
      setSettings((previous) => ({
        ...previous,
        [key]: value,
      }));
    };

    return (
      <div
        style={{
          width: "min(560px, 100%)",
          display: "grid",
          gap: "0.8rem",
          padding: "0.95rem",
          borderRadius: "0.85rem",
          border: "1px solid #30394b",
          background:
            "linear-gradient(165deg, rgba(18, 26, 38, 0.94) 0%, rgba(31, 41, 58, 0.94) 100%)",
        }}
      >
        <WickInputV2LegacyAdapter
          type="text"
          label="Project Name"
          value={settings.name}
          onChange={(value) => update("name", String(value))}
        />

        <WickInputV2LegacyAdapter
          type="numeric"
          label="Frame Rate"
          value={settings.frameRate}
          min={1}
          max={60}
          onChange={(value) => update("frameRate", Number(value))}
        />

        <WickInputV2LegacyAdapter
          type="slider"
          label="Quality"
          value={settings.quality}
          min={1}
          max={100}
          onChange={(value) => update("quality", Number(value))}
        />

        <WickInputV2LegacyAdapter
          type="select"
          label="Renderer"
          value={settings.renderer}
          options={[
            { label: "Canvas", value: "cpu" },
            { label: "WebGL", value: "gpu" },
            { label: "Hybrid", value: "hybrid" },
          ]}
          onChange={(value) => update("renderer", String(value))}
        />

        <WickInputV2LegacyAdapter
          type="checkbox"
          label="Loop Playback"
          value={settings.loopPlayback}
          onChange={(value) => update("loopPlayback", Boolean(value))}
        />

        <WickInputV2LegacyAdapter
          type="color"
          label="Accent"
          value={settings.accent}
          onChange={(value) => update("accent", String(value))}
        />

        <WickInputV2LegacyAdapter
          type="button"
          onClick={() =>
            setSettings((previous) => ({
              ...previous,
              applyCount: previous.applyCount + 1,
            }))
          }
        >
          Apply Legacy Preset
        </WickInputV2LegacyAdapter>

        <output
          data-testid="wick-input-v2-legacy-summary"
          style={{
            borderRadius: "0.6rem",
            padding: "0.55rem 0.65rem",
            border: "1px solid #30435f",
            color: "#d9ecff",
            fontSize: "0.82rem",
            background: "rgba(15, 23, 36, 0.75)",
          }}
        >
          Name: {settings.name} | FPS: {settings.frameRate} | Quality:{" "}
          {settings.quality} | Renderer: {settings.renderer} | Loop:{" "}
          {settings.loopPlayback ? "yes" : "no"} | Accent: {settings.accent} |
          Applied: {settings.applyCount}
        </output>
      </div>
    );
  },
};

type MockSoundAsset = {
  uuid: string;
  name: string;
};

type MockSoundSelection = MockSoundAsset | null;

const SOUND_OPTIONS: Array<{ label: string; value: MockSoundSelection }> = [
  { label: "No Sound", value: null },
  { label: "Kick", value: { uuid: "asset-kick", name: "Kick Drum" } },
  { label: "Snare", value: { uuid: "asset-snare", name: "Snare Drum" } },
];

export const LegacyObjectSelectParity: Story = {
  render: () => {
    const [selectedSound, setSelectedSound] = useState<MockSoundSelection>(
      SOUND_OPTIONS[1]?.value ?? null
    );

    return (
      <div
        style={{
          width: "min(520px, 100%)",
          display: "grid",
          gap: "0.8rem",
          padding: "0.95rem",
          borderRadius: "0.85rem",
          border: "1px solid #30394b",
          background:
            "linear-gradient(165deg, rgba(18, 26, 38, 0.94) 0%, rgba(31, 41, 58, 0.94) 100%)",
        }}
      >
        <WickInputV2LegacyAdapter
          type="select"
          label="Sound Asset"
          value={selectedSound}
          options={SOUND_OPTIONS}
          onChange={(value) => setSelectedSound((value as MockSoundSelection) ?? null)}
        />

        <output
          data-testid="wick-input-v2-legacy-object-select-summary"
          style={{
            borderRadius: "0.6rem",
            padding: "0.55rem 0.65rem",
            border: "1px solid #30435f",
            color: "#d9ecff",
            fontSize: "0.82rem",
            background: "rgba(15, 23, 36, 0.75)",
          }}
        >
          Selected:{" "}
          {selectedSound
            ? `${selectedSound.uuid} (${selectedSound.name})`
            : "none"}
        </output>
      </div>
    );
  },
};

export const LegacyAdvancedColorPickerParity: Story = {
  render: () => {
    const [accent, setAccent] = useState("#2ca8ff");
    const [pickerType, setPickerType] = useState<"swatches" | "spectrum">(
      "swatches"
    );
    const [recentColors, setRecentColors] = useState<string[]>([
      "#2ca8ff",
      "#ffffff",
      "#000000",
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffaa00",
      "#ff00aa",
    ]);

    return (
      <div
        style={{
          width: "min(520px, 100%)",
          display: "grid",
          gap: "0.8rem",
          padding: "0.95rem",
          borderRadius: "0.85rem",
          border: "1px solid #30394b",
          background:
            "linear-gradient(165deg, rgba(18, 26, 38, 0.94) 0%, rgba(31, 41, 58, 0.94) 100%)",
        }}
      >
        <WickInputV2LegacyAdapter
          type="color"
          label="Accent Advanced"
          value={accent}
          placement="bottom"
          colorPickerType={pickerType}
          changeColorPickerType={setPickerType}
          lastColorsUsed={recentColors}
          updateLastColors={(nextColor) => {
            setRecentColors((previous) => [nextColor, ...previous].slice(0, 8));
          }}
          onChange={(nextColor) => setAccent(nextColor)}
        />

        <output
          data-testid="wick-input-v2-legacy-advanced-color-summary"
          style={{
            borderRadius: "0.6rem",
            padding: "0.55rem 0.65rem",
            border: "1px solid #30435f",
            color: "#d9ecff",
            fontSize: "0.82rem",
            background: "rgba(15, 23, 36, 0.75)",
          }}
        >
          Color: {accent} | Mode: {pickerType}
        </output>
      </div>
    );
  },
};
