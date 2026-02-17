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
import WickModal from "Editor/Modals/WickModal/WickModal";
import TabbedInterface from "Editor/Util/TabbedInterface/TabbedInterface";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import AudioPlayer from "Editor/Util/AudioPlayer/AudioPlayer";
import type { WickProject } from "Editor/types";

import wickobjects from "./wickobjects";
import sounds from "./sounds";
import type { BuiltinAsset } from "./libraryTypes";

interface BuiltinPreview {
  blob: Blob;
  src?: string;
}

interface BuiltinLibraryProps {
  open: boolean;
  toggle: () => void;
  project: WickProject;
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
  const toNamedFile = (blob: Blob, filename: string): File => {
    if (blob instanceof File && blob.name === filename) {
      return blob;
    }

    return new File([blob], filename, {
      type: blob.type || "application/octet-stream",
      lastModified: Date.now(),
    });
  };

  //Fetch file, add to builtinPreviews
  const importForPreview = (asset: BuiltinAsset, callback?: (blob: Blob) => void): void => {
    const path = ROOT_ASSET_PATH + asset.file;

    fetch(path)
      .then((response) => response.blob())
      .then((blob) => {
        const filename = asset.file.split("/").pop() || "builtin-asset";
        const file = toNamedFile(blob, filename);

        addFileToBuiltinPreviews(asset.file, file);

        callback && callback(file);
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
      <div key={asset.file} className="builtin-library-asset mb-[10px] mr-[3%] h-[170px] w-[30%]">
        <div className="builtin-library-asset-name h-[30px] w-full overflow-hidden text-white">
          {asset.name}
        </div>

        <div className="builtin-library-asset-icon-container flex h-[100px] w-full items-center justify-center overflow-hidden rounded-[5px] border-none bg-editor-primary text-center">
          <img
            alt="Builtin Asset Icon"
            src={ROOT_ASSET_PATH + asset.icon}
            className="builtin-library-asset-icon block h-full w-auto"
          />
        </div>

        {isAssetInLibrary(asset.file.split("/").pop() || "") ? (
          <ActionButton
            className="add-as-asset-button mt-[3%] h-[28px] w-full pr-[6%]"
            action={() => { }}
            text="Already Added"
            color="gray"
          />
        ) : (
          <ActionButton
            className="add-as-asset-button mt-[3%] h-[28px] w-full pr-[6%]"
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
      <div key={asset.file} className="builtin-library-asset mb-[10px] mr-[3%] h-[170px] w-[30%]">
        <div className="builtin-library-asset-name h-[30px] w-full overflow-hidden text-white">
          {asset.name}
        </div>

        <div className="audio-preview h-[50px] w-full">
          <AudioPlayer
            key={asset.file}
            src={src}
            loadSrc={() => importForPreview(asset, () => { })}
          />
        </div>

        {isAssetInLibrary(asset.file.split("/").pop() || "") ? (
          <ActionButton
            className="add-as-asset-button mt-[3%] h-[28px] w-full pr-[6%]"
            action={() => { }}
            text="Already Added"
            color="gray"
          />
        ) : (
          <ActionButton
            className="add-as-asset-button mt-[3%] h-[28px] w-full pr-[6%]"
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
      <div className="builtin-library h-full w-full p-5">
        <div className="builtin-library-modal-title h-[30px] w-full text-left text-[18px] font-bold text-editor-modal-text">
          Builtin Library (Beta)
        </div>
        <TabbedInterface tabNames={["Clips", "Sounds"]}>
          <div className="builtin-library-asset-grid mt-[5px] flex h-[calc(100%_-_60px)] w-full flex-wrap overflow-y-scroll">
            {wickobjects.assets.map(renderBuiltinAsset)}
          </div>
          <div className="builtin-library-asset-grid mt-[5px] flex h-[calc(100%_-_60px)] w-full flex-wrap overflow-y-scroll">
            {sounds.assets.map(renderSoundAsset)}
          </div>
        </TabbedInterface>
      </div>
    </WickModal>
  );
};

export default BuiltinLibrary;
