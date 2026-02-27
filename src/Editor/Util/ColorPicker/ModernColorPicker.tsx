import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import tinycolor from "tinycolor2";
import type { PickerColorChange, PickerColorValue } from "./ColorPicker";
import { activateEditorEyedropper } from "./editorEyedropperBridge";
import {
  clamp,
  hsvaToHex,
  hsvaToPickerColor,
  hsvaToRgb,
  hsvaToRgbaString,
  parseHexToPickerColor,
  toHsva,
  type HSVAColor,
} from "./colorMath";

import ActionButton from "Editor/Util/ActionButton/ActionButton";

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

const buildHueGradient = (): string =>
  "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";

const ModernColorPicker: React.FC<ModernColorPickerProps> = (props) => {
  const [hsva, setHsva] = useState<HSVAColor>(() => toHsva(props.color));
  const [hexInput, setHexInput] = useState<string>(() => hsvaToHex(toHsva(props.color)));

  useEffect(() => {
    const next = toHsva(props.color);
    setHsva(next);
    setHexInput(hsvaToHex(next));
  }, [props.color]);

  const emitHsva = useCallback(
    (nextHsva: HSVAColor): void => {
      const normalized: HSVAColor = {
        h: ((nextHsva.h % 360) + 360) % 360,
        s: clamp(nextHsva.s, 0, 1),
        v: clamp(nextHsva.v, 0, 1),
        a: clamp(nextHsva.a, 0, 1),
      };
      setHsva(normalized);
      setHexInput(hsvaToHex(normalized));
      props.onChangeComplete(hsvaToPickerColor(normalized));
    },
    [props],
  );

  const currentRgb = useMemo(() => hsvaToRgb(hsva), [hsva]);
  const currentHex = useMemo(() => hsvaToHex(hsva), [hsva]);
  const currentRgbaColor = useMemo(() => hsvaToRgbaString(hsva), [hsva]);
  const hueBaseColor = useMemo(
    () => tinycolor({ h: hsva.h, s: 1, v: 1 }).toHexString(),
    [hsva.h],
  );

  const openEyedropper = (): void => {
    activateEditorEyedropper(props.onChange ?? props.onChangeComplete);
  };

  const applySaturationFromPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): void => {
      const rect = event.currentTarget.getBoundingClientRect();
      const ratioX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const ratioY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      emitHsva({
        ...hsva,
        s: ratioX,
        v: 1 - ratioY,
      });
    },
    [emitHsva, hsva],
  );

  const startSaturationDrag = (event: React.PointerEvent<HTMLDivElement>): void => {
    applySaturationFromPointer(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleHexCommit = (): void => {
    const parsed = tinycolor(hexInput);
    if (!parsed.isValid()) {
      setHexInput(currentHex);
      return;
    }

    props.onChangeComplete(parseHexToPickerColor(parsed.toHexString()));
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
              const selected = tinycolor(hex).toHexString() === currentHex;
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
                  onClick={() => {
                    props.onChangeComplete(parseHexToPickerColor(hex));
                  }}
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
        const selected = parsed === currentHex;
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
            onClick={() => {
              props.onChangeComplete(parseHexToPickerColor(hex));
            }}
          />
        );
      })}
    </div>
  );

  const renderChannelFields = (): JSX.Element => (
    <div className="mt-[6px] grid grid-cols-5 gap-[4px]">
      <input
        aria-label="hex color"
        value={hexInput}
        className="col-span-2 h-[24px] rounded-[3px] border border-black/30 bg-[#4f4f4f] px-[6px] text-[11px] text-white"
        onChange={(event) => setHexInput(event.target.value)}
        onBlur={handleHexCommit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleHexCommit();
          }
        }}
      />
      <input
        aria-label="red channel"
        type="number"
        min={0}
        max={255}
        value={currentRgb.r}
        className="h-[24px] rounded-[3px] border border-black/30 bg-[#4f4f4f] px-[4px] text-[11px] text-white"
        onChange={(event) =>
          emitHsva(
            toHsva(
              `rgba(${clamp(Number(event.target.value), 0, 255)},${currentRgb.g},${currentRgb.b},${currentRgb.a})`,
            ),
          )
        }
      />
      <input
        aria-label="green channel"
        type="number"
        min={0}
        max={255}
        value={currentRgb.g}
        className="h-[24px] rounded-[3px] border border-black/30 bg-[#4f4f4f] px-[4px] text-[11px] text-white"
        onChange={(event) =>
          emitHsva(
            toHsva(
              `rgba(${currentRgb.r},${clamp(Number(event.target.value), 0, 255)},${currentRgb.b},${currentRgb.a})`,
            ),
          )
        }
      />
      <input
        aria-label="blue channel"
        type="number"
        min={0}
        max={255}
        value={currentRgb.b}
        className="h-[24px] rounded-[3px] border border-black/30 bg-[#4f4f4f] px-[4px] text-[11px] text-white"
        onChange={(event) =>
          emitHsva(
            toHsva(
              `rgba(${currentRgb.r},${currentRgb.g},${clamp(Number(event.target.value), 0, 255)},${currentRgb.a})`,
            ),
          )
        }
      />
    </div>
  );

  const renderSpectrum = (): JSX.Element => {
    const saturationCursorX = hsva.s * 100;
    const saturationCursorY = (1 - hsva.v) * 100;

    return (
      <div
        className="modern-color-picker h-[300px] w-[220px] rounded-[4px] bg-editor-primary px-[10px] pb-0 pt-[10px]"
        data-color-picker-component="modern"
        data-color-picker-mode="spectrum"
      >
        {renderHeader()}
        <div
          className="relative mt-[5px] h-[115px] w-full cursor-crosshair overflow-hidden rounded-[2px]"
          style={{ backgroundColor: hueBaseColor }}
          onPointerDown={startSaturationDrag}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              applySaturationFromPointer(event);
            }
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, #ffffff, rgba(255,255,255,0))" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #000000, rgba(0,0,0,0))" }}
          />
          <div
            className="pointer-events-none absolute h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6)]"
            style={{
              left: `${saturationCursorX}%`,
              top: `${saturationCursorY}%`,
            }}
          />
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
          <div className="w-[140px]">
            <div className="relative mb-[5px] h-[11px] w-full overflow-hidden rounded-[2px]">
              <div className="absolute inset-0" style={{ background: buildHueGradient() }} />
              <input
                aria-label="hue slider"
                type="range"
                min={0}
                max={360}
                value={hsva.h}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-[13px] [&::-webkit-slider-thumb]:w-[4px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-[1px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.7)] [&::-moz-range-thumb]:h-[13px] [&::-moz-range-thumb]:w-[4px] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-[1px] [&::-moz-range-thumb]:bg-white"
                onChange={(event) => emitHsva({ ...hsva, h: Number(event.target.value) })}
              />
            </div>
            {!props.disableAlpha && (
              <div className="relative h-[11px] w-full overflow-hidden rounded-[2px]" style={CHECKERBOARD_STYLE}>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to right, rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},0), rgba(${currentRgb.r},${currentRgb.g},${currentRgb.b},1))`,
                  }}
                />
                <input
                  aria-label="alpha slider"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(hsva.a * 100)}
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-[13px] [&::-webkit-slider-thumb]:w-[4px] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-[1px] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,0.7)] [&::-moz-range-thumb]:h-[13px] [&::-moz-range-thumb]:w-[4px] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-[1px] [&::-moz-range-thumb]:bg-white"
                  onChange={(event) =>
                    emitHsva({ ...hsva, a: clamp(Number(event.target.value) / 100, 0, 1) })
                  }
                />
              </div>
            )}
          </div>
          <div className="relative ml-[5px] h-[25px] w-[25px] overflow-hidden rounded-[2px] bg-white">
            <div style={{ ...CHECKERBOARD_STYLE, position: "absolute", inset: 0 }} />
            <div style={{ position: "absolute", inset: 0, backgroundColor: currentRgbaColor }} />
          </div>
        </div>
        {renderChannelFields()}
        {renderSpectrumSwatches(SPECTRUM_SWATCHES, "primary-swatch")}
        {renderSpectrumSwatches(props.lastColorsUsed ?? Array.from({ length: 8 }, () => "#000000"), "recent-swatch")}
      </div>
    );
  };

  if (props.colorPickerType === "spectrum") {
    return renderSpectrum();
  }

  return renderSwatches();
};

export default ModernColorPicker;
