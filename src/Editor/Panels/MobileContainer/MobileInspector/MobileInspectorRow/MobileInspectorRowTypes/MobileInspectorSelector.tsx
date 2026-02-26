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
import WickInput from 'Editor/Util/WickInput/WickInput';
import {
  MOBILE_INSPECTOR_LARGE_INPUT_CONTAINER_CLASSES,
  MOBILE_INSPECTOR_ROW_CLASSES,
  MOBILE_INSPECTOR_ROW_IDENTIFIER_CLASSES,
} from '../mobileInspectorRowClasses';

type WickInputType = NonNullable<React.ComponentProps<typeof WickInput>["type"]>;

export type MobileInspectorSelectorOption = {
  value: unknown;
  label: string;
  className?: string;
  [key: string]: unknown;
};

interface MobileInspectorSelectorProps {
  tooltip: string;
  value: unknown;
  onChange: (value: MobileInspectorSelectorOption) => void;
  options: MobileInspectorSelectorOption[];
  className?: string;
  type?: WickInputType;
  isSearchable?: boolean;
}

const MobileInspectorSelector: React.FC<MobileInspectorSelectorProps> = ({
  tooltip,
  value,
  onChange,
  options,
  className,
  type,
  isSearchable
}) => {
  const idLabel = tooltip.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className={MOBILE_INSPECTOR_ROW_CLASSES}>
      {/* Identifier */}
      <label htmlFor={`${idLabel}-input-mobile`} className={MOBILE_INSPECTOR_ROW_IDENTIFIER_CLASSES}>
        {tooltip}
      </label>

      {/* Input */}
      <div className={MOBILE_INSPECTOR_LARGE_INPUT_CONTAINER_CLASSES}>
        <MobileInspectorInput
          inputProps={{ id: `${idLabel}-input-mobile` }}
          input={{
            type: type ?? "select",
            value: value,
            onChange: (selectedValue: unknown) => {
              const matchedOption =
                options.find((option) => Object.is(option.value, selectedValue)) ??
                options.find(
                  (option) => String(option.value) === String(selectedValue)
                ) ?? {
                  value: selectedValue,
                  label: String(selectedValue ?? ""),
                };
              onChange(matchedOption);
            },
            options: options,
            className: className,
            isSearchable: isSearchable,
          }}
        />
      </div>
    </div>
  );
};

export default MobileInspectorSelector;
