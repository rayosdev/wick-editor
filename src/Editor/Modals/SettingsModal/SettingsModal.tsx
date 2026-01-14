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
import type { HotKeyMap } from "Editor/types/hotkeys";
import type {
  CustomHotKeys,
  ProjectSettings as ProjectSettingsType,
  ColorPickerType,
  ToolSettingRestrictions
} from "Editor/types";
import WickModal from "Editor/Modals/WickModal/WickModal";
import TabbedInterface from "Editor/Util/TabbedInterface/TabbedInterface";
import ProjectSettings from "./ProjectSettings/ProjectSettings";
import EditorSettings from "./EditorSettings/EditorSettings";
import KeyboardShortcuts from "./KeyboardShortcuts/KeyboardShortcuts";

import "./_settingsmodal.scss";

import classNames from "classnames";

// Hotkey groups structure from editor.hotKeyInterface.createHandlerGroups()
// Maps group names to arrays of action names
type KeyMapGroups = Record<string, string[]>;

// Tool settings can return various types including WickColor objects
type ToolSettingValue = string | number | boolean | { rgba: string };

interface SettingsModalProps {
  open: boolean;
  toggle: () => void;
  isMobile?: boolean;
  project: any; // Wick Engine project instance - no TypeScript definitions available
  updateProjectSettings: (settings: Partial<ProjectSettingsType>) => void;
  colorPickerType: ColorPickerType;
  changeColorPickerType: (type: ColorPickerType) => void;
  updateLastColors: (color: string) => void;
  lastColorsUsed: string[];
  addCustomHotKeys: (keys: CustomHotKeys) => void;
  resetCustomHotKeys: () => void;
  customHotKeys: CustomHotKeys;
  keyMap: HotKeyMap;
  keyMapGroups?: KeyMapGroups;
  toast?: (message: string) => void;
  createCombinedHotKeyMap?: () => HotKeyMap;
  getToolSetting: (setting: string) => ToolSettingValue;
  setToolSetting: (setting: string, value: ToolSettingValue) => void;
  getToolSettingRestrictions: (setting: string) => ToolSettingRestrictions;
}

/**
 * SettingsModal component provides access to project, editor, and keyboard settings.
 * Renders different layouts for desktop (3 tabs) vs mobile (2 tabs).
 */
const SettingsModal: React.FC<SettingsModalProps> = (props) => {
  const renderDesktop = (): JSX.Element => {
    return (
      <WickModal
        open={props.open}
        toggle={props.toggle}
        className="settings-modal-container"
        overlayClassName="settings-modal-overlay"
      >
        <div className="settings-modal-title">Settings</div>
        <div className="settings-modal-body">
          <TabbedInterface tabNames={["Project", "Shortcuts", "Editor"]}>
            <ProjectSettings
              project={props.project}
              updateProjectSettings={props.updateProjectSettings}
              colorPickerType={props.colorPickerType}
              changeColorPickerType={props.changeColorPickerType}
              updateLastColors={props.updateLastColors}
              toggle={props.toggle}
              lastColorsUsed={props.lastColorsUsed}
            />
            <KeyboardShortcuts
              addCustomHotKeys={props.addCustomHotKeys}
              resetCustomHotKeys={props.resetCustomHotKeys}
              customHotKeys={props.customHotKeys}
              keyMap={props.keyMap}
              keyMapGroups={props.keyMapGroups || {}}
              toast={props.toast}
              toggle={props.toggle}
              createCombinedHotKeyMap={props.createCombinedHotKeyMap || (() => ({}))}
            />
            <EditorSettings
              colorPickerType={props.colorPickerType}
              changeColorPickerType={props.changeColorPickerType}
              updateLastColors={props.updateLastColors}
              lastColorsUsed={props.lastColorsUsed}
              getToolSetting={props.getToolSetting}
              setToolSetting={props.setToolSetting}
              getToolSettingRestrictions={props.getToolSettingRestrictions}
            />
          </TabbedInterface>
        </div>
      </WickModal>
    );
  };

  const renderMobile = (): JSX.Element => {
    return (
      <WickModal
        open={props.open}
        toggle={props.toggle}
        className={classNames(
          "settings-modal-container",
          props.isMobile && "mobile"
        )}
        overlayClassName="settings-modal-overlay"
      >
        <div className="settings-modal-title">Settings</div>
        <div className="settings-modal-body">
          <TabbedInterface tabNames={["Project", "Editor"]}>
            <ProjectSettings
              isMobile={true}
              project={props.project}
              updateProjectSettings={props.updateProjectSettings}
              colorPickerType={props.colorPickerType}
              changeColorPickerType={props.changeColorPickerType}
              updateLastColors={props.updateLastColors}
              lastColorsUsed={props.lastColorsUsed}
            />
            <EditorSettings
              colorPickerType={props.colorPickerType}
              changeColorPickerType={props.changeColorPickerType}
              updateLastColors={props.updateLastColors}
              lastColorsUsed={props.lastColorsUsed}
              getToolSetting={props.getToolSetting}
              setToolSetting={props.setToolSetting}
              getToolSettingRestrictions={props.getToolSettingRestrictions}
            />
          </TabbedInterface>
        </div>
      </WickModal>
    );
  };

  if (props.isMobile) {
    return renderMobile();
  } else {
    return renderDesktop();
  }
};

export default SettingsModal;
