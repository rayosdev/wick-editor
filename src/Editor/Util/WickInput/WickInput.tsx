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

import React, {
  ReactNode,
  ChangeEvent,
  forwardRef,
} from "react";
import "./wickinput.legacy.css";

import Select from "react-select";

import ColorPicker from "Editor/Util/ColorPicker/ColorPicker";
import type {
  PickerColorChange,
  PickerColorValue,
} from "Editor/Util/ColorPicker/ColorPicker";
import { Tooltip } from "react-tooltip";
import WickButton from "./WickButton/WickButton";

import WickTextInput from "./WickTextInput/WickTextInput";
import { isMobile } from "react-device-detect";

import classNames from "classnames";
import {
  TOOLTIP_HOVER_DELAY_MS,
  TOOLTIP_LONG_PRESS_MS,
} from "Editor/Util/WickInput/tooltipBehavior";

export interface SelectOption {
  label: string;
  value: unknown;
}

type WickInputDynamicValue = unknown;
type WickInputType =
  | "numeric"
  | "text"
  | "slider"
  | "select"
  | "color"
  | "checkbox"
  | "radio"
  | "button";
type WickInputChangeHandler = {
  bivarianceHack(value: WickInputDynamicValue): void;
}["bivarianceHack"];

type WickNativeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange" | "onClick" | "color"
>;

const INPUT_BASE_CLASSES = "wick-input h-full w-full border-0 bg-[#4F4F4F] text-white";
const INPUT_CHROME_CLASSES = "rounded-[5px] py-[2px] pl-1 pr-[2px]";
const INPUT_STATE_CLASSES =
  "[&.invalid]:!border-l-[3px] [&.invalid]:!border-l-[#F86868] [&.wick-input-updating]:!border-[3px] [&.wick-input-updating]:!border-[#FFC835] [&.read-only]:bg-gray-500";

function toTextInputValue(value: WickInputDynamicValue): string | number {
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function toNumericInputValue(value: WickInputDynamicValue): string | number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function toSliderInputValue(
  value: WickInputDynamicValue
): string | number | undefined {
  if (typeof value === "number" || typeof value === "string") {
    return value;
  }

  return undefined;
}

interface WickInputProps {
  type?: WickInputType;
  className?: string;
  containerclassname?: string;
  tooltip?: string;
  tooltipID?: string;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
  tooltipDelayMs?: number;
  tooltipLongPressMs?: number;
  mobileTooltipMode?: "off" | "long-press";
  hasLongPressAction?: boolean;
  value?: WickInputDynamicValue;
  onChange?: WickInputChangeHandler;
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
  disableBasePadding?: boolean;
  onClick?: (e?: React.SyntheticEvent) => void;
  onTouch?: (e?: React.SyntheticEvent) => void;
  isSearchable?: boolean;
}

type WickInputPropsWithNative = WickInputProps & WickNativeInputProps;

/**
 * WickInput - A versatile input component for the Wick Editor.
 * Supports numeric, text, slider, select, color, checkbox, radio, and button types.
 * @param props - Component props
 * @param ref - Optional ref forwarded to the component
 * @returns JSX.Element
 */
const WickInput = forwardRef<HTMLElement, WickInputPropsWithNative>(
  (props, _ref) => {
    const tooltipID =
      props.tooltipID === undefined
        ? "action-button-tooltip-nyi"
        : props.tooltipID;
    const tooltipAnchorID = `${tooltipID}-anchor`;
    const hasTooltip = Boolean(props.tooltip);
    const mobileTooltipMode = props.mobileTooltipMode ?? "long-press";
    const isTooltipMobileEligible =
      isMobile &&
      props.type === "button" &&
      mobileTooltipMode === "long-press" &&
      !props.hasLongPressAction &&
      hasTooltip;
    const shouldRenderTooltipContainer =
      hasTooltip && (!isMobile || isTooltipMobileEligible);
    const tooltipDelayMs = props.tooltipDelayMs ?? TOOLTIP_HOVER_DELAY_MS;
    const tooltipLongPressMs =
      props.tooltipLongPressMs ?? TOOLTIP_LONG_PRESS_MS;

    const renderTooltip = (nextTooltipID: string): JSX.Element => {
      return (
        <Tooltip
          delayShow={tooltipDelayMs}
          id={nextTooltipID}
          place={props.tooltipPlace === undefined ? "bottom" : props.tooltipPlace}
          aria-haspopup="true"
          className="wick-tooltip"
        >
          {props.tooltip}
        </Tooltip>
      );
    };

  const renderNumeric = (): JSX.Element => {
    const {
      min,
      max,
      onChange,
      type,
      containerclassname,
      tooltip,
      tooltipID,
      tooltipPlace,
      tooltipDelayMs,
      tooltipLongPressMs,
      mobileTooltipMode,
      hasLongPressAction,
      options,
      color,
      stroke,
      placement,
      colorPickerType,
      changeColorPickerType,
      disableAlpha,
      lastColorsUsed,
      label,
      children,
      updateLastColors,
      buttonProps,
      secondaryAction,
      disableBasePadding,
      onClick,
      onTouch,
      isSearchable,
      ...rest
    } = props;

    const isValid = (input: string | number): boolean => {
      let validNumber = !isNaN(Number(input)) && input !== "";

      if (typeof input === "string") {
        validNumber = validNumber && !input.endsWith(".");
      }

      return validNumber;
    };

    const cleanUp = (val: string): string => {
      if (!isValid(val)) return val;

      let numVal = parseFloat(val);
      if (min !== undefined) {
        numVal = Math.max(numVal, min);
      }

      if (max !== undefined) {
        numVal = Math.min(numVal, max);
      }

      return (Math.round(numVal * 1000) / 1000).toString();
    };

    const wrappedOnChange = (input: string): void => {
      if (!onChange) {
        return;
      }

      const parsed = Number.parseFloat(input);
      if (!Number.isFinite(parsed)) {
        return;
      }

      onChange(parsed);
    };

    return (
      <WickTextInput
        {...rest}
        value={toNumericInputValue(props.value)}
        onChange={wrappedOnChange}
        className={classNames(
          INPUT_BASE_CLASSES,
          !disableBasePadding && INPUT_CHROME_CLASSES,
          INPUT_STATE_CLASSES,
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
        {...(() => {
          const {
            type,
            containerclassname,
            tooltip,
            tooltipID,
            tooltipPlace,
            tooltipDelayMs,
            tooltipLongPressMs,
            mobileTooltipMode,
            hasLongPressAction,
            options,
            color,
            stroke,
            placement,
            colorPickerType,
            changeColorPickerType,
            disableAlpha,
            lastColorsUsed,
            label,
            children,
            updateLastColors,
            buttonProps,
            secondaryAction,
            disableBasePadding,
            onClick,
            onTouch,
            isSearchable,
            onChange,
            ...textProps
          } = props;
          return textProps;
        })()}
        onChange={props.onChange ? (value: string) => props.onChange?.(value) : undefined}
        className={classNames(
          INPUT_BASE_CLASSES,
          !props.disableBasePadding && INPUT_CHROME_CLASSES,
          INPUT_STATE_CLASSES,
          { "read-only": props.readOnly },
          props.className
        )}
        value={toTextInputValue(props.value)}
      />
    );
  };

  const renderSlider = (): JSX.Element => {
    const wrappedOnChange = (val: ChangeEvent<HTMLInputElement>): void => {
      props.onChange?.(parseFloat(val.target.value));
    };

    return (
      <input
        {...(() => {
          const {
            type,
            containerclassname,
            tooltip,
            tooltipID,
            tooltipPlace,
            tooltipDelayMs,
            tooltipLongPressMs,
            mobileTooltipMode,
            hasLongPressAction,
            options,
            color,
            stroke,
            placement,
            colorPickerType,
            changeColorPickerType,
            disableAlpha,
            lastColorsUsed,
            label,
            children,
            updateLastColors,
            buttonProps,
            secondaryAction,
            onClick,
            onTouch,
            isSearchable,
            onChange,
            ...inputProps
          } = props;
          return inputProps;
        })()}
        className={classNames(
          "wick-slider mt-auto flex h-full w-full items-center rounded-[5px]",
          props.className
        )}
        value={toSliderInputValue(props.value)}
        type="range"
        onChange={props.onChange ? wrappedOnChange : undefined}
      />
    );
  };

  const renderColor = (): JSX.Element => {
    const wrappedOnChange = (color: PickerColorChange): void => {
      let newColor: string | PickerColorChange = color;

      if (color.rgb) {
        const rgb = color.rgb;
        const str = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
        newColor = str;
      } else if (typeof color.hex === "string") {
        newColor = color.hex;
      }

      props.updateLastColors &&
        props.updateLastColors(
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
    let value = props.options?.find((obj: SelectOption) =>
      Object.is(obj.value, props.value)
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
        className={classNames("wick-input-select h-full w-full", props.className)}
        classNamePrefix={"wick-input-select"}
        menuPortalTarget={document.body}
        menuPosition={"fixed"}
        styles={{
          option: (provided, state) => {
            const style = {
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
      <div className="wick-checkbox-container flex h-full w-full items-center text-center">
        {props.label && (
          <label
            htmlFor={props.label}
            className="wick-checkbox-label mr-1 text-white"
          >
            {props.label}
          </label>
        )}
        <input
          id={props.label}
          className="wick-checkbox h-5 min-h-5 min-w-5 cursor-pointer"
          {...(() => {
            const {
              type,
              containerclassname,
              tooltip,
              tooltipID,
              tooltipPlace,
              tooltipDelayMs,
              tooltipLongPressMs,
              mobileTooltipMode,
              hasLongPressAction,
              options,
              color,
              stroke,
              placement,
              colorPickerType,
              changeColorPickerType,
              disableAlpha,
              lastColorsUsed,
              label,
              children,
              updateLastColors,
              buttonProps,
              secondaryAction,
              onClick,
              onTouch,
              isSearchable,
              onChange,
              value,
              ...inputProps
            } = props;
            return inputProps;
          })()}
          type="checkbox"
          checked={typeof props.checked === "boolean" ? props.checked : Boolean(props.value)}
          onChange={
            props.onChange
              ? (event: React.ChangeEvent<HTMLInputElement>) => {
                  props.onChange?.(event.currentTarget.checked);
                }
              : undefined
          }
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
      tooltipDelayMs,
      tooltipLongPressMs,
      mobileTooltipMode,
      hasLongPressAction,
      updateLastColors,
      buttonProps,
      secondaryAction,
      onTouch,
      color,
      stroke,
      placement,
      colorPickerType,
      changeColorPickerType,
      disableAlpha,
      lastColorsUsed,
      isSearchable,
      onChange,
      ...radioProps
    } = props;

    return (
      <input
        type="radio"
        {...(radioProps as React.InputHTMLAttributes<HTMLInputElement>)}
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
    const buttonClassName = classNames(props.className, {
      "bg-[#4CAF50] text-white": !props.className,
    });

    return (
      <WickButton
        onClick={props.onClick ? () => props.onClick?.() : undefined}
        onLongPress={undefined}
        longPressMs={tooltipLongPressMs}
        consumeClickAfterLongPress={false}
        secondaryAction={props.secondaryAction}
        className={buttonClassName}
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
    }

    return renderButton();
  };

    if (shouldRenderTooltipContainer) {
      return (
        <div
          data-tooltip-id={tooltipID}
          data-tooltip-content={props.tooltip}
          id={tooltipAnchorID}
          className={classNames(
            "wick-input-container flex h-full w-full",
            props.containerclassname
          )}
        >
          {renderTooltip(tooltipID)}
          {renderContent()}
        </div>
      );
    }

    return renderContent();
  }
);

WickInput.displayName = "WickInput";

export default WickInput;
