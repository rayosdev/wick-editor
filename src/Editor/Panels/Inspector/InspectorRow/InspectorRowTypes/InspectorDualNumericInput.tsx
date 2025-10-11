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

//import InspectorRow from '../InspectorRow';
import InspectorInput from '../InspectorInput/InspectorInput';

import '../_inspectorrow.scss';

interface InspectorDualNumericInputProps {
  tooltip1: string;
  tooltip2: string;
  val1: number;
  val2: number;
  onChange1: (value: number) => void;
  onChange2: (value: number) => void;
  id?: string;
}

const InspectorDualNumericInput: React.FC<InspectorDualNumericInputProps> = ({ 
  tooltip1,
  tooltip2,
  val1,
  val2,
  onChange1,
  onChange2
}) => {
  const idLabel1 = tooltip1.replace(/\s+/g, '-').toLowerCase();
  const idLabel2 = tooltip2.replace(/\s+/g, '-').toLowerCase();
  
  return (
    <div className="inspector-row">
      {/* Identifier1 */}
      <label htmlFor={`${idLabel1}-input`} className="inspector-row-identifier">
        {tooltip1}
      </label>

      {/* Input1 */}
      <div className="inspector-small-input-container">
        <InspectorInput
          inputProps={{ id: `${idLabel1}-input` }}
          input={{
            type: "numeric",
            value: val1,
            onChange: onChange1
          }}
        />
      </div>

      {/* Identifier2 */}
      <label htmlFor={`${idLabel2}-input`} className="inspector-row-identifier">
        {tooltip2}
      </label>

      {/* Input2 */}
      <div className="inspector-small-input-container">
        <InspectorInput
          inputProps={{ id: `${idLabel2}-input` }}
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

export default InspectorDualNumericInput;
