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

import React, { useState } from 'react';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';
import WickModal from 'Editor/Modals/WickModal/WickModal';
import WickInput from 'Editor/Util/WickInput/WickInput';
import ObjectInfo from '../Util/ObjectInfo/ObjectInfo';

interface MakeAnimatedProps {
  open: boolean;
  toggle: () => void;
  createClipFromSelection: (name: string) => void;
}

/**
 * MakeAnimated modal for converting selected objects into an animated clip.
 * Clips have their own timeline and can be controlled with code.
 */
const MakeAnimated: React.FC<MakeAnimatedProps> = ({
  open,
  toggle,
  createClipFromSelection
}) => {
  const placeholderName = "Item Name";
  const defaultName = "Clip";
  const [name, setName] = useState("");

  // Creates a clip and toggles the modal.
  const createAndToggle = (): void => {
    const clipName = name !== "" ? name : defaultName;
    createClipFromSelection(clipName);
    toggle();
  };

  // Updates the clip name in the state.
  const updateClipName = (newName: string): void => {
    setName(newName);
  };

  return (
    <WickModal
      open={open}
      toggle={toggle}
      className="make-animated-modal-body h-[330px] w-[240px] min-w-[240px] p-5"
      overlayClassName="make-animated-modal-overlay">
      <div
        id="make-animated-modal-interior-content"
        className="flex h-full w-full flex-col items-center justify-center"
      >
        <div
          id="make-animated-modal-title"
          className="w-full text-left text-[18px] font-bold text-editor-modal-text"
        >
          Make Animated
        </div>
        <div id="make-animated-modal-name-input" className="mt-[10px]">
          <WickInput
            type="text"
            value={name}
            onChange={updateClipName}
            placeholder={placeholderName} />
        </div>
        <ObjectInfo
          title="CLIP"
          rows={[
            {
              text: "Has its own timeline",
              icon: "check"
            },
            {
              text: "Can control timeline with code",
              icon: "check"
            },
            {
              text: "Can add any code",
              icon: "check",
            }
          ]} />
      </div>
      <div
        id="make-animated-modal-footer"
        className="mt-[15px] flex h-[28px] w-full flex-row items-center justify-center"
      >
        <div id="make-animated-modal-accept" className="h-full w-full">
          <ActionButton
            className="make-animated-modal-button"
            color='gray-green'
            action={createAndToggle}
            text="Convert to Clip"
          />
        </div>
      </div>
      <div
        id="make-animated-asset-checkbox-container"
        className="mt-[10px] flex w-full flex-row items-center justify-start"
      >
        {/* <WickInput
          type="checkbox"
          containerclassname="make-animated-asset-checkbox-input-container"
          className="make-animated-asset-checkbox-input"
          onChange={updateAssetCheckbox}
          defaultChecked={makeAsset}
        />
        <div id="make-animated-asset-checkbox-message">
          Add to asset library
        </div> */}
      </div>
    </WickModal>
  );
};

export default MakeAnimated
