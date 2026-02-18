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
import ActionButton from 'Editor/Util/ActionButton/ActionButton';
import classNames from 'classnames';
import type { ScriptWindowScriptInfoInterface } from 'Editor/types';

// https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
const capitalize = (s: string): string => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

interface ScriptWindowRowProps {
  name: string;
  scriptInfoInterface: ScriptWindowScriptInfoInterface;
  editScript: (e?: React.MouseEvent) => void;
  deleteScript: (e?: React.MouseEvent) => void;
}

const ScriptWindowRow: React.FC<ScriptWindowRowProps> = ({
  name,
  scriptInfoInterface,
  editScript,
  deleteScript
}) => {
  const getColorBar = (): string => {
    const scriptsByType = scriptInfoInterface.scriptsByType;

    let color = 'blue-bar';

    Object.keys(scriptsByType).forEach(type => {
      const scripts = scriptsByType[type];
      if (scripts && scripts.indexOf(name) > -1) {
        color = scriptInfoInterface.scriptTypeColors[type] + "-bar";
      }
    });

    return color;
  };

  const scriptName = capitalize(name);
  const barColor = getColorBar();

  return (
    <div className="inspector-script-window-row-container mt-[5px] mx-[5px] flex h-[25px] flex-row justify-between rounded-[3px]">
      <div className="script-row-item inspector-script-window-row-name flex h-full w-[calc(100%-29px)] overflow-hidden rounded-[3px] bg-[#303030] text-white">
        <div
          className={classNames(
            "inspector-script-window-row-color-bar h-full w-[5px] mr-[5px]",
            barColor,
            {
              "bg-[#05B8FF]": barColor === "blue-bar",
              "bg-[#29F1A3]": barColor === "green-bar",
              "bg-[#FFE243]": barColor === "yellow-bar",
            }
          )}
        />
        <ActionButton
          id={`inspector-script-window-row-edit${name}`}
          text={capitalize(name)}
          tooltip={`Edit ${scriptName}`}
          tooltipPlace="left"
          action={editScript}
          color="script-name"
          className="action-button-script-name"
        />
      </div>
      <div className="script-row-item inspector-script-window-row-delete h-full w-[25px] rounded-[3px] bg-[#303030] text-white">
        <ActionButton
          id={`inspector-script-window-row-delete${name}`}
          icon="delete-black"
          tooltip="Delete"
          tooltipPlace="left"
          color="red"
          action={deleteScript}
        />
      </div>
    </div>
  );
};

export default ScriptWindowRow;
