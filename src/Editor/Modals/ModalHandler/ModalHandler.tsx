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

interface ModalHandlerProps {
  activeModalName: string | null;
  openModal: (name: string) => void;
  closeActiveModal: () => void;
  createClipFromSelection: (name: string) => void;
  createButtonFromSelection: (name: string) => void;
  createAnimationFromSelection: (name: string) => void;
  openWarningModal: (info: any) => void;
  warningModalInfo: any;
  exportProjectAsVideo: () => void;
  renderProgress: number;
  renderType: "video" | "gif" | "image sequence";
  renderStatusMessage: string;
  project: any;
  updateProjectSettings: (settings: any) => void;
  addCustomHotKeys: (keys: any) => void;
  resetCustomHotKeys: () => void;
  keyMap: any;
  keyMapGroups: any;
  customHotKeys: any;
  colorPickerType: string;
  changeColorPickerType: (type: string) => void;
  updateLastColors: (color: string) => void;
  lastColorsUsed: string[];
  toast: (message: string) => void;
  createCombinedHotKeyMap: () => any;
  getToolSetting: (setting: string) => any;
  setToolSetting: (setting: string, value: any) => void;
  getToolSettingRestrictions: (setting: string) => any;
  importFileAsAsset: (file: any) => void;
  builtinPreviews: any;
  addFileToBuiltinPreviews: (file: any) => void;
  isAssetInLibrary: (asset: any) => boolean;
  editorVersion: string;
  openProjectFileDialog: () => void;
  openNewProjectConfirmation: () => void;
  localSavedFiles: any[];
  loadLocalWickFile: (file: any) => void;
  deleteLocalWickFile: (file: any) => void;
  reloadSavedWickFiles: () => void;
  getRenderSize: () => string;
  loadAutosavedProject: any;
  clearAutoSavedProject: any;
  queueModal: (name: string) => void;
  exportProjectAsGif: () => void;
  exportProjectAsStandaloneZip: () => void;
  exportProjectAsStandaloneHTML: () => void;
  exportProjectAsImageSequence: () => void;
  exportProjectAsAudioTrack: () => void;
  exportProjectAsImageSVG: () => void;
}

class ModalHandler extends Component<ModalHandlerProps> {
  render(): JSX.Element {
    const isMobile = this.props.getRenderSize() === "small";
    return (
      <div>
        <MakeAnimated
            toggle={this.props.closeActiveModal}
            open={this.props.activeModalName === 'MakeAnimated'}
            createClipFromSelection={this.props.createClipFromSelection}
          />
        <MakeInteractive
            toggle={this.props.closeActiveModal}
            open={this.props.activeModalName === 'MakeInteractive'}
            createClipFromSelection={this.props.createClipFromSelection}
            createButtonFromSelection={this.props.createButtonFromSelection}
          />
        <AutosaveWarning
            toggle={this.props.closeActiveModal}
            open={this.props.activeModalName === 'AutosaveWarning'}
            loadAutosavedProject={this.props.loadAutosavedProject}
            clearAutoSavedProject={this.props.clearAutoSavedProject}
        />
        <WelcomeMessage
          isMobile={isMobile}
          openModal={this.props.openModal}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'WelcomeMessage'}
          editorVersion={this.props.editorVersion}
        />
        <ExportOptions
          isMobile={isMobile}
          openModal={this.props.openModal}
          closeActiveModal={this.props.closeActiveModal}
          queueModal={this.props.queueModal}
          toggle={this.props.closeActiveModal}
          exportProjectAsGif={this.props.exportProjectAsGif}
          exportProjectAsStandaloneZip={this.props.exportProjectAsStandaloneZip}
          exportProjectAsStandaloneHTML={this.props.exportProjectAsStandaloneHTML}
          exportProjectAsVideo={this.props.exportProjectAsVideo}
          exportProjectAsImageSequence={this.props.exportProjectAsImageSequence}
          exportProjectAsAudioTrack={this.props.exportProjectAsAudioTrack}
          exportProjectAsImageSVG={this.props.exportProjectAsImageSVG}
          open={this.props.activeModalName === 'ExportOptions'}
          projectName={this.props.project.name}
          project={this.props.project}
          />
        <GeneralWarning
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'GeneralWarning'}
          info={this.props.warningModalInfo}
        />
        <ExportMedia
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'ExportMedia'}
          renderProgress={this.props.renderProgress}
          renderType={this.props.renderType}
          renderStatusMessage={this.props.renderStatusMessage}
          project={this.props.project}
        />
        <SettingsModal
          isMobile={isMobile}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'SettingsModal'}
          project={this.props.project}
          updateProjectSettings={this.props.updateProjectSettings}
          addCustomHotKeys={this.props.addCustomHotKeys}
          resetCustomHotKeys={this.props.resetCustomHotKeys}
          keyMap={this.props.keyMap}
          keyMapGroups={this.props.keyMapGroups}
          customHotKeys={this.props.customHotKeys}
          colorPickerType={this.props.colorPickerType}
          changeColorPickerType={this.props.changeColorPickerType}
          updateLastColors={this.props.updateLastColors}
          lastColorsUsed={this.props.lastColorsUsed}
          toast={this.props.toast}
          createCombinedHotKeyMap={this.props.createCombinedHotKeyMap}
          getToolSetting={this.props.getToolSetting}
          setToolSetting={this.props.setToolSetting}
          getToolSettingRestrictions={this.props.getToolSettingRestrictions}
        />
        <BuiltinLibrary
          openModal={this.props.openModal}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'BuiltinLibrary'}
          project={this.props.project}
          importFileAsAsset={this.props.importFileAsAsset}
          builtinPreviews={this.props.builtinPreviews}
          addFileToBuiltinPreviews={this.props.addFileToBuiltinPreviews}
          isAssetInLibrary={this.props.isAssetInLibrary}
        />
        <EditorInfo
          openModal={this.props.openModal}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'EditorInfo'}
          editorVersion={this.props.editorVersion}
        />
        <OpenSourceNotices
          isMobile={isMobile}
          openModal={this.props.openModal}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'OpenSourceNotices'}
          />
        <MobileMenu
          openProjectFileDialog={this.props.openProjectFileDialog}
          openNewProjectConfirmation={this.props.openNewProjectConfirmation}
          openModal={this.props.openModal}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'MobileMenuModal'}
        />
        <SavedProjects
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'SavedProjects'}
          localSavedFiles={this.props.localSavedFiles}
          loadLocalWickFile={this.props.loadLocalWickFile}
          deleteLocalWickFile={this.props.deleteLocalWickFile}
          reloadSavedWickFiles={this.props.reloadSavedWickFiles}
          openWarningModal={this.props.openWarningModal}
          />
        <SimpleProjectSettings 
          updateProjectSettings={this.props.updateProjectSettings}
          project={this.props.project}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'SimpleProjectSettings'}/>

        <SupportUs
          isMobile={isMobile}
          toggle={this.props.closeActiveModal}
          open={this.props.activeModalName === 'SupportUs'}
          />
      </div>
    );
  }
}

export default ModalHandler
