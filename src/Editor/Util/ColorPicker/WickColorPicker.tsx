import React, { CSSProperties } from "react";
import type { PickerColorChange, PickerColorValue } from "./ColorPicker";

import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "./wickcolorpicker-legacy.css";
import { CustomPicker } from "react-color";
import WickSwatch from "Editor/Util/ColorPicker/WickSwatch/WickSwatch";
import {
  Saturation,
  Hue,
  Alpha,
  Checkboard,
  Swatch,
} from "react-color/lib/components/common";
import { SketchFields } from "react-color/lib/components/sketch/SketchFields";

interface WickColorPickerProps {
  color: PickerColorValue;
  colorPickerType?: string;
  changeColorPickerType?: (type: string) => void;
  disableAlpha?: boolean;
  onChangeComplete: (color: PickerColorChange) => void;
  onChange?: (color: PickerColorChange) => void;
  lastColorsUsed?: string[];
  toggle: () => void;
}

/**
 * WickColorPicker - A color picker component with swatches and spectrum modes.
 * @param props - Component props
 * @returns JSX.Element
 */
const WickColorPicker: React.FC<WickColorPickerProps> = (props) => {
  const checkerboardTileStyle: CSSProperties = {
    backgroundImage:
      'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==")',
    backgroundSize: "15px 15px",
  };

  const currentColor =
    typeof props.color === "string"
      ? props.color
      : props.color.rgba ?? props.color.toString();

  const renderSwatchColumn = (colorList: string[], i: number): JSX.Element => {
    return (
      <div
        key={`swatch-color-column-${i}`}
        className="wick-swatch-picker-column mb-[4px] mr-[4px] flex flex-col overflow-hidden rounded-[2px]"
      >
        {colorList.map((color, i) => {
          return (
              <WickSwatch
                color={color}
                onChangeComplete={props.onChangeComplete}
                selectedColor={currentColor}
                key={`swatch-color-${color}-${i}`}
              />
          );
        })}
      </div>
    );
  };

  const renderSwatchbook = (colors: string[][]): JSX.Element => {
    return (
      <div className="wick-swatch-picker-book -mx-[10px] my-[5px] flex flex-row flex-wrap pb-0 pl-[10px] pr-0 pt-[5px]">
        {colors.map((colorList, i) => {
          return renderSwatchColumn(colorList, i);
        })}
      </div>
    );
  };

  const renderSwatches = (): JSX.Element => {
    let colors: string[][] = [
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

    return (
      <div className="wick-color-picker h-[300px] w-[220px] rounded-[4px] bg-editor-primary px-[10px] pb-0 pt-[10px]">
        {renderHeader()}
        <div className="wick-swatch-color-picker-body flex flex-col">
          {renderSwatchbook(colors)}
        </div>
      </div>
    );
  };

  const renderHeader = (): JSX.Element => {
    return (
      <div className="wick-color-picker-header flex h-[25px]">
        <div className="wick-color-picker-action-button mr-[4px] h-[25px] w-[30px]">
          <ActionButton
            color="tool"
            id="color-picker-swatches-button"
            tooltip="Swatches"
            action={() => {
              props.changeColorPickerType?.("swatches");
            }}
            isActive={() => props.colorPickerType === "swatches"}
            icon="swatches"
          />
        </div>
        <div className="wick-color-picker-action-button spacer mr-auto h-[25px] w-[30px]">
          <ActionButton
            color="tool"
            id="color-picker-spectrum-button"
            tooltip="Spectrum"
            action={() => {
              props.changeColorPickerType?.("spectrum");
            }}
            isActive={() => props.colorPickerType === "spectrum"}
            icon="spectrum"
          />
        </div>
        <div className="color-picker-control-div flex flex-row">
          <div id="btn-color-picker-close" className="ml-auto h-[25px] w-[25px]">
            <ActionButton
              color="tool"
              icon="closemodal"
              action={props.toggle}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderSwatchContainer = (colors: string[]): JSX.Element => {
    return (
      <div className="wick-color-picker-swatches-container -mx-[10px] my-[5px] flex h-[25px] flex-wrap border-t border-solid border-black/10 pb-0 pl-[10px] pr-0 pt-[5px]">
        {colors.map((color, i) => {
          return (
            <div
              key={`color-swatch-${color}-${i}`}
              className="wick-color-picker-small-swatch mb-[10px] mr-[10px] h-[16px] min-w-[16px] w-[16px] overflow-hidden rounded-[4px] border-[1px] border-solid border-[#222]"
              style={checkerboardTileStyle}
            >
              <Swatch
                color={color}
                style={{
                  default: {},
                  ":focus": { outline: "2px solid white" },
                }}
                onClick={(color: unknown) => {
                  if (typeof color === "object" && color !== null && "rgb" in color) {
                    props.onChangeComplete(color as PickerColorChange);
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const openEyedropper = (): void => {
    window.editor.setActiveTool("eyedropper");
    window.editor._onEyedropperPickedColor = props.onChange;
  };

  const renderSpectrum = (): JSX.Element => {
    let styles: { activeColor: CSSProperties } = {
      activeColor: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: currentColor,
      },
    };

    let colors: string[] = [
      "#D0021B",
      "#F8E71C",
      "#7ED321",
      "#4A90E2",
      "#000000",
      "#4A4A4A",
      "#FFFFFF",
      "#FFFFFF00",
    ];
    let lastUsedColorsDefaults: string[] = [
      "#000000",
      "#000000",
      "#000000",
      "#000000",
      "#000000",
      "#000000",
      "#000000",
      "#000000",
    ];
    let lastColors = props.lastColorsUsed || lastUsedColorsDefaults;
    return (
      <div className="wick-color-picker h-[300px] w-[220px] rounded-[4px] bg-editor-primary px-[10px] pb-0 pt-[10px]">
        {renderHeader()}
        <div className="wick-color-picker-saturation relative mt-[5px] h-[115px] w-full overflow-hidden rounded-[2px]">
          <Saturation {...props} />
        </div>
        <div className="wick-color-picker-control-body mt-[5px] flex w-full flex-row">
          <div id="btn-color-picker-dropper" className="mr-[5px] h-[25px] w-[25px]">
            <ActionButton
              icon="eyedropper"
              id="color-picker-eyedropper"
              tooltip="Eyedropper"
              color="tool"
              action={openEyedropper}
            />
          </div>
          <div id="wick-color-picker-bar-container">
            <div className="wick-color-picker-control-bar relative mb-[2.5%] h-[45%] w-[140px] bg-white">
              <Hue {...props} height={11} />
            </div>
            <div className="wick-color-picker-control-bar relative mb-[2.5%] h-[45%] w-[140px] bg-white">
              <Alpha {...props} />
            </div>
          </div>
          <div className="wick-color-picker-color-block-container relative ml-[5px] h-[25px] w-[25px] rounded-[2px] bg-white">
            <Checkboard />
            <div style={styles.activeColor} />
          </div>
        </div>
        <SketchFields {...props} aria-label="color options" />
        {renderSwatchContainer(colors)}
        {renderSwatchContainer(lastColors)}
      </div>
    );
  };

  if (
    props.colorPickerType === "swatches" ||
    !props.colorPickerType
  ) {
    return renderSwatches();
  } else if (props.colorPickerType === "spectrum") {
    return renderSpectrum();
  }

  return undefined;
};

export default CustomPicker(WickColorPicker);
