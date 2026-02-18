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

import { useState } from 'react';
import { Popover } from 'reactstrap';
import WickColorPicker  from 'Editor/Util/ColorPicker/WickColorPicker';
import classNames from "classnames";

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
  colorPickerType?: string;
  changeColorPickerType?: (type: string) => void;
  disableAlpha?: boolean;
  onChangeComplete?: (color: PickerColorChange) => void;
  lastColorsUsed?: string[];
}

/**
 * ColorPicker - A button component that opens a Popover containing a color picker.
 * @param props - Component props
 * @returns JSX.Element
 */
export default function ColorPicker (props: ColorPickerProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  let color = props.color ? props.color : new window.Wick.Color("#FFFFFF")
  const colorString = typeof color === "string" ? color : color.rgba ?? color.toString();
  let itemID = props.id;
  let popoverID = itemID+'-popover';

  function toggle (): void {
    if (!open) {
      setTimeout(selectPopover, 200);
    }

    setOpen(!open)
  }

  function selectPopover (): void {
    let ele = document.getElementById(popoverID);
    if (ele) {
      ele.focus();
    }
  }

  return (
      <button
        className={classNames(
          "btn-color-picker !box-border flex !h-full !w-full !rounded-[16px] !border-4 !border-editor-text-secondary",
          props.className
        )}
        aria-label="color picker button"
        id={itemID}
        onClick={toggle}
        style={props.stroke ? {borderColor: colorString} : {backgroundColor: colorString}}
        >
          <Popover
            tabIndex={-1}
            id={popoverID}
            placement={props.placement}
            isOpen={open}
            toggle={toggle}
            target={itemID}
            boundariesElement="clippingParents"
            fade={false}
            transition={{ timeout: 150 }}>
            <WickColorPicker
              toggle={toggle}
              colorPickerType={props.colorPickerType}
              changeColorPickerType={props.changeColorPickerType}
              disableAlpha={props.disableAlpha}
              color={color}
              onChangeComplete={props.onChangeComplete}
              lastColorsUsed={props.lastColorsUsed}
            />
          </Popover>
      </button>
  )
}
