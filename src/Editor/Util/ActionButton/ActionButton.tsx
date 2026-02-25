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

import { ReactNode } from "react";

import WickInput from "Editor/Util/WickInput/WickInput";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";

import classNames from "classnames";

interface ActionButtonProps {
  id?: string;
  icon?: string;
  text?: string;
  tooltip?: string;
  tooltipHotkey?: string;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
  action: (e?: React.MouseEvent) => void;
  useClickEvent?: boolean;
  isActive?: () => boolean;
  disabled?: boolean;
  color?: string;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  dropdown?: boolean;
  secondaryAction?: () => void;
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  containerClassName?: string;
}

const BUTTON_BASE_CLASSES =
  "h-full w-full select-none touch-manipulation transition-[background-color,border-color,color] duration-200";

const COLOR_STYLE_CLASSES: Record<string, string> = {
  blue: "bg-[#101DA5] text-white has-hover:bg-[#2636E1] active:bg-[#010A6F]",
  sky: "bg-[#8DDED6] text-black has-hover:bg-[#B4ECE6] active:bg-[#D3F8F4]",
  red: "bg-[#F86868] text-black has-hover:bg-[#FF8C8C] active:bg-[#E61E07]",
  "dark-red":
    "bg-[#A30000] text-black has-hover:bg-[#B30000] active:bg-[#940000]",
  "active-green":
    "bg-[#01C094] text-black has-hover:bg-[#1EE29A] active:bg-[#01C094]",
  green:
    "bg-[#1EE29A] text-[#303030] has-hover:bg-[#29F1A3] active:bg-[#01C094]",
  yellow: "bg-[#FFC835] text-black has-hover:bg-[#FFE243] active:bg-[#E9AA02]",
  tool: "bg-[#303030] text-black border-2 border-transparent has-hover:border-[#29F1A3] active:border-[#01C094] active:bg-[#3B3B3B]",
  menu: "bg-[#303030] text-[#E0E0E0] has-hover:text-white active:text-white [&_img]:w-auto",
  save: "text-[#1EE29A] border-[1.5px] border-[#1EE29A] px-[5px]",
  "tool-settings":
    "bg-[#3B3B3B] text-[#BDBDBD] has-hover:bg-[#4A4A4A] has-hover:text-white active:bg-[#4A4A4A]",
  upload:
    "bg-[#303030] text-white border-[1.5px] border-[#CCCCCC] text-[16px] has-hover:text-[#01C094] has-hover:border-[#29F1A3] active:text-[#01C094] active:border-[#1EE29A] [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:px-[2px]",
  gray:
    "bg-[#4F4F4F] text-white text-[16px] has-hover:bg-[#575757] active:bg-[#424242]",
  "gray-green":
    "bg-[#4F4F4F] text-white text-[16px] has-hover:bg-[#1EE29A] has-hover:text-black active:bg-[#01C094] active:text-black",
  error:
    "bg-transparent text-white text-[16px] has-hover:bg-[#FF7867] active:bg-[#8D564D]",
  checkbox:
    "bg-[#3B3B3B] text-black border-2 border-transparent has-hover:border-[#29F1A3] active:border-[#01C094]",
  "active-blue":
    "bg-[#00ADEF] text-black text-[16px] has-hover:bg-[#00B9FF] active:bg-[#00709C]",
  inspector:
    "bg-[#00ADEF] text-black text-[16px] has-hover:bg-[#00B9FF] active:bg-[#00709C]",
  reference:
    "bg-[#353434] text-white text-[16px] has-hover:text-[#29F1A3] active:text-[#29F1A3]",
  "script-name":
    "bg-[#303030] text-[#CCCCCC] text-[16px] has-hover:text-white active:text-white",
  flame:
    "bg-[#F66A37] text-black text-[16px] has-hover:bg-[#FF7848] active:bg-[#E6460E]",
  support:
    "flex flex-row items-center justify-center cursor-pointer bg-transparent border-2 border-[#E85B46] rounded-[6px] ml-[8px] box-border px-[6px] py-[2px] text-[16px] text-[#E0E0E0] has-hover:text-white [&_img]:order-1 [&_img]:h-[18px] [&_img]:w-auto [&_span]:order-2 [&_span]:pl-[5px] [&_span]:font-nunito",
};

const ACTIVE_STYLE_CLASSES: Record<string, string> = {
  blue: "bg-[#010A6F]",
  sky: "bg-[#D3F8F4]",
  red: "bg-[#E61E07]",
  "dark-red": "bg-[#940000]",
  "active-green": "bg-[#01C094]",
  green: "bg-[#01C094]",
  yellow: "bg-[#E9AA02]",
  tool: "border-[#01C094] bg-[#424242] shadow-[inset_0_0_4px_#01C094]",
  menu: "text-white",
  "tool-settings": "bg-[#4A4A4A]",
  upload: "text-[#01C094] border-[#29F1A3]",
  gray: "bg-[#424242]",
  "gray-green": "bg-[#01C094] text-black",
  error: "bg-[#8D564D]",
  checkbox: "border-[#01C094]",
  "active-blue": "bg-[#00709C]",
  inspector: "bg-[#00709C]",
  reference: "text-[#29F1A3]",
  "script-name": "text-white",
  flame: "bg-[#E6460E]",
};

/**
 * ActionButton - A versatile button component with icons, text, tooltips, and dropdown support.
 * @param props - Component props
 * @returns JSX.Element
 */
export default function ActionButton(props: ActionButtonProps): JSX.Element {
  const isActive = props.isActive || (() => false);
  const active = isActive();

  const colorClass = props.color
    ? "action-button-" + props.color
    : "action-button-green";
  const colorTokens = props.color
    ? props.color.split(/\s+/).filter(Boolean)
    : ["green"];
  const hasSaveToken = colorTokens.includes("save");

  const newClassName = classNames("action-button", props.className);

  const colorTokenClasses = colorTokens
    .map((token) => COLOR_STYLE_CLASSES[token])
    .filter(Boolean);

  const activeTokenClasses = active
    ? colorTokens
      .map((token) => {
        if (token === "menu" && hasSaveToken) {
          return "";
        }
        return ACTIVE_STYLE_CLASSES[token] || "";
      })
      .filter(Boolean)
    : [];

  const finalColorClassName = classNames(
    newClassName,
    colorClass,
    BUTTON_BASE_CLASSES,
    colorTokenClasses,
    { "active-button": active },
    activeTokenClasses,
    props.buttonClassName
  );

  const tooltipID = props.id
    ? "action-button-tooltip-" + props.id
    : "action-button-tooltip-nyi";

  function runAction(e?: React.MouseEvent): void {
    if (!props.disabled) {
      props.useClickEvent ? props.action(e) : props.action();
    }
  }

  function renderSingleIcon(): JSX.Element {
    return (
      <ToolIcon
        className={classNames(
          "action-button-single-icon mx-auto p-px",
          props.iconClassName,
          { "dropdown-action-button-icon h-[18px]": props.dropdown }
        )}
        name={props.icon}
      />
    );
  }

  function renderDropdownIcon(): JSX.Element {
    return (
      <div className="action-button-dropdown-icon-container relative flex h-full w-full items-center justify-center">
        <ToolIcon
          className={classNames(
            "action-button-single-icon mx-auto p-px",
            props.iconClassName
          )}
          name={props.icon}
        />
        {props.dropdown && (
          <div className="dropdown-extra-icon absolute bottom-0 right-0 mb-[2px] mr-[2px] h-[5px] w-[5px] opacity-70">
            <ToolIcon className="h-full w-full" name="moreactions" />
          </div>
        )}
      </div>
    );
  }

  function renderTextIcon(): JSX.Element {
    return (
      <div className="action-button-icon-text-container flex max-h-full flex-row items-center justify-center">
        <ToolIcon
          className={classNames(
            props.iconClassName,
            "action-button-text-icon mr-2 !h-[18px] w-auto shrink-0 object-contain [&.mobile-asset-library-icon]:h-5 [&.mobile-asset-library-icon]:w-auto",
            { "dropdown-action-button-icon !h-[18px]": props.dropdown }
          )}
          name={props.icon}
        />
        {props.text && (
          <span
            className={classNames(newClassName + "-text", props.textClassName)}
          >
            {props.text}
          </span>
        )}
      </div>
    );
  }

  function renderText(): JSX.Element {
    return (
      <span
        className={classNames(
          "action-button-text flex h-full select-none items-center justify-center text-center",
          newClassName + "-text",
          props.textClassName,
          {
            "text-left": colorTokens.includes("script-name"),
          }
        )}
      >
        {props.text}
      </span>
    );
  }

  function renderContent(): ReactNode {
    if (props.dropdown && props.icon) {
      return renderDropdownIcon();
    } else if (props.icon && props.text) {
      return renderTextIcon();
    } else if (props.icon) {
      return renderSingleIcon();
    } else if (props.text) {
      return renderText();
    }
    return null;
  }

  function getTooltip(): string | undefined {
    const hotkey = props.tooltipHotkey;

    if (props.tooltip) {
      if (hotkey) return props.tooltip + ` (${hotkey.toUpperCase()})`;
      return props.tooltip;
    }
  }

  return (
    <WickInput
      containerclassname={props.containerClassName}
      buttonProps={props.buttonProps}
      tooltip={getTooltip()}
      tooltipID={tooltipID}
      tooltipPlace={props.tooltipPlace}
      className={finalColorClassName}
      type="button"
      secondaryAction={props.secondaryAction}
      onClick={runAction}
      onTouch={runAction}
    >
      {renderContent()}
    </WickInput>
  );
}
