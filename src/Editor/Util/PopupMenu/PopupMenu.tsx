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

import React, { ReactNode } from "react";
import { Popover } from "reactstrap";
import "./popupmenu-legacy.css";

import classNames from "classnames";

interface PopupMenuProps {
  isOpen: boolean;
  toggle: () => void;
  target: string;
  mobile?: boolean;
  children?: ReactNode;
  className?: string;
}

/**
 * PopupMenu component - wrapper for Reactstrap Popover
 * Displays a popup menu below the target element
 */
const PopupMenu: React.FC<PopupMenuProps> = ({
  isOpen,
  toggle,
  target,
  mobile,
  children,
  className
}) => {
  const classTokens = new Set((className ?? "").split(/\s+/).filter(Boolean));
  const isToolSelector = classTokens.has("tool-selector-menu-popover");
  const isDesktop = classTokens.has("desktop");
  const isToolSettings = classTokens.has("tool-settings-menu-popover");
  const isToolSettingsPresets = classTokens.has("tool-settings-presets-menu-popover");
  const isCanvasActions = classTokens.has("canvas-actions-menu-popover");

  return (
    <Popover
      placement="bottom"
      isOpen={isOpen}
      toggle={toggle}
      target={target}
      className={classNames(
        "popup-menu-popover !border-0 !bg-transparent",
        mobile && "!max-w-[calc(100vw-16px)]",
        !mobile && !isToolSelector && !isToolSettings && !isCanvasActions && "!max-w-[560px]",
        !mobile && isToolSelector && isDesktop && "!max-w-[260px]",
        !mobile && isToolSelector && !isDesktop && "!max-w-[220px]",
        !mobile && isToolSettings && !isToolSettingsPresets && "!max-w-[220px]",
        !mobile && isToolSettingsPresets && "!max-w-[280px]",
        !mobile && isCanvasActions && "!max-w-[620px]",
        mobile && "mobile",
        className
      )}
      transition={{ timeout: 150 }}
      trigger="legacy"
      rootClose
    >
      {children}
    </Popover>
  );
};

export default PopupMenu;
