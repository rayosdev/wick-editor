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

import React, { ReactNode, ChangeEvent, forwardRef } from "react";
import "./_wickinput.scss";

import Select from "react-select";
import "react-dropdown/style.css";

import ColorPicker from "Editor/Util/ColorPicker/ColorPicker";
import type {
  PickerColorChange,
  PickerColorValue,
} from "Editor/Util/ColorPicker/ColorPicker";
import ReactTooltip from "react-tooltip";
import WickButton from "./WickButton/WickButton";

import { Input } from "reactstrap";
import WickTextInput from "./WickTextInput/WickTextInput";
import { isMobile } from "react-device-detect";

import classNames from "classnames";

export interface SelectOption {
  label: string;
  value: unknown;
}

type WickInputDynamicValue = ReturnType<typeof JSON.parse>;

interface WickInputProps {
  type?:
    | "numeric"
    | "text"
    | "slider"
    | "select"
    | "color"
    | "checkbox"
    | "radio"
    | "button";
  className?: string;
  containerclassname?: string;
  tooltip?: string;
  tooltipID?: string;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
  value?: WickInputDynamicValue;
  onChange?: (value: WickInputDynamicValue) => void;
  readOnly?: boolean;
  min?: number;
  max?: number;
  options?: SelectOption[];
  color?: PickerColorValue;
  stroke?: boolean;
  placement?: React.ComponentProps<typeof ColorPicker>["placement"];
  colorPickerType?: string;
  changeColorPickerType?: (type: string) => void;
  disableAlpha?: boolean;
  lastColorsUsed?: string[];
  id?: string;
  name?: string;
  label?: string;
  children?: ReactNode;
  updateLastColors?: (color: string) => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  secondaryAction?: () => void;
  onClick?: (e?: React.SyntheticEvent) => void;
  onTouch?: (e?: React.SyntheticEvent) => void;
  [key: string]: WickInputDynamicValue; // For spread props
}

/**
 * WickInput - A versatile input component for the Wick Editor.
 * Supports numeric, text, slider, select, color, checkbox, radio, and button types.
 * @param props - Component props
 * @param ref - Optional ref forwarded to the component
 * @returns JSX.Element
 */
const WickInput = forwardRef<HTMLElement, WickInputProps>((props, _ref) => {
  const renderTooltip = (tooltipID: string): JSX.Element => {
    // Detect if on mobile to disable tooltips.

    return (
      <ReactTooltip
        disable={isMobile}
        id={tooltipID}
        type="info"
        place={
          props.tooltipPlace === undefined
            ? "bottom"
            : props.tooltipPlace
        }
        effect="solid"
        aria-haspopup="true"
        className="wick-tooltip"
      >
        <span>{props.tooltip}</span>
      </ReactTooltip>
    );
  };

  const renderNumeric = (): JSX.Element => {
    const { min, max, ...rest } = props;

    const isValid = (input: string | number): boolean => {
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
    const cleanUp = (val: string): string => {
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
        value={props.value || ""}
        className={classNames(
          "wick-input",
          "numeric",
          { "read-only": props.readOnly },
          props.className
        )}
        cleanUp={cleanUp}
        isValid={isValid}
      />
    );
  };

  const renderText = (): JSX.Element => {
    return (
      <WickTextInput
        {...props}
        className={classNames(
          "wick-input",
          { "read-only": props.readOnly },
          props.className
        )}
        value={props.value ? props.value : ""}
      />
    );
  };

  const renderSlider = (): JSX.Element => {
    // Spit out the value of a text box back to the onChange function.
    const wrappedOnChange = (val: ChangeEvent<HTMLInputElement>): void => {
      props.onChange?.(parseFloat(val.target.value));
    };
    return (
      <input
        {...props}
        className={classNames("wick-slider", props.className)}
        type="range"
        onChange={props.onChange ? wrappedOnChange : undefined}
      />
    );
  };

  const renderColor = (): JSX.Element => {
    const wrappedOnChange = (color: PickerColorChange): void => {
      let newColor: string | PickerColorChange = color;

      // TODO: Check if we can just use HEX here.
      if (color.rgb) {
        const rgb = color.rgb;
        const str = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        newColor = str;
      }

      props.updateLastColors && props.updateLastColors(
        typeof newColor === "string" ? newColor : String(newColor)
      );
      props.onChange && props.onChange(newColor);
    };

    return (
      <ColorPicker
        id={props.id || "color-picker"}
        className={classNames("wick-color-picker", props.className)}
        color={props.color}
        stroke={props.stroke}
        placement={props.placement}
        colorPickerType={props.colorPickerType}
        changeColorPickerType={props.changeColorPickerType}
        disableAlpha={props.disableAlpha}
        lastColorsUsed={props.lastColorsUsed}
        onChangeComplete={props.onChange ? wrappedOnChange : undefined}
      />
    );
  };

  const renderSelect = (): JSX.Element => {
    let value = props.options?.find(
      (obj: SelectOption) => obj.value === props.value
    );

    if (value === undefined) {
      value = {
        label: String(props.value ?? ""),
        value: props.value,
      };
    }

    return (
      <Select
        inputId={props.id}
        onChange={props.onChange}
        defaultValue={value}
        options={props.options}
        className={classNames("wick-input-select", props.className)}
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
            if (props.className === "font-family") {
              style.fontFamily = state.label;
            }
            return style;
          },
          control: () => {
            return {};
          },
        }}
        isSearchable={false}
      />
    );
  };

  const renderCheckbox = (): JSX.Element => {
    return (
      <div className="wick-checkbox-container">
        {props.label && (
          <label htmlFor={props.label} className="wick-checkbox-label">
            {props.label}
          </label>
        )}
        <input
          id={props.label}
          className="wick-checkbox"
          {...props}
          type="checkbox"
        />
      </div>
    );
  };

  const renderRadio = (): JSX.Element => {
    if (!props.name)
      throw new Error("WickInput radio buttons require a name.");

    const {
      type,
      containerclassname,
      tooltip,
      tooltipID,
      tooltipPlace,
      updateLastColors,
      buttonProps,
      secondaryAction,
      onTouch,
      onChange,
      ...radioProps
    } = props;

    return (
      <Input
        type="radio"
        {...(radioProps as unknown as React.ComponentProps<typeof Input>)}
        onChange={
          onChange
            ? (event: React.ChangeEvent<HTMLInputElement>) => {
                onChange(event.target.value);
              }
            : undefined
        }
        className={classNames("wick-radio", props.className)}
      />
    );
  };

  const renderButton = (): JSX.Element => {
    return (
      <WickButton
        onClick={props.onClick ? () => props.onClick?.() : undefined}
        secondaryAction={props.secondaryAction}
        className={props.className}
        buttonProps={props.buttonProps}
      >
        {props.children}
      </WickButton>
    );
  };

  const renderContent = (): ReactNode => {
    if (props.type === "numeric") {
      return renderNumeric();
    } else if (props.type === "text") {
      return renderText();
    } else if (props.type === "slider") {
      return renderSlider();
    } else if (props.type === "select") {
      return renderSelect();
    } else if (props.type === "color") {
      return renderColor();
    } else if (props.type === "checkbox") {
      return renderCheckbox();
    } else if (props.type === "radio") {
      return renderRadio();
    } else if (props.type === "button") {
      return renderButton();
    } else {
      return renderButton(); // default to a button.
    }
  };

  const tooltipID =
    props.tooltipID === undefined
      ? "action-button-tooltip-nyi"
      : props.tooltipID;

  if (props.tooltip && !isMobile) {
    return (
      <div
        data-tip
        data-for={tooltipID}
        id={tooltipID}
        className={classNames(
          "wick-input-container",
          props.containerclassname
        )}
      >
        {renderTooltip(tooltipID)}
        {renderContent()}
      </div>
    );
  } else {
    return renderContent();
  }
});

WickInput.displayName = 'WickInput';

export default WickInput;
