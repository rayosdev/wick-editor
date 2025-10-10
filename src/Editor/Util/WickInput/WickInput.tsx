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

import { Component, ReactNode, ChangeEvent } from "react";
import "./_wickinput.scss";

import Select from "react-select";
import "react-dropdown/style.css";

import ColorPicker from "Editor/Util/ColorPicker/ColorPicker";
import ReactTooltip from "react-tooltip";
import WickButton from "./WickButton/WickButton";

import { Input } from "reactstrap";
import WickTextInput from "./WickTextInput/WickTextInput";
import { isMobile } from "react-device-detect";

import classNames from "classnames";

export interface SelectOption {
  label: string;
  value: any;
}

interface WickInputProps {
  type?: 'numeric' | 'text' | 'slider' | 'select' | 'color' | 'checkbox' | 'radio' | 'button';
  className?: string;
  containerclassname?: string;
  tooltip?: string;
  tooltipID?: string;
  tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
  value?: any;
  onChange?: (value: any) => void;
  readOnly?: boolean;
  min?: number;
  max?: number;
  options?: SelectOption[];
  id?: string;
  name?: string;
  label?: string;
  children?: ReactNode;
  updateLastColors?: (color: string) => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  secondaryAction?: () => void;
  onClick?: (e?: any) => void;
  onTouch?: (e?: any) => void;
  [key: string]: any; // For spread props
}

/**
 * WickInput - A versatile input component for the Wick Editor.
 * Supports numeric, text, slider, select, color, checkbox, radio, and button types.
 * @param props - Component props
 * @returns JSX.Element
 */
class WickInput extends Component<WickInputProps> {
  render(): JSX.Element | ReactNode {
    let tooltipID =
      this.props.tooltipID === undefined
        ? "action-button-tooltip-nyi"
        : this.props.tooltipID;

    if (this.props.tooltip && !isMobile) {
      return (
        <div
          data-tip
          data-for={tooltipID}
          id={tooltipID}
          className={classNames(
            "wick-input-container",
            this.props.containerclassname
          )}
        >
          {this.renderTooltip(tooltipID)}
          {this.renderContent()}
        </div>
      );
    } else {
      return this.renderContent();
    }
  }

  renderTooltip = (tooltipID: string): JSX.Element => {
    // Detect if on mobile to disable tooltips.

    return (
      <ReactTooltip
        disable={isMobile}
        id={tooltipID}
        type="info"
        place={
          this.props.tooltipPlace === undefined
            ? "bottom"
            : this.props.tooltipPlace
        }
        effect="solid"
        aria-haspopup="true"
        className="wick-tooltip"
      >
        <span>{this.props.tooltip}</span>
      </ReactTooltip>
    );
  };

  renderContent = (): ReactNode => {
    if (this.props.type === "numeric") {
      return this.renderNumeric();
    } else if (this.props.type === "text") {
      return this.renderText();
    } else if (this.props.type === "slider") {
      return this.renderSlider();
    } else if (this.props.type === "select") {
      return this.renderSelect();
    } else if (this.props.type === "color") {
      return this.renderColor();
    } else if (this.props.type === "checkbox") {
      return this.renderCheckbox();
    } else if (this.props.type === "radio") {
      return this.renderRadio();
    } else if (this.props.type === "button") {
      return this.renderButton();
    } else {
      return this.renderButton(); // default to a button.
    }
  };

  renderNumeric = (): JSX.Element => {
    let { min, max, ...rest } = this.props;

    let isValid = (input: string | number): boolean => {
      let validNumber = !isNaN(Number(input)) && input !== "";

      if (typeof input === "string") {
        validNumber = validNumber && !input.endsWith(".");
      }

      return validNumber;
    };

    // Used to clean up the number prior to display and updates.

    /**
     * Takes in a string and converts that string into a displayable value
     * and converts that value to a number, with proper padding and styling. Value may not be valid,
     * in which case the same value will be returned.
     * @param val - String to "Clean Up"
     * @returns Returns cleaned up number if valid string representation is passed in, string otherwise.
     */
    let cleanUp = (val: string): string => {
      if (!isValid(val)) return val;

      let numVal = parseFloat(val);
      // Constrain between min and max
      if (min !== undefined) {
        numVal = Math.max(numVal, min);
      }

      if (max !== undefined) {
        numVal = Math.min(numVal, max);
      }

      return (Math.round(numVal * 1000) / 1000).toString();
    };

    return (
      <WickTextInput
        {...rest}
        value={this.props.value || ""}
        className={classNames(
          "wick-input",
          "numeric",
          { "read-only": this.props.readOnly },
          this.props.className
        )}
        cleanUp={cleanUp}
        isValid={isValid}
      />
    );
  };

  renderText = (): JSX.Element => {
    return (
      <WickTextInput
        {...this.props}
        className={classNames(
          "wick-input",
          { "read-only": this.props.readOnly },
          this.props.className
        )}
        value={this.props.value ? this.props.value : ""}
      />
    );
  };

  renderSlider = (): JSX.Element => {
    // Spit out the value of a text box back to the onChange function.
    let wrappedOnChange = (val: ChangeEvent<HTMLInputElement>): void => {
      this.props.onChange?.(parseFloat(val.target.value));
    };
    return (
      <input
        {...this.props}
        className={classNames("wick-slider", this.props.className)}
        type="range"
        onChange={this.props.onChange ? wrappedOnChange : undefined}
      />
    );
  };

  renderColor = (): JSX.Element => {
    let wrappedOnChange = (color: any): void => {
      let newColor = color;

      // TODO: Check if we can just use HEX here.
      if (color.rgb) {
        let rgb = color.rgb;
        let str =
          "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
        newColor = str;
      }

      this.props.updateLastColors && this.props.updateLastColors(newColor);
      this.props.onChange && this.props.onChange(newColor);
    };

    return (
      <ColorPicker
        id={this.props.id || "color-picker"}
        className={classNames("wick-color-picker", this.props.className)}
        {...(this.props as any)}
        onChangeComplete={this.props.onChange ? wrappedOnChange : undefined}
      />
    );
  };

  renderSelect = (): JSX.Element => {
    let value = this.props.options?.find(
      (obj) => obj.value === this.props.value
    );

    if (value === undefined) {
      value = {
        label: this.props.value,
        value: this.props.value,
      };
    }

    return (
      <Select
        inputId={this.props.id}
        onChange={this.props.onChange}
        defaultValue={value}
        options={this.props.options}
        className={classNames("wick-input-select", this.props.className)}
        classNamePrefix={"wick-input-select"}
        menuPortalTarget={document.body}
        menuPosition={"fixed"}
        styles={{
          option: (provided, state) => {
            let style = {
              ...provided,
              color: "black",
              fontSize: "16px",
              height: "26px",
              paddingTop: "0px",
              whiteSpace: "nowrap",
            };
            if (this.props.className === "font-family") {
              style.fontFamily = state.label;
            }
            return style;
          },
          control: (_provided: any, _state: any) => {
            return {};
          },
        }}
        isSearchable={false}
      />
    );
  };

  renderCheckbox = (): JSX.Element => {
    return (
      <div className="wick-checkbox-container">
        {this.props.label && (
          <label htmlFor={this.props.label} className="wick-checkbox-label">
            {this.props.label}
          </label>
        )}
        <input
          id={this.props.label}
          className="wick-checkbox"
          {...this.props}
          type="checkbox"
        />
      </div>
    );
  };

  renderRadio = (): JSX.Element => {
    if (!this.props.name)
      throw new Error("WickInput radio buttons require a name.");

    const { type, containerclassname, tooltip, tooltipID, tooltipPlace, updateLastColors, buttonProps, secondaryAction, onTouch, ...radioProps } = this.props;

    return (
      <Input
        type="radio"
        {...(radioProps as any)}
        className={classNames("wick-radio", this.props.className)}
      />
    );
  };

  renderButton = (): JSX.Element => {
    return <WickButton {...this.props as any}>{this.props.children}</WickButton>;
  };
}

export default WickInput;
