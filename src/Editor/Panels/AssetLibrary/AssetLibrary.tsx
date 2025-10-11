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

import { Component } from "react";
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

interface AssetLibraryState {
    filterText: string;
}

class AssetLibrary extends Component<AssetLibraryProps, AssetLibraryState> {
    state: AssetLibraryState = {
        filterText: "",
    };

    openFileDialog = (): void => {
        this.props.openImportAssetFileDialog();
    };

    openBuiltinAssetLibrary = (): void => {
        this.props.openModal("BuiltinLibrary");
    };

    updateFilter = (value: string | number): void => {
        const text = typeof value === "string" ? value : String(value);
        this.setState({ filterText: text });
    };

    filterArray = (assets: AssetLibraryItem[]): AssetLibraryItem[] => {
        const filterText = this.state.filterText.trim().toLowerCase();
        if (!filterText) {
            return assets.filter((item) => !item.isGifImage);
        }

        return assets.filter((item) => {
            if (item.isGifImage) {
                return false;
            }

            const name = typeof item.name === "string" ? item.name : "";
            return name.toLowerCase().includes(filterText);
        });
    };

    sortAssets = (assets: AssetLibraryItem[]): AssetLibraryItem[] => {
        return [...assets].sort((a, b) => {
            const aName = typeof a.name === "string" ? a.name : "";
            const bName = typeof b.name === "string" ? b.name : "";
            return aName.localeCompare(bName);
        });
    };

    makeNode = (assetObject: AssetLibraryItem, index: number): JSX.Element => {
        const key = typeof assetObject.uuid === "string" ? assetObject.uuid : index;

        return (
            <Asset
                key={key}
                asset={assetObject}
                isSelected={this.props.isObjectSelected(assetObject)}
                onClick={() => {
                    this.props.clearSelection();
                    this.props.selectObjects([assetObject]);
                }}
                createAssets={this.props.createAssets}
                importProjectAsWickFile={this.props.importProjectAsWickFile}
                createImageFromAsset={this.props.createImageFromAsset}
                deleteSelectedObjects={this.props.deleteSelectedObjects}
                clearSelection={this.props.clearSelection}
                selectObjects={this.props.selectObjects}
                addSoundToActiveFrame={this.props.addSoundToActiveFrame}
            />
        );
    };

    renderTitle = (): JSX.Element => {
        return (
            <div className="asset-library-title-container">
                <div className="asset-library-title-text">Asset Library</div>
                <div className="btn-asset-upload">
                    <ActionButton
                        color="upload"
                        action={this.openBuiltinAssetLibrary}
                        id="button-asset-builtin"
                        icon="add"
                        tooltip="Add Builtin Asset"
                    />
                </div>
                <div className="btn-asset-builtin">
                    <ActionButton
                        color="upload"
                        action={this.openFileDialog}
                        id="button-asset-upload"
                        icon="upload"
                        tooltip="Upload Assets"
                    />
                </div>
            </div>
        );
    };

    render(): JSX.Element {
        const assets = Array.isArray(this.props.assets)
            ? this.props.assets
            : [];

        const filteredAssets = this.filterArray(assets);
        const sortedFilteredAssets = this.sortAssets(filteredAssets);

        return (
            <div className="docked-pane asset-library" aria-label="Asset Library">
                {this.renderTitle()}
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
                            onChange={this.updateFilter}
                            value={this.state.filterText}
                        />
                    </div>
                    <div className="asset-library-asset-container">
                        {sortedFilteredAssets.map(this.makeNode)}
                    </div>
                </div>
            </div>
        );
    }
}

export default AssetLibrary;
