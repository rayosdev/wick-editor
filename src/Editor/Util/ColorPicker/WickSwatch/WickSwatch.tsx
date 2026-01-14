import React, { useState } from "react";
import tinycolor from "tinycolor2";
import { Swatch } from "react-color/lib/components/common";

interface WickSwatchProps {
  color: string;
  selectedColor: string;
  onChangeComplete: (color: any) => void;
}

/**
 * WickSwatch component - single color swatch in the color picker
 * Handles hover, focus, and selection states
 */
const WickSwatch: React.FC<WickSwatchProps> = ({ color, selectedColor, onChangeComplete }) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const colorInfo = tinycolor(color);
  const selectedColorInfo = tinycolor(selectedColor);
  let contrastColor = "#CCCCCC";

  const selected = color === `#${selectedColorInfo.toHex()}`; // TODO clean this check.

  if (colorInfo.isLight()) {
    contrastColor = "#333333";
  }

  const selectedStyle: React.CSSProperties = {
    border: `3px solid${contrastColor}`,
  };

  let style: React.CSSProperties = {};
  if (hovered || focused) {
    style.border = `2px solid ${contrastColor}`;
  }
  if (selected) {
    style = selectedStyle;
  }

  return (
    <div
      onFocus={() => {
        setFocused(true);
      }}
      onBlur={() => {
        setFocused(false);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="column-swatch"
      style={style}
    >
      <Swatch
        color={color}
        onClick={(swatchColor: any) => {
          onChangeComplete(swatchColor);
        }}
      />
    </div>
  );
};

export default WickSwatch;
