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

import MobileInspectorInput from '../MobileInspectorInput/MobileInspectorInput';
import {
  MOBILE_INSPECTOR_LARGE_INPUT_CONTAINER_CLASSES,
  MOBILE_INSPECTOR_ROW_CLASSES,
  MOBILE_INSPECTOR_ROW_IDENTIFIER_CLASSES,
} from '../mobileInspectorRowClasses';

interface MobileInspectorTextInputProps {
  tooltip: string;
  val: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  id?: string;
  divider?: boolean;
}

const MobileInspectorTextInput: React.FC<MobileInspectorTextInputProps> = ({
  tooltip,
  val,
  onChange,
  readOnly,
  placeholder,
  id
}) => {
  const idLabel = tooltip.replace(/\s+/g, '-').toLowerCase();
  const inputId = id ?? `${idLabel}-input-mobile`;
  const handleChange = onChange ?? (() => { });

  return (
    <div className={MOBILE_INSPECTOR_ROW_CLASSES}>
      {/* Identifier */}
      <label htmlFor={`${idLabel}-input-mobile`} className={MOBILE_INSPECTOR_ROW_IDENTIFIER_CLASSES}>
        {tooltip}
      </label>

      {/* Input */}
      <div className={MOBILE_INSPECTOR_LARGE_INPUT_CONTAINER_CLASSES}>
        <MobileInspectorInput
          inputProps={{ id: inputId }}
          input={{
            type: "text",
            value: val,
            onChange: handleChange,
            readOnly: readOnly,
            placeholder: placeholder,
          }}
        />
      </div>
    </div>
  );
};

export default MobileInspectorTextInput;
