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
  MOBILE_INSPECTOR_ROW_CLASSES,
  MOBILE_INSPECTOR_ROW_IDENTIFIER_CLASSES,
  MOBILE_INSPECTOR_ROW_ICON_CLASSES,
  MOBILE_INSPECTOR_SMALL_INPUT_CONTAINER_CLASSES,
} from '../mobileInspectorRowClasses';

interface MobileInspectorNumericSliderProps {
  tooltip: string;
  val: number;
  onChange: (value: number) => void;
  icon?: string;
  iconAlt?: string;
  inputProps?: React.ComponentProps<typeof MobileInspectorInput>["inputProps"];
  id?: string;
  divider?: boolean;
}

const MobileInspectorNumericSlider: React.FC<MobileInspectorNumericSliderProps> = ({
  tooltip,
  val,
  onChange,
  icon,
  iconAlt,
  inputProps,
  id
}) => {
  const idLabel = tooltip.replace(/\s+/g, '-').toLowerCase();
  const inputId = id ?? `${idLabel}-input-mobile`;

  const renderIdentifier = icon ? (
    <img src={icon} alt={iconAlt} className={MOBILE_INSPECTOR_ROW_ICON_CLASSES} />
  ) : (
    <label htmlFor={`${idLabel}-input-mobile`} className={MOBILE_INSPECTOR_ROW_IDENTIFIER_CLASSES}>
      {tooltip}
    </label>
  );

  return (
    <div className={MOBILE_INSPECTOR_ROW_CLASSES}>
      {/* Identifier */}
      {renderIdentifier}

      {/* Input */}
      <div className={MOBILE_INSPECTOR_SMALL_INPUT_CONTAINER_CLASSES}>
        <MobileInspectorInput
          inputProps={{ id: inputId }}
          input={{
            type: "numeric",
            value: val,
            onChange: onChange
          }}
        />
      </div>

      {/* Slider */}
      <div className={MOBILE_INSPECTOR_SMALL_INPUT_CONTAINER_CLASSES}>
        <MobileInspectorInput
          inputProps={{ ...inputProps, id: inputId }}
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

export default MobileInspectorNumericSlider;
