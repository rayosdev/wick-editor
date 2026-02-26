import React, { CSSProperties } from "react";
import tinycolor from "tinycolor2";
import type { PickerColorChange, PickerColorValue } from "./ColorPicker";
import { activateEditorEyedropper } from "./editorEyedropperBridge";

import ActionButton from "Editor/Util/ActionButton/ActionButton";

import { CustomPicker } from "react-color";
import { Saturation, Hue, Alpha } from "react-color/lib/components/common";
import { SketchFields } from "react-color/lib/components/sketch/SketchFields";

type ModernColorPickerProps = {
  color: PickerColorValue;
  colorPickerType?: "swatches" | "spectrum" | string;
  changeColorPickerType?: (type: string) => void;
  disableAlpha?: boolean;
  onChangeComplete: (color: PickerColorChange) => void;
  onChange?: (color: PickerColorChange) => void;
  lastColorsUsed?: string[];
  toggle: () => void;
};

const SWATCH_COLUMNS: string[][] = [
  ["#ff0000", "#ffcccc", "#ff9999", "#ff4d4d", "#cc0000", "#800000"],
  ["#ff8000", "#ffe6cc", "#ffcc99", "#ffa64d", "#cc6600", "#804000"],
  ["#ffff00", "#ffffcc", "#ffff99", "#ffff4d", "#cccc00", "#808000"],
  ["#00ff00", "#ccffcc", "#99ff99", "#4dff4d", "#00cc00", "#008000"],
  ["#00ff80", "#ccffe6", "#99ffcc", "#4dffa6", "#00cc66", "#008040"],
  ["#00ffff", "#ccffff", "#99ffff", "#4dffff", "#00cccc", "#008080"],
  ["#0080ff", "#cce6ff", "#99ccff", "#4da6ff", "#0066cc", "#004080"],
  ["#0000ff", "#ccccff", "#9999ff", "#4d4dff", "#0000cc", "#000080"],
  ["#8000ff", "#e6ccff", "#cc99ff", "#a64dff", "#6600cc", "#400080"],
  ["#ff00ff", "#ffccff", "#ff99ff", "#ff4dff", "#cc00cc", "#800080"],
  ["#ff0080", "#ffcce6", "#ff99cc", "#ff4da6", "#cc0066", "#800040"],
  ["#000000", "#ffffff", "#cccccc", "#999999", "#666666", "#333333"],
];

const SPECTRUM_SWATCHES = [
  "#D0021B",
  "#F8E71C",
  "#7ED321",
  "#4A90E2",
  "#000000",
  "#4A4A4A",
  "#FFFFFF",
  "#FFFFFF00",
];

const CHECKERBOARD_STYLE: CSSProperties = {
  backgroundImage:
    'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")',
  backgroundSize: "15px 15px",
};

const getColorString = (color: PickerColorValue): string =>
  typeof color === "string" ? color : color.rgba ?? color.toString();

const toPickerColor = (hex: string): PickerColorChange => {
  const parsed = tinycolor(hex);
  const rgb = parsed.toRgb();
  return {
    hex: parsed.toHexString(),
    rgb: {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: rgb.a,
    },
  };
};

const ModernColorPicker: React.FC<ModernColorPickerProps> = (props) => {
  const currentColor = getColorString(props.color);
  const normalizedCurrentHex = tinycolor(currentColor).toHexString();
  const lastColors = props.lastColorsUsed ?? Array.from({ length: 8 }, () => "#000000");

  const emitColor = (hex: string): void => {
    props.onChangeComplete(toPickerColor(hex));
  };

  const openEyedropper = (): void => {
    activateEditorEyedropper(props.onChange);
  };

  const renderHeader = (): JSX.Element => (
    <div className="flex h-[25px] items-center">
      <div className="mr-[4px] h-[25px] w-[30px]">
        <ActionButton
          color="tool"
          id="color-picker-swatches-button"
          tooltip="Swatches"
          action={() => props.changeColorPickerType?.("swatches")}
          isActive={() => props.colorPickerType === "swatches"}
          icon="swatches"
        />
      </div>
      <div className="mr-auto h-[25px] w-[30px]">
        <ActionButton
          color="tool"
          id="color-picker-spectrum-button"
          tooltip="Spectrum"
          action={() => props.changeColorPickerType?.("spectrum")}
          isActive={() => props.colorPickerType === "spectrum"}
          icon="spectrum"
        />
      </div>
      <div className="ml-auto h-[25px] w-[25px]">
        <ActionButton color="tool" icon="closemodal" action={props.toggle} />
      </div>
    </div>
  );

  const renderSwatches = (): JSX.Element => (
    <div
      className="modern-color-picker h-[300px] w-[220px] rounded-[4px] bg-editor-primary px-[10px] pb-0 pt-[10px]"
      data-color-picker-component="modern"
      data-color-picker-mode="swatches"
    >
      {renderHeader()}
      <div className="mt-[6px] flex flex-row flex-wrap gap-[4px]">
        {SWATCH_COLUMNS.map((column, columnIndex) => (
          <div
            key={`modern-swatch-column-${columnIndex}`}
            className="flex flex-col overflow-hidden rounded-[2px]"
          >
            {column.map((hex, rowIndex) => {
              const selected = tinycolor(hex).toHexString() === normalizedCurrentHex;
              return (
                <button
                  key={`modern-swatch-${columnIndex}-${rowIndex}`}
                  type="button"
                  className="h-[20px] w-[30px] border border-transparent p-0"
                  style={{
                    backgroundColor: hex,
                    borderColor: selected ? "#ffffff" : "transparent",
                    boxShadow: selected ? "inset 0 0 0 1px rgba(0,0,0,0.45)" : "none",
                  }}
                  aria-label={`Set color ${hex}`}
                  data-color-hex={hex}
                  onClick={() => emitColor(hex)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpectrumSwatches = (colors: string[], keyPrefix: string): JSX.Element => (
    <div className="mt-[6px] flex flex-row flex-wrap border-t border-black/10 pt-[6px]">
      {colors.map((hex, index) => {
        const parsed = tinycolor(hex).toHexString();
        const selected = parsed === normalizedCurrentHex;
        return (
          <button
            key={`${keyPrefix}-${index}`}
            type="button"
            className="mb-[8px] mr-[8px] h-[16px] w-[16px] overflow-hidden rounded-[4px] border border-[#222] p-0"
            style={{
              ...CHECKERBOARD_STYLE,
              boxShadow: selected ? "0 0 0 1px #ffffff" : "none",
              backgroundColor: hex,
            }}
            aria-label={`Set color ${hex}`}
            data-color-hex={hex}
            onClick={() => emitColor(hex)}
          />
        );
      })}
    </div>
  );

  const renderSpectrum = (): JSX.Element => (
    <div
      className="modern-color-picker h-[300px] w-[220px] rounded-[4px] bg-editor-primary px-[10px] pb-0 pt-[10px]"
      data-color-picker-component="modern"
      data-color-picker-mode="spectrum"
    >
      {renderHeader()}
      <div className="relative mt-[5px] h-[115px] w-full overflow-hidden rounded-[2px]">
        <Saturation {...props} />
      </div>
      <div className="mt-[5px] flex w-full flex-row">
        <div className="mr-[5px] h-[25px] w-[25px]">
          <ActionButton
            icon="eyedropper"
            id="color-picker-eyedropper"
            tooltip="Eyedropper"
            color="tool"
            action={openEyedropper}
          />
        </div>
        <div>
          <div className="relative mb-[2.5%] h-[11px] w-[140px] bg-white">
            <Hue {...props} height={11} />
          </div>
          {!props.disableAlpha && (
            <div className="relative mb-[2.5%] h-[11px] w-[140px] bg-white">
              <Alpha {...props} />
            </div>
          )}
        </div>
        <div className="relative ml-[5px] h-[25px] w-[25px] rounded-[2px] bg-white">
          <div style={{ ...CHECKERBOARD_STYLE, position: "absolute", inset: 0 }} />
          <div style={{ position: "absolute", inset: 0, backgroundColor: currentColor }} />
        </div>
      </div>
      <SketchFields {...props} aria-label="color options" />
      {renderSpectrumSwatches(SPECTRUM_SWATCHES, "primary-swatch")}
      {renderSpectrumSwatches(lastColors, "recent-swatch")}
    </div>
  );

  if (props.colorPickerType === "spectrum") {
    return renderSpectrum();
  }
  return renderSwatches();
};

export default CustomPicker(ModernColorPicker);
