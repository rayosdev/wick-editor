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
import "./_popupmenu.scss";

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
  return (
    <Popover
      placement="bottom"
      isOpen={isOpen}
      toggle={toggle}
      target={target}
      boundariesElement={"viewport" as any}
      className={classNames(
        "popup-menu-popover",
        mobile && "mobile",
        className
      )}
    >
      {children}
    </Popover>
  );
};

export default PopupMenu;
