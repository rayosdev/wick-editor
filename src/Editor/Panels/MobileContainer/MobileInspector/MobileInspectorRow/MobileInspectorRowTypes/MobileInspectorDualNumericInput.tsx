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
import MobileInspectorInput from '../MobileInspectorInput/MobileInspectorInput';

import '../_mobileinspectorrow.scss';

interface MobileInspectorDualNumericInputProps {
  tooltip1: string;
  tooltip2: string;
  val1: number;
  val2: number;
  onChange1: (value: number) => void;
  onChange2: (value: number) => void;
  icon1?: string;
  icon2?: string;
  iconAlt1?: string;
  iconAlt2?: string;
  id?: string;
  id1?: string;
  id2?: string;
  divider?: boolean;
}

const MobileInspectorDualNumericInput: React.FC<MobileInspectorDualNumericInputProps> = ({ 
  tooltip1,
  tooltip2,
  val1,
  val2,
  onChange1,
  onChange2,
  icon1,
  icon2,
  iconAlt1,
  iconAlt2,
  id,
  id1,
  id2
}) => {
  const idLabel1 = tooltip1.replace(/\s+/g, '-').toLowerCase();
  const idLabel2 = tooltip2.replace(/\s+/g, '-').toLowerCase();
  const inputId1 = id1 ?? id ?? `${idLabel1}-input-mobile`;
  const inputId2 = id2 ?? id ?? `${idLabel2}-input-mobile`;

  const render1Identifier = icon1 ? (
    <img src={icon1} alt={iconAlt1} className="mobile-inspector-row-icon" />
  ) : (
    <label htmlFor={`${idLabel1}-input-mobile`} className="mobile-inspector-row-identifier">
      {tooltip1}
    </label>
  );
  
  const render2Identifier = icon2 ? (
    <img src={icon2} alt={iconAlt2} className="mobile-inspector-row-icon" />
  ) : (
    <label htmlFor={`${idLabel2}-input-mobile`} className="mobile-inspector-row-identifier">
      {tooltip2}
    </label>
  );

  return (
    <div className="mobile-inspector-row">
      {/* Identifier1 */}
      {render1Identifier}

      {/* Input1 */}
      <div className="mobile-inspector-small-input-container">
        <MobileInspectorInput
          inputProps={{ id: inputId1 }}
          input={{
            type: "numeric",
            value: val1,
            onChange: onChange1
          }}
        />
      </div>

      {/* Identifier2 */}
      {render2Identifier}

      {/* Input2 */}
      <div className="mobile-inspector-small-input-container">
        <MobileInspectorInput
          inputProps={{ id: inputId2 }}
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

export default MobileInspectorDualNumericInput;
