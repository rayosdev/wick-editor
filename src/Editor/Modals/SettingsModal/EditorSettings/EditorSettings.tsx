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

import './_editorsettings.scss';
import WickInput from 'Editor/Util/WickInput/WickInput';
import type { ColorPickerType, ToolSettingRestrictions } from 'Editor/types';

import iconBackwards from 'resources/timeline-icons/backwards.svg';
import iconForwards from 'resources/timeline-icons/forwards.svg';

interface WickColor {
  rgba: string;
}

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
    <div className="editor-settings-modal-body">
      <div className="editor-settings-group">
        <label htmlFor="onion-skin-style" className="editor-settings-group-title">Onion Skinning</label>
        Style:
        <WickInput
          type="select"
          id="onion-skin-style"
          value={props.getToolSetting('onionSkinStyle')}
          options={optionsLabels}
          onChange={(val: any) => { props.setToolSetting('onionSkinStyle', val.value) }}
        />
        {
          props.getToolSetting('onionSkinStyle') !== 'standard' &&
          <div className="editor-settings-row">
            Outline Colors:
            <div className="editor-settings-color-containers-row">
              <div className="editor-settings-color-container">
                <img className="forward-backward-icon" alt="B:" src={iconBackwards} />

                <WickInput
                  type="color"
                  id="editor-settings-backward-color-picker"
                  disableAlpha={true}
                  placement={'bottom'}
                  color={(props.getToolSetting('backwardOnionSkinTint') as WickColor).rgba}
                  onChange={(color: any) => { props.setToolSetting('backwardOnionSkinTint', new (window as any).Wick.Color(color)) }}
                  colorPickerType={props.colorPickerType}
                  changeColorPickerType={props.changeColorPickerType}
                  updateLastColors={props.updateLastColors}
                  lastColorsUsed={props.lastColorsUsed} />
              </div>

              <div className="editor-settings-color-container">
                <img className="forward-backward-icon" alt="F:" src={iconForwards} />

                <WickInput
                  type="color"
                  id="editor-settings-forward-color-picker"
                  disableAlpha={true}
                  placement={'bottom'}
                  color={(props.getToolSetting('forwardOnionSkinTint') as WickColor).rgba}
                  onChange={(color: any) => { props.setToolSetting('forwardOnionSkinTint', new (window as any).Wick.Color(color)) }}
                  colorPickerType={props.colorPickerType}
                  changeColorPickerType={props.changeColorPickerType}
                  updateLastColors={props.updateLastColors}
                  lastColorsUsed={props.lastColorsUsed} />
              </div>
            </div>
          </div>
        }

      </div>
    </div>
  );
};

export default EditorSettings;
