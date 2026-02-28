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
import { useDrag } from "react-dnd";
import DragDropTypes from "Editor/DragDropTypes";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import classNames from "classnames";

export interface AssetData {
  uuid: string;
  name: string;
  classname: string;
  files?: File[];
}

interface AssetProps {
  asset: AssetData;
  isSelected: boolean;
  onClick: () => void;
  addSoundToActiveFrame: (asset: AssetData) => void;
  importProjectAsWickFile: (file: File) => void;
  createAssets: (files: File[], data: unknown[]) => void;
  createImageFromAsset: (uuid: string, x: number, y: number, center?: boolean) => void;
  clearSelection: () => void;
  selectObjects: (objects: AssetData[]) => void;
  deleteSelectedObjects: () => void;
}

const Asset: React.FC<AssetProps> = (props) => {
  const assetType = DragDropTypes.GET_ASSET_TYPE(props);

  const [, dragRef] = useDrag({
    type: assetType,
    item: {
      uuid: props.asset.uuid,
    },
  });

  const getIcon = (classname: string): string => {
    if (classname === "ImageAsset") {
      return "image";
    } else if (classname === "SoundAsset") {
      return "sound";
    } else if (classname === "ClipAsset") {
      return "clip";
    } else if (classname === "ButtonAsset") {
      return "button";
    } else if (classname === "FontAsset") {
      return "font";
    } else if (classname === "SVGAsset") {
      return "svg";
    } else {
      return "asset";
    }
  };

  const addToCanvas = (): void => {
    const draggedItem = props.asset;
    if (draggedItem.files && draggedItem.files.length > 0) {
      // Dropped a file from native filesystem
      const firstFile = draggedItem.files[0];
      if (firstFile && firstFile.name.endsWith(".wick")) {
        // Wick Project (.wick file)
        props.importProjectAsWickFile(firstFile);
      } else {
        // Assets (images, sounds, etc)
        props.createAssets(draggedItem.files, []);
      }
    } else {
      // Dropped an asset from the asset library
      props.createImageFromAsset(draggedItem.uuid, 0, 0, true);
    }
  };

  const renderAddButton = (): JSX.Element => {
    if (props.asset.classname === "SoundAsset") {
      return (
        <span className="asset-button add mr-1 h-7 w-[calc(100%-33px)]">
          <ActionButton
            className="add !h-7 !w-[calc(100%-33px)]"
            color="green"
            text="Add to Frame"
            action={() => props.addSoundToActiveFrame(props.asset)}
          />
        </span>
      );
    } else {
      return (
        <span className="asset-button add mr-1 h-7 w-[calc(100%-33px)]">
          <ActionButton
            className="add !h-7 !w-[calc(100%-33px)]"
            color="green"
            text="Add to Canvas"
            action={addToCanvas}
          />
        </span>
      );
    }
  };

  const icon = getIcon(props.asset.classname);

  return (
    <div
      ref={dragRef}
      className={classNames(
        "asset-item mt-1 ml-1 mr-1 w-[calc(100%-8px)] overflow-hidden rounded-[2px] border-0 bg-editor-secondary px-1 text-left align-middle leading-7 text-white transition-[background-color,color,margin,border] duration-200 has-hover:cursor-grab has-hover:bg-editor-primary has-hover:text-white",
        {
          "asset-selected !m-[2px] !border-2 !border-solid !border-wick-green !bg-editor-primary !text-white":
            props.isSelected,
        }
      )}
    >
      <button
        className="select w-full border-none bg-transparent pl-0 text-left text-inherit"
        onClick={props.onClick}
      >
        <div className="asset-name-text ml-1 h-full overflow-hidden whitespace-nowrap">
          <span>
            <ToolIcon className="asset-icon mr-[5px] inline-flex h-[22.4px] w-[22.4px]" name={icon} />
          </span>
          <span>{props.asset.name}</span>
        </div>
      </button>
      {props.isSelected && (
        <div className="asset-buttons-container my-1 flex flex-1 flex-row items-center justify-center">
          {renderAddButton()}
          <span className="asset-button delete h-7 w-[25px]">
            <ActionButton
              className="delete !h-7 !w-[25px] !p-0"
              color="red"
              icon="delete-black"
              action={() => {
                props.clearSelection();
                props.selectObjects([props.asset]);
                props.deleteSelectedObjects();
              }}
            />
          </span>
        </div>
      )}
    </div>
  );
};

export default Asset;
