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

import '../_inspectorrow.scss';

interface InspectorNumericInputProps {
  tooltip: string;
  val: number | string | null | undefined;
  onChange: (value: any) => void;
  id?: string;
  type?: string;
}

const InspectorNumericInput: React.FC<InspectorNumericInputProps> = ({ 
  tooltip,
  val,
  onChange,
  id,
  type
}) => {
  const idLabel = tooltip.replace(/\s+/g, '-').toLowerCase();
  const inputId = id ?? `${idLabel}-input`;
  
  return (
    <div className="inspector-row">
      {/* Identifier */}
      <label htmlFor={inputId} className="inspector-row-identifier">
        {tooltip}
      </label>

      {/* Input */}
      <div className="inspector-large-input-container">
        <InspectorInput
          inputProps={{ id: inputId }}
          input={{
            type: type ?? "numeric",
            value: val,
            onChange: onChange
          }}
        />
      </div>
    </div>
  );
};

export default InspectorNumericInput;
