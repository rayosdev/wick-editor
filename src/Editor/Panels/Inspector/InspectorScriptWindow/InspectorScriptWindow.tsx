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
    <div className="inspector-script-window-container h-full w-full rounded-[3px] bg-[#4A4A4A] pb-[5px]">
      <div className="inspector-script-window-header h-[25px] w-full rounded-t-[3px] bg-[#3B3B3B] text-center text-white">
        Scripts
      </div>
      <div className="inspector-script-window-body">
        {script.scripts.map(renderScriptRow)}
        <div className="inspector-script-window-row-container mt-[5px] flex h-[25px] flex-row justify-between rounded-[3px] mx-[5px]">
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
