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
import './_scriptwindowrow.scss';
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

  return (
    <div className="inspector-script-window-row-container">
      <div className="script-row-item inspector-script-window-row-name">
        <div className={`inspector-script-window-row-color-bar ${getColorBar()}`} />
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
      <div className="script-row-item inspector-script-window-row-delete">
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
