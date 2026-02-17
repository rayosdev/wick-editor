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

interface WarningInfo {
  title: string;
  description: string;
  acceptText: string;
  acceptIcon: string;
  acceptAction: () => void;
  cancelText: string;
  cancelIcon: string;
  cancelAction: () => void;
  finalAction: () => void;
}

interface GeneralWarningProps {
  open: boolean;
  toggle: () => void;
  info: WarningInfo;
}

/**
 * GeneralWarning modal displays a customizable warning with accept/cancel actions.
 * Used for various confirmation dialogs throughout the editor.
 */
const GeneralWarning: React.FC<GeneralWarningProps> = ({ open, toggle, info }) => {
  const acceptAndToggle = (): void => {
    toggle();
    info.acceptAction();
    info.finalAction();
  };

  const cancelAndToggle = (): void => {
    info.cancelAction();
    info.finalAction();
    toggle();
  };

  return (
    <WickModal
      open={open}
      toggle={toggle}
      icon="warningdelete"
      className="general-warning-modal-body h-[250px] min-w-[240px] w-[240px] p-5"
      overlayClassName="general-warning-modal-overlay">
      <div
        id="general-warning-modal-interior-content"
        className="flex h-full w-full flex-col items-center justify-center"
      >
        <div
          id="general-warning-modal-title"
          className="mt-5 text-center text-lg font-bold text-[#E6E6E6]"
        >
          {info.title}
        </div>
        <div
          id="general-warning-modal-message"
          className="w-full text-center text-sm text-[#E6E6E6]"
        >
          {info.description}
        </div>
        <div
          id="general-warning-modal-footer"
          className="mt-[25px] flex h-10 w-full flex-row items-center justify-center"
        >
          <div id="general-warning-modal-cancel" className="h-full w-[90px]">
            <ActionButton
              className="general-warning-modal-button"
              color='gray'
              action={cancelAndToggle}
              text={info.cancelText}
              icon={info.cancelIcon}
              iconClassName="cancel-icon"
            />
          </div>
          <div id="general-warning-modal-accept" className="ml-[18px] h-full w-[90px]">
            <ActionButton
              className="general-warning-modal-button"
              color='green'
              action={acceptAndToggle}
              text={info.acceptText}
              icon={info.acceptIcon}
              iconClassName="create-icon"
            />
          </div>
        </div>
      </div>
    </WickModal>
  );
};

export default GeneralWarning;
