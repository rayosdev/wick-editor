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

interface InspectorTextInputProps {
  tooltip: string;
  val: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  id?: string;
}

const InspectorTextInput: React.FC<InspectorTextInputProps> = ({ 
  tooltip,
  val,
  onChange,
  readOnly,
  placeholder,
  id
}) => {
  const idLabel = id || tooltip.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <div className="inspector-row">
      {/* Identifier */}
      <label htmlFor={`${idLabel}-input`} className="inspector-row-identifier">
        {tooltip}
      </label>

      {/* Input */}
      <div className="inspector-large-input-container">
        <InspectorInput
          inputProps={{ id: `${idLabel}-input` }}
          input={{
            type: "text",
            value: val,
            onChange: onChange,
            readOnly: readOnly,
            placeholder: placeholder,
          }}
        />
      </div>
    </div>
  );
};

export default InspectorTextInput;
