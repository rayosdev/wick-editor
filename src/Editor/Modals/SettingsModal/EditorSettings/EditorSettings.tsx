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

import WickInputV2LegacyAdapter from 'Editor/Util/WickInputV2/WickInputV2LegacyAdapter';
import { createWickColor } from "Editor/Util/wickRuntime";
import type { ColorPickerType, ToolSettingRestrictions } from 'Editor/types';

import iconBackwards from 'resources/timeline-icons/backwards.svg';
import iconForwards from 'resources/timeline-icons/forwards.svg';

interface WickColor {
  rgba: string;
}

const createEditorSettingColor = (value: string): WickColor | string => {
  const wickColor = createWickColor(value);
  if (typeof wickColor === "string") {
    return wickColor;
  }

  if (typeof wickColor.rgba === "string") {
    return { rgba: wickColor.rgba };
  }

  return value;
};

interface EditorSettingsProps {
  getToolSetting: (setting: string) => string | number | boolean | WickColor;
  setToolSetting: (setting: string, value: string | number | boolean | WickColor) => void;
  getToolSettingRestrictions: (setting: string) => ToolSettingRestrictions;
  colorPickerType: ColorPickerType;
  changeColorPickerType: (type: ColorPickerType) => void;
  updateLastColors: (color: string) => void;
  lastColorsUsed: string[];
}

/**
 * EditorSettings component for configuring editor preferences.
 * Currently supports onion skinning style and color settings.
 */
const EditorSettings: React.FC<EditorSettingsProps> = (props) => {
  const optionsLabels: Array<{ label: string; value: string }> = [];
  const options = props.getToolSettingRestrictions('onionSkinStyle').options || [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if (option) {
      optionsLabels.push({ label: option, value: option });
    }
  }

  return (
    <div className="editor-settings-modal-body h-full w-full">
      <div className="editor-settings-group mt-2 flex h-[60px] w-full flex-col text-white">
        <label
          htmlFor="onion-skin-style"
          className="editor-settings-group-title text-[20px] text-editor-modal-text"
        >
          Onion Skinning
        </label>
        Style:
        <WickInputV2LegacyAdapter
          type="select"
          id="onion-skin-style"
          value={String(props.getToolSetting('onionSkinStyle'))}
          options={optionsLabels}
          onChange={(value) => {
            props.setToolSetting('onionSkinStyle', String(value));
          }}
        />
        {
          props.getToolSetting('onionSkinStyle') !== 'standard' &&
          <div className="editor-settings-row mt-[15px] h-10 text-white">
            Outline Colors:
            <div className="editor-settings-color-containers-row flex h-[30px] flex-1 justify-between">
              <div className="editor-settings-color-container mb-1 ml-1 flex h-full w-1/2 flex-row items-center text-editor-modal-text">
                <img
                  className="forward-backward-icon mr-1 h-full"
                  alt="B:"
                  src={iconBackwards}
                />

                <WickInputV2LegacyAdapter
                  type="color"
                  id="editor-settings-backward-color-picker"
                  disableAlpha={true}
                  placement={'bottom'}
                  color={(props.getToolSetting('backwardOnionSkinTint') as WickColor).rgba}
                  onChange={(color: string) => { props.setToolSetting('backwardOnionSkinTint', createEditorSettingColor(color)) }}
                  colorPickerType={props.colorPickerType}
                  changeColorPickerType={props.changeColorPickerType}
                  updateLastColors={props.updateLastColors}
                  lastColorsUsed={props.lastColorsUsed}
                />
              </div>

              <div className="editor-settings-color-container mb-1 ml-1 flex h-full w-1/2 flex-row items-center text-editor-modal-text">
                <img
                  className="forward-backward-icon mr-1 h-full"
                  alt="F:"
                  src={iconForwards}
                />

                <WickInputV2LegacyAdapter
                  type="color"
                  id="editor-settings-forward-color-picker"
                  disableAlpha={true}
                  placement={'bottom'}
                  color={(props.getToolSetting('forwardOnionSkinTint') as WickColor).rgba}
                  onChange={(color: string) => { props.setToolSetting('forwardOnionSkinTint', createEditorSettingColor(color)) }}
                  colorPickerType={props.colorPickerType}
                  changeColorPickerType={props.changeColorPickerType}
                  updateLastColors={props.updateLastColors}
                  lastColorsUsed={props.lastColorsUsed}
                />
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  );
};

export default EditorSettings;
