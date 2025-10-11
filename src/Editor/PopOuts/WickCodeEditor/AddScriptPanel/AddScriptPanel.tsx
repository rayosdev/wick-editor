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
import capitalize from "Editor/Util/DataFunctions/capitalize";

import classNames from "classnames";

interface Script {
  name: string;
  type: string;
  description: string;
}

interface AddScriptPanelProps {
  addScriptTab: string;
  changeTab: (tab: string) => void;
  scripts: Script[];
  availableScripts?: string[];
  addScript?: (scriptName: string) => void;
}

const AddScriptPanel: React.FC<AddScriptPanelProps> = ({
  addScriptTab,
  changeTab,
  scripts,
  availableScripts,
  addScript
}) => {
  return (
    <div className="add-script-container">
      <div className="add-script-tabs">
        <button
          className={classNames("add-script-tab", "we-event", "Mouse", {
            selected: "Mouse" === addScriptTab,
          })}
          onClick={() => changeTab("Mouse")}
        >
          Mouse
        </button>
        <button
          className={classNames("add-script-tab", "we-event", "Keyboard", {
            selected: "Keyboard" === addScriptTab,
          })}
          onClick={() => changeTab("Keyboard")}
        >
          Keyboard
        </button>
        <button
          className={classNames("add-script-tab", "we-event", "Timeline", {
            selected: "Timeline" === addScriptTab,
          })}
          onClick={() => changeTab("Timeline")}
        >
          Timeline
        </button>
      </div>

      <div className="add-script-buttons">
        {scripts.map((script, i) => {
          return (
            <button
              className={classNames("add-script-button", script.type)}
              key={`add-script-button-${i}`}
              disabled={
                availableScripts &&
                availableScripts.indexOf(script.name) === -1
              }
              onClick={() =>
                addScript && addScript(script.name)
              }
            >
              <div className="add-script-button-title">
                {capitalize(script.name)}
              </div>
              <div className="add-script-button-description">
                {" "}
                {script.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AddScriptPanel;
