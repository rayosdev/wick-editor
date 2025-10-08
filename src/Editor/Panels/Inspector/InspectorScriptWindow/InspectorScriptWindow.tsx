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

import { Component } from 'react';
import ScriptWindowRow from './ScriptWindowRow/ScriptWindowRow';
import './_inspectorscriptwindow.scss';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

interface ScriptObject {
  name: string;
}

interface Script {
  scripts: ScriptObject[];
}

interface InspectorScriptWindowProps {
  scriptInfoInterface: any;
  script: Script;
  deleteScript: (script: Script, name: string) => void;
  editScript: (name: string) => void;
}

class InspectorScriptWindow extends Component<InspectorScriptWindowProps> {
  renderScriptRow = (scriptobj: ScriptObject, i: number): JSX.Element => {
    return (
      <ScriptWindowRow
        scriptInfoInterface={this.props.scriptInfoInterface}
        key={i}
        name={scriptobj.name}
        deleteScript={() => { this.props.deleteScript(this.props.script, scriptobj.name) }}
        editScript={() => { this.props.editScript(scriptobj.name) }} />
    );
  }

  render(): JSX.Element {
    return (
      <div className="inspector-script-window-container">
        <div className="inspector-script-window-header">
          Scripts
        </div>
        <div className="inspector-script-window-body">
          {this.props.script.scripts.map(this.renderScriptRow)}
          <div className="inspector-script-window-row-container">
            <ActionButton
              color="inspector"
              text="+ add script"
              action={() => this.props.editScript("add")}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default InspectorScriptWindow
