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

import React from 'react';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';
import WickModal from 'Editor/Modals/WickModal/WickModal';

interface AutosaveWarningProps {
  open: boolean;
  toggle: () => void;
  loadAutosavedProject: (callback: () => void) => void;
  clearAutoSavedProject: (callback: () => void) => void;
}

/**
 * AutosaveWarning modal prompts user to load or delete an autosaved project.
 * Displayed when an autosave is detected on editor startup.
 */
const AutosaveWarning: React.FC<AutosaveWarningProps> = ({
  open,
  toggle,
  loadAutosavedProject,
  clearAutoSavedProject
}) => {
  const loadAndToggle = (): void => {
    loadAutosavedProject(() => {
      toggle();
    });
  };

  const deleteAndToggle = (): void => {
    clearAutoSavedProject(() => {
      toggle();
    });
  };

  return (
    <WickModal
      open={open}
      toggle={toggle}
      icon="autosave"
      className="autosave-modal-body h-[200px] min-w-[240px] w-[240px] p-5"
      overlayClassName="autosave-modal-overlay">
      <div
        id="autosave-modal-interior-content"
        className="flex h-[120px] w-full flex-col items-center justify-center"
      >
        <div
          id="autosave-modal-title"
          className="mt-0 text-center text-lg font-bold text-[#E6E6E6]"
        >
          Load Autosave?
        </div>
        <div
          id="autosave-modal-footer"
          className="mt-[15px] flex h-10 w-full flex-row items-center justify-center"
        >
          <div id="autosave-modal-cancel" className="h-full w-[90px]">
            <ActionButton
              className="autosave-modal-button"
              color='red'
              action={deleteAndToggle}
              text="Delete"
              icon="delete-black"
              iconClassName="autosave-icon"
            />
          </div>
          <div id="autosave-modal-accept" className="ml-[18px] h-full w-[90px]">
            <ActionButton
              className="autosave-modal-button"
              color='green'
              action={loadAndToggle}
              text="Load"
              icon="load"
              iconClassName="autosave-icon"
            />
          </div>
        </div>
      </div>
    </WickModal>
  );
};

export default AutosaveWarning;
