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
import ScriptWindowRow from './ScriptWindowRow/ScriptWindowRow';
import './_inspectorscriptwindow.scss';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';
import type { Script, ScriptWindowScriptInfoInterface, ScriptObject } from 'Editor/types';

interface InspectorScriptWindowProps {
  scriptInfoInterface: ScriptWindowScriptInfoInterface;
  script: Script;
  deleteScript: (script: Script, name: string) => void;
  editScript: (name: string) => void;
}

const InspectorScriptWindow: React.FC<InspectorScriptWindowProps> = ({
  scriptInfoInterface,
  script,
  deleteScript,
  editScript
}) => {
  const renderScriptRow = (scriptobj: ScriptObject, i: number): JSX.Element => {
    return (
      <ScriptWindowRow
        scriptInfoInterface={scriptInfoInterface}
        key={i}
        name={scriptobj.name}
        deleteScript={() => { deleteScript(script, scriptobj.name) }}
        editScript={() => { editScript(scriptobj.name) }} />
    );
  };

  return (
    <div className="inspector-script-window-container">
      <div className="inspector-script-window-header">
        Scripts
      </div>
      <div className="inspector-script-window-body">
        {script.scripts.map(renderScriptRow)}
        <div className="inspector-script-window-row-container">
          <ActionButton
            color="inspector"
            text="+ add script"
            action={() => editScript("add")}
          />
        </div>
      </div>
    </div>
  );
};

export default InspectorScriptWindow;
