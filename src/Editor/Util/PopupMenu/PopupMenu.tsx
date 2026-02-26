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
import "./popupmenu-legacy.css";

import classNames from "classnames";
import WickPopover from "Editor/Util/WickPopover/WickPopover";

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
  const canvasActionsAlign =
    !mobile && isCanvasActions
      ? (() => {
          const targetElement = typeof document !== "undefined"
            ? document.getElementById(target)
            : null;
          if (!targetElement || typeof window === "undefined") {
            return "start" as const;
          }

          const rect = targetElement.getBoundingClientRect();
          return rect.left > window.innerWidth / 2 ? ("end" as const) : ("start" as const);
        })()
      : "start";
  const popoverAlign = canvasActionsAlign;
  const popoverPositions = !mobile && isCanvasActions
    ? (["bottom", "top", "left", "right"] as const)
    : (["bottom", "top"] as const);

  const handleClickOutside = (event: MouseEvent) => {
    const clickNode = event.target as Node | null;
    const targetElement = document.getElementById(target);
    if (clickNode && targetElement?.contains(clickNode)) {
      return;
    }

    if (isOpen) {
      toggle();
    }
  };

  const popoverClassName = classNames(
    "popover popup-menu-popover !border-0 !bg-transparent",
    mobile && "!max-w-[calc(100vw-16px)]",
    !mobile && !isToolSelector && !isToolSettings && !isCanvasActions && "!max-w-[560px]",
    !mobile && isToolSelector && isDesktop && "!max-w-[260px]",
    !mobile && isToolSelector && !isDesktop && "!max-w-[220px]",
    !mobile && isToolSettings && !isToolSettingsPresets && "!max-w-[220px]",
    !mobile && isToolSettingsPresets && "!max-w-[280px]",
    !mobile && isCanvasActions && "!max-w-[620px]",
    mobile && "mobile",
    className
  );

  return (
    <WickPopover
      isOpen={isOpen}
      targetId={target}
      positions={[...popoverPositions]}
      align={popoverAlign}
      onClickOutside={handleClickOutside}
      content={
        <div className={popoverClassName}>
          <div className="popover-body">{children}</div>
        </div>
      }
    >
      <span className="wick-popover-anchor" aria-hidden />
    </WickPopover>
  );
};

export default PopupMenu;
