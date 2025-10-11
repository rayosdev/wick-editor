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
import type { HotKeyMap } from "Editor/types/hotkeys";
import type {
  ProjectSettings,
  CustomHotKeys,
  WarningModalInfo,
  LocalFileEntry,
  WickAsset,
  ToolSettingRestrictions,
  ColorPickerType,
} from "../../types";

import MakeInteractive from '../MakeInteractive/MakeInteractive';
import AutosaveWarning from '../AutosaveWarning/AutosaveWarning';
import WelcomeMessage from '../WelcomeMessage/WelcomeMessage';
import MakeAnimated from '../MakeAnimated/MakeAnimated';
import ExportOptions from '../ExportOptions/ExportOptions';
import GeneralWarning from '../GeneralWarning/GeneralWarning';
import ExportMedia from '../ExportMedia/ExportMedia';
import SettingsModal from '../SettingsModal/SettingsModal';
import BuiltinLibrary from '../BuiltinLibrary/BuiltinLibrary';
import EditorInfo from '../EditorInfo/EditorInfo';
import OpenSourceNotices from '../OpenSourceNotices/OpenSourceNotices';
import MobileMenu from '../MobileMenu/MobileMenu';
import SavedProjects from '../SavedProjects/SavedProjects';
import SimpleProjectSettings from '../SimpleProjectSettings/SimpleProjectSettings';
import SupportUs from '../SupportUs/SupportUs';

// Tool settings can return various types including WickColor objects
type ToolSettingValue = string | number | boolean | { rgba: string };

interface ModalHandlerProps {
  activeModalName: string | null;
  openModal: (name: string) => void;
  closeActiveModal: () => void;
  createClipFromSelection: (name: string) => void;
  createButtonFromSelection: (name: string) => void;
  createAnimationFromSelection: (name: string) => void;
  openWarningModal: (info: WarningModalInfo) => void;
  warningModalInfo: WarningModalInfo | null;
  exportProjectAsVideo: () => void;
  renderProgress: number;
  renderType: "video" | "gif" | "image sequence"; // Subset of RenderType used by ExportMedia
  renderStatusMessage: string;
  project: any; // Wick Engine project instance - no TypeScript definitions available
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  addCustomHotKeys: (keys: CustomHotKeys) => void;
  resetCustomHotKeys: () => void;
  keyMap: HotKeyMap;
  keyMapGroups: any; // TODO: Investigate actual type from editor.hotKeyInterface.createHandlerGroups()
  customHotKeys: CustomHotKeys;
  colorPickerType: ColorPickerType;
  changeColorPickerType: (type: ColorPickerType) => void;
  updateLastColors: (color: string) => void;
  lastColorsUsed: string[];
  toast: (message: string) => void;
  createCombinedHotKeyMap: () => HotKeyMap;
  getToolSetting: (setting: string) => ToolSettingValue;
  setToolSetting: (setting: string, value: ToolSettingValue) => void;
  getToolSettingRestrictions: (setting: string) => ToolSettingRestrictions;
  importFileAsAsset: (file: File) => void; // EditorWrapper provides File, BuiltinLibrary casts to Blob
  builtinPreviews: unknown; // EditorWrapper: Map<string, BuiltinPreview>, BuiltinLibrary: Record<string, BuiltinLibraryPreview>
  addFileToBuiltinPreviews: (file: File) => void; // EditorWrapper signature, BuiltinLibrary expects (filename: string, blob: Blob)
  isAssetInLibrary: (asset: WickAsset) => boolean; // EditorWrapper signature, BuiltinLibrary expects (filename: string)
  editorVersion: string;
  openProjectFileDialog: () => void;
  openNewProjectConfirmation: () => void;
  localSavedFiles: LocalFileEntry[]; // EditorWrapper type, SavedProjects expects SavedProject[]
  loadLocalWickFile: (file: LocalFileEntry) => void; // EditorWrapper type, SavedProjects expects SavedProject
  deleteLocalWickFile: (file: LocalFileEntry) => void; // EditorWrapper type, SavedProjects expects SavedProject
  reloadSavedWickFiles: () => void;
  getRenderSize: () => string;
  loadAutosavedProject: (callback: () => void) => void;
  clearAutoSavedProject: (callback: () => void) => void;
  queueModal: (name: string) => void;
  exportProjectAsGif: () => void;
  exportProjectAsStandaloneZip: () => void;
  exportProjectAsStandaloneHTML: () => void;
  exportProjectAsImageSequence: () => void;
  exportProjectAsAudioTrack: () => void;
  exportProjectAsImageSVG: () => void;
}

const ModalHandler: React.FC<ModalHandlerProps> = (props) => {
  const isMobile = props.getRenderSize() === "small";
  return (
    <div>
      <MakeAnimated
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'MakeAnimated'}
        createClipFromSelection={props.createClipFromSelection}
      />
      <MakeInteractive
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'MakeInteractive'}
        createClipFromSelection={props.createClipFromSelection}
        createButtonFromSelection={props.createButtonFromSelection}
      />
      <AutosaveWarning
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'AutosaveWarning'}
        loadAutosavedProject={props.loadAutosavedProject}
        clearAutoSavedProject={props.clearAutoSavedProject}
      />
      <WelcomeMessage
        isMobile={isMobile}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'WelcomeMessage'}
        project={props.project}
        editorVersion={props.editorVersion}
      />
      <ExportOptions
        isMobile={isMobile}
        queueModal={props.queueModal}
        toggle={props.closeActiveModal}
        exportProjectAsGif={props.exportProjectAsGif}
        exportProjectAsStandaloneZip={props.exportProjectAsStandaloneZip}
        exportProjectAsStandaloneHTML={props.exportProjectAsStandaloneHTML}
        exportProjectAsVideo={props.exportProjectAsVideo}
        exportProjectAsImageSequence={props.exportProjectAsImageSequence}
        exportProjectAsAudioTrack={props.exportProjectAsAudioTrack}
        exportProjectAsImageSVG={props.exportProjectAsImageSVG}
        open={props.activeModalName === 'ExportOptions'}
        projectName={props.project.name}
        project={props.project}
      />
      <GeneralWarning
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'GeneralWarning'}
        info={props.warningModalInfo as any || {
          title: '',
          description: '',
          acceptText: '',
          acceptIcon: '',
          acceptAction: () => { },
          cancelText: '',
          cancelIcon: '',
          cancelAction: () => { },
          finalAction: () => { },
        }}
      />
      <ExportMedia
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'ExportMedia'}
        renderProgress={props.renderProgress}
        renderType={props.renderType}
        renderStatusMessage={props.renderStatusMessage}
        project={props.project}
      />
      <SettingsModal
        isMobile={isMobile}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'SettingsModal'}
        project={props.project}
        updateProjectSettings={props.updateProjectSettings}
        addCustomHotKeys={props.addCustomHotKeys}
        resetCustomHotKeys={props.resetCustomHotKeys}
        keyMap={props.keyMap}
        keyMapGroups={props.keyMapGroups}
        customHotKeys={props.customHotKeys}
        colorPickerType={props.colorPickerType}
        changeColorPickerType={props.changeColorPickerType}
        updateLastColors={props.updateLastColors}
        lastColorsUsed={props.lastColorsUsed}
        toast={props.toast}
        createCombinedHotKeyMap={props.createCombinedHotKeyMap}
        getToolSetting={props.getToolSetting}
        setToolSetting={props.setToolSetting}
        getToolSettingRestrictions={props.getToolSettingRestrictions}
      />
      <BuiltinLibrary
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'BuiltinLibrary'}
        project={props.project}
        importFileAsAsset={props.importFileAsAsset as any}
        builtinPreviews={props.builtinPreviews as any}
        addFileToBuiltinPreviews={props.addFileToBuiltinPreviews as any}
        isAssetInLibrary={props.isAssetInLibrary as any}
      />
      <EditorInfo
        openModal={props.openModal}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'EditorInfo'}
        editorVersion={props.editorVersion}
      />
      <OpenSourceNotices
        isMobile={isMobile}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'OpenSourceNotices'}
      />
      <MobileMenu
        openProjectFileDialog={props.openProjectFileDialog}
        openNewProjectConfirmation={props.openNewProjectConfirmation}
        openModal={props.openModal}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'MobileMenuModal'}
      />
      <SavedProjects
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'SavedProjects'}
        localSavedFiles={props.localSavedFiles as any}
        loadLocalWickFile={props.loadLocalWickFile as any}
        deleteLocalWickFile={props.deleteLocalWickFile as any}
        reloadSavedWickFiles={props.reloadSavedWickFiles}
        openWarningModal={props.openWarningModal as any}
      />
      <SimpleProjectSettings
        updateProjectSettings={props.updateProjectSettings}
        project={props.project}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'SimpleProjectSettings'} />

      <SupportUs
        isMobile={isMobile}
        toggle={props.closeActiveModal}
        open={props.activeModalName === 'SupportUs'}
      />
    </div>
  );
};

export default ModalHandler
