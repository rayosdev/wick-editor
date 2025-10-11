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

import React from "react";

import WickInput, { type SelectOption } from "Editor/Util/WickInput/WickInput";
import SettingsNumericSlider from "./SettingsNumericSlider/SettingsNumericSlider";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "./_toolsettingsinput.scss";

import classNames from "classnames";

type RenderSize = "small" | "medium" | "large" | string;

type NumericInputProps = {
  type: "numeric";
  value: number;
  onChange: (value: number) => void;
  icon: string;
  inputRestrictions?: Record<string, unknown>;
};

type CheckboxInputProps = {
  type: "checkbox";
  value: boolean;
  onChange: (value: boolean) => void;
  icon?: string;
};

type DropdownInputProps = {
  type: "dropdown";
  value: string;
  onChange: (value: string) => void;
  icon?: string;
  options?: SelectOption[];
};

type ToolSettingsInputProps = (
  | NumericInputProps
  | CheckboxInputProps
  | DropdownInputProps
) & {
  isMobile?: boolean;
  name: string;
  renderSize?: RenderSize;
};

const ToolSettingsInput: React.FC<ToolSettingsInputProps> = (props) => {
  const renderNumericInput = (
    inputProps: NumericInputProps & { isMobile?: boolean }
  ): JSX.Element => {
    return (
      <SettingsNumericSlider
        isMobile={inputProps.isMobile}
        onChange={inputProps.onChange}
        value={inputProps.value}
        inputRestrictions={inputProps.inputRestrictions}
        icon={inputProps.icon}
      />
    );
  };

  const renderCheckboxInput = (
    inputProps: CheckboxInputProps & { name: string }
  ): JSX.Element => {
    return (
      <div className="settings-checkbox-input">
        <ActionButton
          icon={inputProps.icon}
          isActive={() => inputProps.value}
          color="checkbox"
          id={`settings-input-id-${inputProps.name}`}
          tooltip={inputProps.name}
          action={() => inputProps.onChange(!inputProps.value)}
          iconClassName="toolbox-input-icon"
        />
      </div>
    );
  };

  const renderDropdownInput = (
    inputProps: DropdownInputProps
  ): JSX.Element => {
    return (
      <WickInput
        type="select"
        className="settings-dropdown-input"
        onChange={inputProps.onChange}
        value={inputProps.value}
        options={inputProps.options}
      />
    );
  };

  const renderInput = (): JSX.Element | undefined => {
    if (props.type === "numeric") {
      return renderNumericInput(props);
    }

    if (props.type === "checkbox") {
      return renderCheckboxInput(props);
    }

    if (props.type === "dropdown") {
      return renderDropdownInput(props);
    }

    console.error("No valid 'type' prop provided.");
    return;
  };

  return (
    <div
      className={classNames("setting-input-container", {
        mobile: props.renderSize === "small",
      })}
    >
      {renderInput()}
    </div>
  );
};

export default ToolSettingsInput;
