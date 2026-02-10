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

import React, { type ComponentProps } from 'react';
import type { HotKeyMap } from "Editor/types/hotkeys";
import type {
  ProjectSettings,
  CustomHotKeys,
  WarningModalInfo,
  LocalFileEntry,
  ToolSettingRestrictions,
  ColorPickerType,
} from "../../types";
import { isGeneralWarningInfo } from "../../types";

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
type BuiltinLibraryProps = ComponentProps<typeof BuiltinLibrary>;
type SavedProjectsProps = ComponentProps<typeof SavedProjects>;
type SettingsModalProps = ComponentProps<typeof SettingsModal>;
type GeneralWarningProps = ComponentProps<typeof GeneralWarning>;
type SavedProjectItem = Parameters<
  NonNullable<SavedProjectsProps["loadLocalWickFile"]>
>[0];

const FALLBACK_WARNING_INFO: GeneralWarningProps["info"] = {
  title: "",
  description: "",
  acceptText: "",
  acceptIcon: "",
  acceptAction: () => {},
  cancelText: "",
  cancelIcon: "",
  cancelAction: () => {},
  finalAction: () => {},
};

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
  project: SettingsModalProps["project"];
  updateProjectSettings: (settings: Partial<ProjectSettings>) => void;
  addCustomHotKeys: (keys: CustomHotKeys) => void;
  resetCustomHotKeys: () => void;
  keyMap: HotKeyMap;
  keyMapGroups: unknown;
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
  builtinPreviews: unknown;
  addFileToBuiltinPreviews: (file: File) => void;
  isAssetInLibrary: (filename: string) => boolean;
  editorVersion: string;
  openProjectFileDialog: () => void;
  openNewProjectConfirmation: () => void;
  localSavedFiles: LocalFileEntry[];
  loadLocalWickFile: (file: LocalFileEntry) => void;
  deleteLocalWickFile: (file: LocalFileEntry) => void;
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
  const warningInfo = props.warningModalInfo && isGeneralWarningInfo(props.warningModalInfo)
    ? props.warningModalInfo
    : FALLBACK_WARNING_INFO;

  const createFileFromBlob = (blob: Blob, fallbackName: string): File => {
    if (blob instanceof File) {
      return blob;
    }
    const blobWithName = blob as Blob & { name?: string };
    const name = blobWithName.name ?? fallbackName;
    return new File([blob], name, { type: blob.type || "application/octet-stream" });
  };

  const resolveLocalFileEntry = (savedProject: SavedProjectItem): LocalFileEntry | undefined => {
    return props.localSavedFiles.find((entry) => entry.name === savedProject.name);
  };
  const resolvedKeyMapGroups: NonNullable<SettingsModalProps["keyMapGroups"]> =
    props.keyMapGroups &&
    typeof props.keyMapGroups === "object" &&
    !Array.isArray(props.keyMapGroups)
      ? (props.keyMapGroups as NonNullable<SettingsModalProps["keyMapGroups"]>)
      : {};
  const resolvedBuiltinPreviews: BuiltinLibraryProps["builtinPreviews"] =
    props.builtinPreviews instanceof Map
      ? Array.from(props.builtinPreviews.entries()).reduce<
          BuiltinLibraryProps["builtinPreviews"]
        >((acc, [key, preview]) => {
          if (
            preview &&
            typeof preview === "object" &&
            "blob" in preview &&
            (preview as { blob?: unknown }).blob instanceof Blob
          ) {
            acc[key] = preview as BuiltinLibraryProps["builtinPreviews"][string];
          }
          return acc;
        }, {})
      : props.builtinPreviews &&
          typeof props.builtinPreviews === "object" &&
          !Array.isArray(props.builtinPreviews)
        ? (props.builtinPreviews as BuiltinLibraryProps["builtinPreviews"])
        : {};

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
        info={warningInfo}
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
        keyMapGroups={resolvedKeyMapGroups}
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
        importFileAsAsset={(blob: Blob) => {
          props.importFileAsAsset(createFileFromBlob(blob, "builtin-asset"));
        }}
        builtinPreviews={resolvedBuiltinPreviews}
        addFileToBuiltinPreviews={(filename: string, blob: Blob) => {
          props.addFileToBuiltinPreviews(createFileFromBlob(blob, filename));
        }}
        isAssetInLibrary={(filename: string) => props.isAssetInLibrary(filename)}
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
        localSavedFiles={props.localSavedFiles}
        loadLocalWickFile={(project) => {
          const entry = resolveLocalFileEntry(project);
          if (entry) {
            props.loadLocalWickFile(entry);
          }
        }}
        deleteLocalWickFile={(project) => {
          const entry = resolveLocalFileEntry(project);
          if (entry) {
            props.deleteLocalWickFile(entry);
          }
        }}
        reloadSavedWickFiles={props.reloadSavedWickFiles}
        openWarningModal={props.openWarningModal}
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
