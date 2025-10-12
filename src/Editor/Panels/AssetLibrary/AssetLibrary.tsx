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

import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Asset from "./Asset/Asset";
import type { AssetData } from "./Asset/Asset";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import WickInput from "Editor/Util/WickInput/WickInput";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import type { WickProject, ToastType, ToastOptions } from "Editor/types";

import "./_assetlibrary.scss";

type AssetLibraryItem = AssetData & {
    isGifImage?: boolean;
};

interface AssetLibraryProps {
    assets?: AssetLibraryItem[] | null;
    projectData?: WickProject;
    openImportAssetFileDialog: () => void;
    openModal: (modalName: string) => void;
    selectObjects: (objects: AssetData[]) => void;
    clearSelection: () => void;
    isObjectSelected: (asset: AssetData) => boolean;
    createAssets: (
        files: File[],
        data: unknown[], // Asset data from files (mixed types)
        options?: {
            create?: boolean;
            location?: { x: number; y: number } | null;
        }
    ) => void;
    importProjectAsWickFile: (file: File) => void;
    createImageFromAsset: (
        uuid: string,
        x: number,
        y: number,
        center?: boolean
    ) => void;
    deleteSelectedObjects: () => void;
    addSoundToActiveFrame: (asset: AssetData) => void;
    toast?: (message: string, type?: ToastType, options?: ToastOptions) => void;
}

const AssetLibrary: React.FC<AssetLibraryProps> = (props) => {
    const [filterText, setFilterText] = useState("");

    const openFileDialog = (): void => {
        props.openImportAssetFileDialog();
    };

    const openBuiltinAssetLibrary = (): void => {
        props.openModal("BuiltinLibrary");
    };

    const updateFilter = (value: string | number): void => {
        const text = typeof value === "string" ? value : String(value);
        setFilterText(text);
    };

    const filterArray = (assets: AssetLibraryItem[]): AssetLibraryItem[] => {
        const filterTextTrimmed = filterText.trim().toLowerCase();
        if (!filterTextTrimmed) {
            return assets.filter((item) => !item.isGifImage);
        }

        return assets.filter((item) => {
            if (item.isGifImage) {
                return false;
            }

            const name = typeof item.name === "string" ? item.name : "";
            return name.toLowerCase().includes(filterTextTrimmed);
        });
    };

    const sortAssets = (assets: AssetLibraryItem[]): AssetLibraryItem[] => {
        return [...assets].sort((a, b) => {
            const aName = typeof a.name === "string" ? a.name : "";
            const bName = typeof b.name === "string" ? b.name : "";
            return aName.localeCompare(bName);
        });
    };

    const makeNode = (assetObject: AssetLibraryItem, index: number): JSX.Element => {
        const key = typeof assetObject.uuid === "string" ? assetObject.uuid : index;

        return (
            <Asset
                key={key}
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

    const renderTitle = (): JSX.Element => {
        return (
            <div className="asset-library-title-container">
                <div className="asset-library-title-text">Asset Library</div>
                <div className="btn-asset-upload">
                    <ActionButton
                        color="upload"
                        action={openBuiltinAssetLibrary}
                        id="button-asset-builtin"
                        icon="add"
                        tooltip="Add Builtin Asset"
                    />
                </div>
                <div className="btn-asset-builtin">
                    <ActionButton
                        color="upload"
                        action={openFileDialog}
                        id="button-asset-upload"
                        icon="upload"
                        tooltip="Upload Assets"
                    />
                </div>
            </div>
        );
    };

    const assets = Array.isArray(props.assets)
        ? props.assets
        : [];

    const filteredAssets = filterArray(assets);
    const sortedFilteredAssets = sortAssets(filteredAssets);

    return (
        <div className="docked-pane asset-library" aria-label="Asset Library">
            {renderTitle()}
            <div className="asset-library-body">
                <div className="asset-library-filter">
                    <div className="asset-library-filter-icon">
                        <ToolIcon name="search" />
                    </div>
                    <WickInput
                        id="asset-library-filter-input"
                        aria-label="filter"
                        placeholder="filter..."
                        type="text"
                        onChange={updateFilter}
                        value={filterText}
                    />
                </div>
                <div className="asset-library-asset-container">
                    {sortedFilteredAssets.map(makeNode)}
                </div>
            </div>
        </div>
    );
};

export default AssetLibrary;
