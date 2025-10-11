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

import './_makeinteractive.scss';

interface MakeInteractiveProps {
  open: boolean;
  toggle: () => void;
  createClipFromSelection: (name: string) => void;
  createButtonFromSelection: (name: string) => void;
}

/**
 * MakeInteractive modal for converting selected objects into interactive clips or buttons.
 * Clips have timelines and can be controlled with code.
 * Buttons have 3 frames controlled by mouse interactions.
 */
const MakeInteractive: React.FC<MakeInteractiveProps> = ({
  open,
  toggle,
  createClipFromSelection,
  createButtonFromSelection
}) => {
  const placeholderName = "Item_Name";
  const [name, setName] = useState("");

  /**
   * Creates an item of type and toggles the modal.
   * @param {string} type Either 'Button' or 'Clip'
   */
  const createAndToggle = (type: 'Clip' | 'Button'): void => {
    const itemName = name !== "" ? name : type;
    if (type === 'Clip') {
      createClipFromSelection(itemName);
    } else if (type === 'Button') {
      createButtonFromSelection(itemName);
    }

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
      className="make-interactive-modal-body"
      overlayClassName="make-interactive-modal-overlay">
      <div id="make-interactive-modal-interior-content">
        <div id="make-interactive-modal-title">Make Interactive</div>
        <div id="make-interactive-modal-name-input">
          <WickInput
            type="text"
            value={name}
            onChange={updateClipName}
            placeholder={placeholderName} />
        </div>
        <div className="make-interactive-object-info-container">
          <ObjectInfo
            title="CLIP"
            rows={[
              {
                text: "Can add any code",
                icon: "check"
              },
              {
                text: "Has its own timeline",
                icon: "check"
              },
              {
                text: "Can control timeline with code",
                icon: "check",
              }
            ]} />
          <ObjectInfo
            title="BUTTON"
            rows={[
              {
                text: "Can add any code",
                icon: "check"
              },
              {
                text: "Only has 3 frames",
                icon: "check"
              },
              {
                text: "Frames controlled by mouse interactions",
                icon: "check",
              }
            ]} />
        </div>
      </div>
      <div id="make-interactive-modal-footer">
        <ActionButton
          className="make-interactive-modal-button"
          color='gray-green'
          action={() => { createAndToggle("Clip") }}
          text="Convert to Clip"
        />
        <ActionButton
          className="make-interactive-modal-button"
          color='gray-green'
          action={() => { createAndToggle("Button") }}
          text="Convert to Button"
        />
      </div>
      <div id="make-interactive-asset-checkbox-container">
        {/* <WickInput
            type="checkbox"
            containerclassname="make-interactive-asset-checkbox-input-container"
            className="make-interactive-asset-checkbox-input"
            onChange={updateAssetCheckbox}
            defaultChecked={makeAsset}
          />
          <div id="make-interactive-asset-checkbox-message">
            Add to asset library
          </div> */}
      </div>
    </WickModal>
  );
};

export default MakeInteractive