import React, { useState } from "react";
import tinycolor from "tinycolor2";
import type { PickerColorChange, PickerColorValue } from "../ColorPicker";

interface WickSwatchProps {
  color: string;
  selectedColor: PickerColorValue;
  onChangeComplete: (color: PickerColorChange) => void;
}

/**
 * WickSwatch component - single color swatch in the color picker
 * Handles hover, focus, and selection states
 */
const WickSwatch: React.FC<WickSwatchProps> = ({
  color,
  selectedColor,
  onChangeComplete,
}) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const colorInfo = tinycolor(color);
  const selectedColorString =
    typeof selectedColor === "string"
      ? selectedColor
      : selectedColor.rgba ?? selectedColor.toString();
  const selectedColorInfo = tinycolor(selectedColorString);
  const contrastColor = colorInfo.isLight() ? "#333333" : "#CCCCCC";
  const selected = colorInfo.toHexString() === selectedColorInfo.toHexString();

  const dynamicStyle: React.CSSProperties = {};
  if (hovered || focused) {
    dynamicStyle.border = `2px solid ${contrastColor}`;
  }
  if (selected) {
    dynamicStyle.border = `3px solid ${contrastColor}`;
  }

  return (
    <button
      type="button"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="column-swatch first:mb-[2px] h-[20px] w-[30px] border border-transparent p-0"
      style={{
        ...dynamicStyle,
        backgroundColor: colorInfo.toHexString(),
      }}
      aria-label={`Set color ${colorInfo.toHexString()}`}
      onClick={() => {
        const rgb = colorInfo.toRgb();
        onChangeComplete({
          hex: colorInfo.toHexString(),
          rgb: {
            r: rgb.r,
            g: rgb.g,
            b: rgb.b,
            a: rgb.a,
          },
        } as PickerColorChange);
      }}
    />
  );
};

export default WickSwatch;
