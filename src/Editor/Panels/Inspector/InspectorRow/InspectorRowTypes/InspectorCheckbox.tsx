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

import InspectorInput from '../InspectorInput/InspectorInput';

interface InspectorCheckboxProps {
  tooltip: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const InspectorCheckbox: React.FC<InspectorCheckboxProps> = ({
  tooltip,
  checked,
  onChange
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

      {/* Checkbox */}
      <div className="inspector-small-input-container flex h-[90%] w-[20%] min-w-[30px] flex-col items-center pl-[1.5%] last:pr-0">
        <InspectorInput
          inputProps={{ id: `${idLabel}-input` }}
          input={{
            type: "checkbox",
            checked: checked,
            onChange: onChange
          }}
        />
      </div>
    </div>
  );
};

export default InspectorCheckbox;
