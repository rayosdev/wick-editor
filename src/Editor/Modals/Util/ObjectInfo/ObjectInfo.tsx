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
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";

import classNames from "classnames";

interface ObjectInfoRow {
  text: string;
  icon: string;
}

interface ObjectInfoProps {
  className?: string;
  title: string;
  rows: ObjectInfoRow[];
}

/**
 * ObjectInfo component displays a titled list of rows with icons and text.
 * Used for displaying object information in modals.
 */
const ObjectInfo: React.FC<ObjectInfoProps> = ({ className, title, rows }) => {
  const renderRow = (rowInfo: ObjectInfoRow, i: number): JSX.Element => {
    const text = rowInfo.text;
    const icon = rowInfo.icon;
    return (
      <div
        key={i}
        className="object-info-row mt-[3px] flex text-[14px] text-white"
      >
        <div className="object-info-row-icon relative left-0 top-[2px] h-[15px] w-[15px]">
          <ToolIcon name={icon} />
        </div>
        <div className="object-info-row-text ml-1 text-white">{text}</div>
      </div>
    );
  };

  return (
    <div
      className={classNames(
        "object-info-container mt-[10px] h-[140px] w-full rounded-[3px] bg-[#525252] px-5 pb-5 pt-[10px]",
        className
      )}
    >
      <div className="object-info-title text-[16px] text-white">{title}</div>
      {rows.map(renderRow)}
    </div>
  );
};

export default ObjectInfo;
