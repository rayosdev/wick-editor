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
import { MOBILE_INSPECTOR_INPUT_ELEMENT_CLASSES } from '../mobileInspectorRowClasses';

import WickInput from 'Editor/Util/WickInput/WickInput';
import WickInputV2LegacyAdapter from 'Editor/Util/WickInputV2/WickInputV2LegacyAdapter';

type WickInputProps = React.ComponentProps<typeof WickInput>;
type WickInputV2LegacyAdapterProps = React.ComponentProps<
  typeof WickInputV2LegacyAdapter
>;

const V2_SUPPORTED_TYPES = new Set<
  WickInputV2LegacyAdapterProps["type"] | undefined
>([
  undefined,
  "text",
  "numeric",
  "slider",
  "select",
  "checkbox",
  "color",
  "button",
]);

interface MobileInspectorInputProps {
  inputProps?: Partial<WickInputProps>;
  input?: Partial<WickInputProps>;
}

const MobileInspectorInput: React.FC<MobileInspectorInputProps> = ({ inputProps, input }) => {
  const mergedInputProps: Partial<WickInputProps> = { ...inputProps, ...input };
  if (V2_SUPPORTED_TYPES.has(mergedInputProps.type)) {
    return (
      <div className={MOBILE_INSPECTOR_INPUT_ELEMENT_CLASSES}>
        <WickInputV2LegacyAdapter
          {...(mergedInputProps as WickInputV2LegacyAdapterProps)}
        />
      </div>
    );
  }

  return (
    <div className={MOBILE_INSPECTOR_INPUT_ELEMENT_CLASSES}>
      <WickInput {...mergedInputProps} />
    </div>
  );
};

export default MobileInspectorInput;
