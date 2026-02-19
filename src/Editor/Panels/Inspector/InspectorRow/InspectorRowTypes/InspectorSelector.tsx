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

interface InspectorSelectorOption {
  value: unknown;
  label: string;
  [key: string]: unknown;
}

interface InspectorSelectorProps {
  tooltip: string;
  value: unknown;
  onChange: (option: InspectorSelectorOption) => void;
  options: InspectorSelectorOption[];
  className?: string;
  type?: string;
  isSearchable?: boolean;
}

const InspectorSelector: React.FC<InspectorSelectorProps> = ({
  tooltip,
  value,
  onChange,
  options,
  className
}) => {
  const idLabel = tooltip.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className="inspector-row mb-[4px] flex h-[26px] w-full flex-row last:mb-0">
      {/* Identifier */}
      <label
        htmlFor={`${idLabel}-input`}
        className="inspector-row-identifier mt-[3px] flex h-full w-[30%] max-w-[30%] flex-col overflow-hidden whitespace-nowrap px-[1.5%] text-right text-[14px] font-bold text-white first:pl-0"
      >
        {tooltip}
      </label>

      {/* Input */}
      <div className="inspector-large-input-container w-[calc(100%-30%)] pl-[1.5%] pr-0">
        <InspectorInput
          inputProps={{ id: `${idLabel}-input` }}
          input={{
            type: "select",
            value: value,
            onChange: onChange,
            options: options,
            className: className,
          }}
        />
      </div>
    </div>
  );
};

export default InspectorSelector;
