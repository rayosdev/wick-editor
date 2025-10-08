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

import { Component } from "react";

import WickInput from "Editor/Util/WickInput/WickInput";
import SettingsNumericSlider from "./SettingsNumericSlider/SettingsNumericSlider";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "./_toolsettingsinput.scss";

import classNames from "classnames";

interface ToolSettingsInputProps {
  type: 'numeric' | 'checkbox' | 'dropdown';
  isMobile?: boolean;
  onChange: (value: any) => void;
  value: any;
  inputRestrictions?: any;
  name: string;
  icon?: string;
  renderSize?: string;
}

class ToolSettingsInput extends Component<ToolSettingsInputProps> {
  renderNumericInput = (): JSX.Element => {
    return (
      <SettingsNumericSlider
        isMobile={this.props.isMobile}
        onChange={this.props.onChange}
        value={this.props.value}
        inputRestrictions={this.props.inputRestrictions}
        icon={this.props.icon || ''}
      />
    );
  };

  renderCheckboxInput = (): JSX.Element => {
    return (
      <div className="settings-checkbox-input">
        <ActionButton
          icon={this.props.icon}
          isActive={() => this.props.value}
          color="checkbox"
          id={"settings-input-id-" + this.props.name}
          tooltip={this.props.name}
          action={() => this.props.onChange(!this.props.value)}
          iconClassName="toolbox-input-icon"
        />
      </div>
    );
  };

  renderDropdownInput = (): JSX.Element => {
    return (
      <WickInput
        type="select"
        className="settings-dropdown-input"
        onChange={this.props.onChange}
        value={this.props.value}
      />
    );
  };

  renderInput = (): JSX.Element | undefined => {
    if (this.props.type === "numeric") {
      return this.renderNumericInput();
    } else if (this.props.type === "checkbox") {
      return this.renderCheckboxInput();
    } else if (this.props.type === "dropdown") {
      return this.renderDropdownInput();
    } else {
      console.error("No valid 'type' prop provided.");
      return;
    }
  };

  render(): JSX.Element {
    return (
      <div
        className={classNames("setting-input-container", {
          mobile: this.props.renderSize === "small",
        })}
      >
        {this.renderInput()}
      </div>
    );
  }
}

export default ToolSettingsInput;
