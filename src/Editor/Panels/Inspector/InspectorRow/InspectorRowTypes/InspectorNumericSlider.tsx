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

import React, { type InputHTMLAttributes } from 'react';

import InspectorInput from 'Editor/Panels/Inspector/InspectorRow/InspectorInput/InspectorInput';

interface InspectorNumericSliderProps {
  tooltip: string;
  val: number;
  onChange: (value: number) => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  divider?: boolean;
  id?: string;
}

const InspectorNumericSlider: React.FC<InspectorNumericSliderProps> = ({
  tooltip,
  val,
  onChange,
  inputProps
}) => {
  const idLabel = tooltip.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="inspector-row mb-[4px] flex min-h-[34px] w-full flex-row items-center last:mb-0">
      {/* Identifier */}
      <label
        htmlFor={`${idLabel}-input`}
        className="inspector-row-identifier mt-[3px] flex h-full w-[30%] max-w-[30%] flex-col overflow-hidden whitespace-nowrap px-[1.5%] text-right text-[14px] font-bold text-white first:pl-0"
      >
        {tooltip}
      </label>

      {/* Input */}
      <div className="inspector-small-input-container flex h-[90%] w-[20%] min-w-[30px] flex-col items-center pl-[1.5%] last:pr-0">
        <InspectorInput
          inputProps={{ id: `${idLabel}-input` }}
          input={{
            type: "numeric",
            value: val,
            onChange: onChange
          }}
        />
      </div>

      {/* Slider */}
      <div className="inspector-medium-input-container w-[calc(100%-30%-20%)] pl-[1.5%] pr-0">
        <InspectorInput
          inputProps={{
            ...(inputProps as React.ComponentProps<typeof InspectorInput>["inputProps"]),
            id: `${idLabel}-input`,
          }}
          input={{
            type: "slider",
            value: val,
            onChange: onChange
          }}
        />
      </div>
    </div>
  );
};

export default InspectorNumericSlider;
