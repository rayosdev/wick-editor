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
import { DragSource, ConnectDragSource } from "react-dnd";
import "./_asset.scss";
import DragDropTypes from "Editor/DragDropTypes";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import classNames from "classnames";

export interface AssetData {
  uuid: string;
  name: string;
  classname: string;
  isGifImage?: boolean;
  files?: File[];
}

export interface CreateAssetOptions {
  create?: boolean;
  location?: {
    x?: number;
    y?: number;
  };
}

export type CreateAssetsFn = (
  acceptedFiles: File[],
  rejectedFiles: File[],
  options?: CreateAssetOptions
) => void;

export type CreateImageFromAssetFn = (
  uuid: string,
  x: number,
  y: number,
  center?: boolean
) => void;

interface MobileAssetProps {
  asset: AssetData;
  isSelected: boolean;
  onClick: () => void;
  addSoundToActiveFrame: (asset: AssetData) => void;
  importProjectAsWickFile: (file: File) => void;
  createAssets: CreateAssetsFn;
  createImageFromAsset: CreateImageFromAssetFn;
  clearSelection: () => void;
  selectObjects: (objects: AssetData[]) => void;
  deleteSelectedObjects: () => void;
  connectDragSource?: ConnectDragSource;
}

const assetSource = {
  beginDrag(props: MobileAssetProps) {
    // Return the data describing the dragged item
    const info = {
      uuid: props.asset.uuid,
    };

    return info;
  },
};

/**
 * Specifies which props to inject into your component.
 */
interface DragSourceConnector {
  dragSource: () => ConnectDragSource;
}

function collect(connect: DragSourceConnector) {
  return {
    connectDragSource: connect.dragSource(),
  };
}

const Asset: React.FC<MobileAssetProps> = (props) => {
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

  // These props are injected by React DnD, as defined by the `collect` function above:
  const { connectDragSource } = props;

  const icon = getIcon(props.asset.classname);

  if (!connectDragSource) return null;

  return connectDragSource(
    <div
      className={classNames("asset-item", {
        "asset-selected": props.isSelected,
      })}
    >
      <button className="select" onClick={props.onClick}>
        <div className="asset-name-text">
          <span>
            <ToolIcon className="asset-icon" name={icon} />
          </span>
          <span>{props.asset.name}</span>
        </div>
      </button>
      {props.isSelected && (
        <div className="asset-buttons-container">
          {props.asset.classname === "SoundAsset" && (
            <span className="asset-button add">
              <ActionButton
                className="add"
                color="green"
                text="Add"
                action={() =>
                  props.addSoundToActiveFrame(props.asset)
                }
              />
            </span>
          )}
          {props.asset.classname !== "SoundAsset" && (
            <span className="asset-button add">
              <ActionButton
                className="add"
                color="green"
                text="Add"
                action={addToCanvas}
              />
            </span>
          )}
          <span className="asset-button delete">
            <ActionButton
              className="delete"
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

export default DragSource(
  DragDropTypes.GET_ASSET_TYPE,
  assetSource,
  collect
)(Asset);
