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

import '../_mobileinspectorrow.scss';

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
  type?: string;
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
    <div className="mobile-inspector-row">
      {/* Identifier */}
      <label htmlFor={`${idLabel}-input-mobile`} className="mobile-inspector-row-identifier">
        {tooltip}
      </label>

      {/* Input */}
      <div className="mobile-inspector-large-input-container">
        <MobileInspectorInput
          inputProps={{ id: `${idLabel}-input-mobile` }}
          input={{
            type: type ?? "select",
            value: value,
            onChange: onChange,
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
