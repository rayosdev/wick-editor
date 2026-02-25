/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useRef, useState } from 'react';
import WickColorPicker  from 'Editor/Util/ColorPicker/WickColorPicker';
import classNames from "classnames";
import WickPopover from "Editor/Util/WickPopover/WickPopover";

export interface PickerColorRGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface PickerColorChange {
  rgb: PickerColorRGB;
  hex?: string;
  [key: string]: unknown;
}

export type PickerColorValue =
  | string
  | {
      rgba?: string;
      toString(): string;
    };

interface ColorPickerProps {
  id: string;
  className?: string;
  color?: PickerColorValue;
  stroke?: boolean;
  placement?: 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
  colorPickerType?: "swatches" | "spectrum" | string;
  changeColorPickerType?: (type: "swatches" | "spectrum") => void;
  disableAlpha?: boolean;
  onChangeComplete?: (color: PickerColorChange) => void;
  lastColorsUsed?: string[];
}

type WickPopoverPosition = "left" | "right" | "top" | "bottom";
type WickPopoverAlign = "start" | "center" | "end";

function mapPopoverPlacement(
  placement: ColorPickerProps["placement"]
): { positions: WickPopoverPosition[]; align: WickPopoverAlign } {
  if (!placement || placement === "auto") {
    return { positions: ["bottom", "right", "top", "left"], align: "center" };
  }

  const [positionRaw = "", alignRaw = ""] = placement.split("-");
  const position = ["top", "right", "bottom", "left"].includes(positionRaw)
    ? (positionRaw as WickPopoverPosition)
    : "bottom";
  const align = alignRaw === "start" || alignRaw === "end" ? alignRaw : "center";

  const fallbackOrder: WickPopoverPosition[] = ["bottom", "right", "top", "left"];
  const positions = [position, ...fallbackOrder.filter((item) => item !== position)];

  return { positions, align };
}

/**
 * ColorPicker - A button component that opens a Popover containing a color picker.
 * @param props - Component props
 * @returns JSX.Element
 */
export default function ColorPicker (props: ColorPickerProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const normalizedPickerType = props.colorPickerType === "spectrum" ? "spectrum" : "swatches";
  const handlePickerTypeChange = (type: string): void => {
    props.changeColorPickerType?.(type === "spectrum" ? "spectrum" : "swatches");
  };

  let color = props.color ? props.color : new window.Wick.Color("#FFFFFF")
  const colorString = typeof color === "string" ? color : color.rgba ?? color.toString();
  let itemID = props.id;
  let popoverID = itemID+'-popover';
  const placement = mapPopoverPlacement(props.placement);

  function toggle (): void {
    setOpen((prevOpen) => {
      if (!prevOpen) {
        setTimeout(selectPopover, 200);
      }

      return !prevOpen;
    });
  }

  function handleClickOutside (event: MouseEvent): void {
    const clickNode = event.target as Node | null;
    if (clickNode && buttonRef.current?.contains(clickNode)) {
      return;
    }

    if (open) {
      setOpen(false);
    }
  }

  function selectPopover (): void {
    let ele = document.getElementById(popoverID);
    if (ele) {
      ele.focus();
    }
  }

  return (
      <WickPopover
        isOpen={open}
        targetElement={buttonRef.current}
        positions={placement.positions}
        align={placement.align}
        onClickOutside={handleClickOutside}
        content={
          <div tabIndex={-1} id={popoverID} className="popover wick-color-picker-popover">
            <div className="popover-body">
              <WickColorPicker
                toggle={toggle}
                colorPickerType={normalizedPickerType}
                changeColorPickerType={handlePickerTypeChange}
                disableAlpha={props.disableAlpha}
                color={color}
                onChangeComplete={props.onChangeComplete}
                lastColorsUsed={props.lastColorsUsed}
              />
            </div>
          </div>
        }>
      <button
        ref={buttonRef}
        className={classNames(
          "btn-color-picker !box-border flex !h-full !w-full !rounded-[16px] !border-4 !border-editor-text-secondary",
          props.className
        )}
        aria-label="color picker button"
        id={itemID}
        onClick={toggle}
        style={props.stroke ? {borderColor: colorString} : {backgroundColor: colorString}}
        >
      </button>
      </WickPopover>
  )
}
