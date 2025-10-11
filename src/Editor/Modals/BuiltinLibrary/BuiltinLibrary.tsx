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
import "bootstrap/dist/css/bootstrap.min.css";
import WickModal from "Editor/Modals/WickModal/WickModal";
import TabbedInterface from "Editor/Util/TabbedInterface/TabbedInterface";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import AudioPlayer from "Editor/Util/AudioPlayer/AudioPlayer";

import wickobjects from "./wickobjects.js";
import sounds from "./sounds.js";

import "./_builtinlibrary.scss";

interface BuiltinAsset {
  file: string;
  name: string;
  icon?: string;
}

interface BuiltinPreview {
  blob: Blob;
  src?: string;
}

interface BuiltinLibraryProps {
  open: boolean;
  toggle: () => void;
  project: any;
  importFileAsAsset: (file: Blob) => void;
  builtinPreviews: Record<string, BuiltinPreview>;
  addFileToBuiltinPreviews: (filename: string, blob: Blob) => void;
  isAssetInLibrary: (filename: string) => boolean;
}

const ROOT_ASSET_PATH = (() => {
  // Default PUBLIC_URL to empty string so we don't render "undefined/..." in dev
  const base =
    typeof process !== "undefined" && process.env && process.env.PUBLIC_URL
      ? process.env.PUBLIC_URL
      : "";
  return base.replace(/\/$/, "") + "/builtinlibrary/";
})();

const BuiltinLibrary: React.FC<BuiltinLibraryProps> = ({
  open,
  toggle,
  importFileAsAsset,
  builtinPreviews,
  addFileToBuiltinPreviews,
  isAssetInLibrary
}) => {
  //Fetch file, add to builtinPreviews
  const importForPreview = (asset: BuiltinAsset, callback?: (blob: Blob) => void): void => {
    const path = ROOT_ASSET_PATH + asset.file;

    fetch(path)
      .then((response) => response.blob())
      .then((blob) => {
        (blob as any).lastModifiedDate = new Date();
        (blob as any).name = asset.file.split("/").pop();

        addFileToBuiltinPreviews(asset.file, blob);

        callback && callback(blob);
      })
      .catch((error) => {
        console.error(
          `Error while importing builtin asset (${asset.name},${asset.file}): `
        );
        console.log(error);
      });
  };

  //Fetch file to builtinPreviews if necessary, then load into Asset Library
  const createWickAsset = (asset: BuiltinAsset): void => {
    if (!builtinPreviews[asset.file]) {
      importForPreview(asset, (blob: Blob) => {
        importFileAsAsset(blob);
      });
    } else {
      const preview = builtinPreviews[asset.file];
      if (preview) {
        importFileAsAsset(preview.blob);
      }
    }
  };

  const renderBuiltinAsset = (asset: BuiltinAsset): JSX.Element => {
    return (
      <div key={asset.file} className="builtin-library-asset">
        <div className="builtin-library-asset-name">{asset.name}</div>

        <div className="builtin-library-asset-icon-container">
          <img
            alt="Builtin Asset Icon"
            src={ROOT_ASSET_PATH + asset.icon}
            className="builtin-library-asset-icon"
          />
        </div>

        {isAssetInLibrary(asset.file.split("/").pop() || "") ? (
          <ActionButton
            className="add-as-asset-button"
            action={() => { }}
            text="Already Added"
            color="gray"
          />
        ) : (
          <ActionButton
            className="add-as-asset-button"
            action={() => {
              createWickAsset(asset);
            }}
            text="Add as Asset"
          />
        )}
      </div>
    );
  };

  const renderSoundAsset = (asset: BuiltinAsset): JSX.Element => {
    let src = undefined;

    const preview = builtinPreviews[asset.file];
    if (preview) {
      src = preview.src;
    }

    return (
      <div key={asset.file} className="builtin-library-asset">
        <div className="builtin-library-asset-name">{asset.name}</div>

        <div className="audio-preview">
          <AudioPlayer
            key={asset.file}
            src={src}
            loadSrc={() => importForPreview(asset, () => { })}
          />
        </div>

        {isAssetInLibrary(asset.file.split("/").pop() || "") ? (
          <ActionButton
            className="add-as-asset-button"
            action={() => { }}
            text="Already Added"
            color="gray"
          />
        ) : (
          <ActionButton
            className="add-as-asset-button"
            action={() => {
              createWickAsset(asset);
            }}
            text="Add as Asset"
          />
        )}
      </div>
    );
  };

  return (
    <WickModal
      open={open}
      toggle={toggle}
      className="modal-body welcome-modal-body"
      overlayClassName="modal-overlay welcome-modal-overlay"
    >
      <div className="builtin-library">
        <div className="builtin-library-modal-title">
          Builtin Library (Beta)
        </div>
        <TabbedInterface tabNames={["Clips", "Sounds"]}>
          <div className="builtin-library-asset-grid">
            {wickobjects.assets.map(renderBuiltinAsset)}
          </div>
          <div className="builtin-library-asset-grid">
            {sounds.assets.map(renderSoundAsset)}
          </div>
        </TabbedInterface>
      </div>
    </WickModal>
  );
};

export default BuiltinLibrary;
