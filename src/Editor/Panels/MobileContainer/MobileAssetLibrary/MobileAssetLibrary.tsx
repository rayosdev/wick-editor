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

import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Asset from './Asset/Asset';
import type {
  AssetData,
  CreateAssetsFn,
  CreateImageFromAssetFn,
} from './Asset/Asset';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';
import WickInput from 'Editor/Util/WickInput/WickInput';
import ToolIcon from 'Editor/Util/ToolIcon/ToolIcon';
import type { ToastType, ToastOptions, WickProject } from 'Editor/types';

import './_mobileassetlibrary.scss';

interface MobileAssetLibraryProps {
  assets: AssetData[];
  openImportAssetFileDialog: () => void;
  openModal: (modalName: string) => void;
  isObjectSelected: (obj: AssetData) => boolean;
  clearSelection: () => void;
  selectObjects: (objects: AssetData[]) => void;
  createAssets: CreateAssetsFn;
  importProjectAsWickFile: (file: File) => void;
  createImageFromAsset: CreateImageFromAssetFn;
  deleteSelectedObjects: () => void;
  addSoundToActiveFrame: (sound: AssetData) => void;
  projectData?: WickProject;
  toast?: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

const MobileAssetLibrary: React.FC<MobileAssetLibraryProps> = (props) => {
  const [filterText, setFilterText] = useState('');

  const openFileDialog = (): void => {
    props.openImportAssetFileDialog();
  };

  const openBuiltinAssetLibrary = (): void => {
    props.openModal('BuiltinLibrary');
  };

  const updateFilter = (text: string): void => {
    setFilterText(text);
  };

  const filterArray = (array: AssetData[]): AssetData[] => {
    const filterTextLower = filterText.toLowerCase();
    return array.filter(item => {
      return !item.isGifImage && item.name.toLowerCase().includes(filterTextLower);
    });
  };

  const makeNode = (assetObject: AssetData, i: number): JSX.Element => {
    return (
      <Asset
        key={i}
        asset={assetObject}
        isSelected={props.isObjectSelected(assetObject)}
        onClick={() => {
          props.clearSelection();
          props.selectObjects([assetObject]);
        }}
        createAssets={props.createAssets}
        importProjectAsWickFile={props.importProjectAsWickFile}
        createImageFromAsset={props.createImageFromAsset}
        deleteSelectedObjects={props.deleteSelectedObjects}
        clearSelection={props.clearSelection}
        selectObjects={props.selectObjects}
        addSoundToActiveFrame={props.addSoundToActiveFrame}
      />
    );
  };

  /**
   * Sorts an array of assets by their names.
   * @param  {Wick.Asset[]} assets An array of Wick.Asset objects.
   * @return {Wick.Asset[]}        Returns a sorted array of Wick.Assets.
   */
  const sortAssets = (assets: AssetData[]): AssetData[] => {
    const copiedAssets: AssetData[] = [...assets];

    // Perform alphabetic sort.
    copiedAssets.sort((a, b) => a.name.localeCompare(b.name));
    return copiedAssets;
  };

  const renderLeftSection = (): JSX.Element => {
    return (
      <div className="mobile-asset-library-left-container">
        <div className="mobile-asset-library-filter">
          <div className="mobile-asset-library-filter-icon">
            <ToolIcon name="search" />
          </div>
          <WickInput
            id="mobile-asset-library-filter-input"
            aria-label="filter"
            placeholder="filter..."
            type="text"
            onChange={updateFilter}
            value={filterText} />
        </div>
        <div className="mobile-btn-asset-builtin">
          <ActionButton
            color="green"
            action={openBuiltinAssetLibrary}
            id="button-asset-builtin"
            icon="add-dark"
            iconClassName="mobile-asset-library-icon"
            text="Add Builtin"
            tooltip="Add Builtin" />
        </div>
        <div className="mobile-btn-asset-upload">
          <ActionButton
            color="inspector"
            action={openFileDialog}
            id="button-asset-upload"
            icon="upload-dark"
            iconClassName="mobile-asset-library-icon"
            text="Upload"
            tooltip="Upload" />
        </div>
      </div>
    );
  };

  const filteredAssets = filterArray(props.assets);
  const sortedFilteredAssets = sortAssets(filteredAssets);

  return (
    <div className="docked-pane mobile-asset-library" aria-label="Asset Library">
      {renderLeftSection()}
      <div className="mobile-asset-library-right-container">
        <div className="mobile-asset-library-asset-container">
          {sortedFilteredAssets.map(makeNode)}
        </div>
      </div>
    </div>
  );
};

export default MobileAssetLibrary
