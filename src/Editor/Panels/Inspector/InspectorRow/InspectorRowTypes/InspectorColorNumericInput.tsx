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

import React from 'react';

import InspectorInput from 'Editor/Panels/Inspector/InspectorRow/InspectorInput/InspectorInput';

interface InspectorColorNumericInputProps {
  tooltip1: string;
  tooltip2: string;
  val1: string;
  val2: number;
  onChange1: (color: string) => void;
  onChange2: (value: number) => void;
  id: string;
  stroke?: boolean;
  colorPickerType?: string;
  changeColorPickerType?: (type: string) => void;
  updateLastColors?: (color: string) => void;
  lastColorsUsed?: string[];
  divider?: boolean;
}

const InspectorColorNumericInput: React.FC<InspectorColorNumericInputProps> = ({
  tooltip1,
  tooltip2,
  val1,
  val2,
  onChange1,
  onChange2,
  id,
  stroke,
  colorPickerType,
  changeColorPickerType,
  updateLastColors,
  lastColorsUsed
}) => {
  const idLabel1 = tooltip1.replace(/\s+/g, '-').toLowerCase();
  const idLabel2 = tooltip2.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="inspector-row mb-[4px] flex min-h-[34px] w-full flex-row items-center last:mb-0">
      {/* Identifier1 */}
      <label
        htmlFor={`${idLabel1}-input`}
        className="inspector-row-identifier mt-[3px] flex h-full w-[30%] max-w-[30%] flex-col overflow-hidden whitespace-nowrap px-[1.5%] text-right text-[14px] font-bold text-white first:pl-0"
      >
        {tooltip1}
      </label>

      {/* Input1 */}
      <div className="inspector-small-input-container flex h-[90%] w-[20%] min-w-[30px] flex-col items-center pl-[1.5%] last:pr-0">
        <InspectorInput
          inputProps={{ id: `${idLabel1}-input` }}
          input={{
            type: "color",
            color: val1,
            onChange: onChange1,
            id: id,
            stroke: !stroke ? false : stroke,
            placement: "left",
            colorPickerType: colorPickerType,
            changeColorPickerType: changeColorPickerType,
            updateLastColors: updateLastColors,
            lastColorsUsed: lastColorsUsed,
          }}
        />
      </div>

      {/* Identifier2 */}
      <label
        htmlFor={`${idLabel2}-${tooltip2}-input`}
        className="inspector-row-identifier mt-[3px] flex h-full w-[30%] max-w-[30%] flex-col overflow-hidden whitespace-nowrap px-[1.5%] text-right text-[14px] font-bold text-white first:pl-0"
      >
        {tooltip2}
      </label>

      {/* Input2 */}
      <div className="inspector-small-input-container flex h-[90%] w-[20%] min-w-[30px] flex-col items-center pl-[1.5%] last:pr-0">
        <InspectorInput
          inputProps={{ id: `${idLabel2}-${tooltip2}-input` }}
          input={{
            type: "numeric",
            value: val2,
            onChange: onChange2
          }}
        />
      </div>
    </div>
  );
};

export default InspectorColorNumericInput;
