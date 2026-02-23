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
import HotKeyInterface from "Editor/hotKeyMap";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import type { HotKeyMap } from "Editor/types/hotkeys";

import classNames from "classnames";

export interface ToolButtonProps {
  name: string;
  tooltip: string;
  keyMap: HotKeyMap;
  getActiveToolName: () => string;
  setActiveTool?: (name: string) => void;
  action?: (e?: React.MouseEvent) => void;
  secondaryAction?: () => void;
  tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
  iconClassName?: string;
  dropdown?: boolean;
  className?: string;
}

const ToolButton: React.FC<ToolButtonProps> = ({
  name,
  tooltip,
  keyMap,
  getActiveToolName,
  setActiveTool,
  action,
  secondaryAction,
  tooltipPlace,
  iconClassName,
  dropdown,
  className
}) => {
  const actionDefault = setActiveTool
    ? () => setActiveTool(name)
    : null;

  const getHotKey = (actionName: string): string | undefined => {
    return HotKeyInterface.getHotKey(keyMap, actionName);
  };

  const renderSelectButton = (): JSX.Element => {
    return (
      <ActionButton
        color="tool"
        isActive={() => getActiveToolName() === name}
        id={`tool-button-${name}`}
        tooltip={tooltip}
        tooltipHotkey={getHotKey(`activate-${name}`)}
        action={action ? action : actionDefault!}
        secondaryAction={secondaryAction}
        tooltipPlace={tooltipPlace ? tooltipPlace : "bottom"}
        icon={name}
        className="tool-button-select"
        iconClassName={classNames("tool-button-icon !h-[80%]", iconClassName)}
        dropdown={dropdown}
      />
    );
  };

  return (
    <div className={className || ""}>
      <div className="tool-button-select-container h-[30px] w-[30px]">
        {renderSelectButton()}
      </div>
    </div>
  );
};

export default ToolButton;
