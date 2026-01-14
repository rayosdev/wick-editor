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

import '../_inspectorrow.scss';

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
    <div className="inspector-row">
      {/* Identifier */}
      <label htmlFor={`${idLabel}-input`} className="inspector-row-identifier">
        {tooltip}
      </label>

      {/* Input */}
      <div className="inspector-small-input-container">
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
      <div className="inspector-medium-input-container">
        <InspectorInput
          inputProps={{ ...inputProps, id: `${idLabel}-input` }}
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
