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

import './_generalwarning.scss';

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
      className="general-warning-modal-body"
      overlayClassName="general-warning-modal-overlay">
      <div id="general-warning-modal-interior-content">
        <div id="general-warning-modal-title">{info.title}</div>
        <div id="general-warning-modal-message">
          {info.description}
        </div>
        <div id="general-warning-modal-footer">
          <div id="general-warning-modal-cancel">
            <ActionButton
              className="general-warning-modal-button"
              color='gray'
              action={cancelAndToggle}
              text={info.cancelText}
              icon={info.cancelIcon}
              iconClassName="cancel-icon"
            />
          </div>
          <div id="general-warning-modal-accept">
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
