
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

import React from 'react';
import classNames from "classnames";

interface ToolboxBreakProps {
  vertical?: boolean;
  className?: string;
}

const ToolboxBreak: React.FC<ToolboxBreakProps> = ({ vertical, className }) => {
  const breakClassName = vertical
    ? "toolbox-break-vertical"
    : className || "toolbox-break";
  const classTokens = breakClassName.split(/\s+/).filter(Boolean);
  const hasHorizontalClass = classTokens.includes("toolbox-break");
  const hasVerticalClass = classTokens.includes("toolbox-break-vertical");
  const hasMobileClass = classTokens.includes("mobile");

  return (
    <div
      className={classNames(
        breakClassName,
        hasHorizontalClass && "h-[70%] w-[3px] min-w-[3px] bg-[#191919] mx-2",
        hasHorizontalClass && hasMobileClass && "mx-1",
        hasVerticalClass && "w-[25px] h-[3px] min-h-[3px] bg-[#191919] my-2"
      )}
    ></div>
  );
};

export default ToolboxBreak;
