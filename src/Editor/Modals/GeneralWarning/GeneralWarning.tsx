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

import { Component } from 'react';
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
class GeneralWarning extends Component<GeneralWarningProps> {
  acceptAndToggle = (): void => {
    this.props.toggle();
    this.props.info.acceptAction();
    this.props.info.finalAction();
  }

  cancelAndToggle = (): void => {
    this.props.info.cancelAction();
    this.props.info.finalAction();
    this.props.toggle();
  }

  render(): JSX.Element {
    return (
      <WickModal
      open={this.props.open}
      toggle={this.props.toggle}
      icon="warningdelete"
      className="general-warning-modal-body"
      overlayClassName="general-warning-modal-overlay">
        <div id="general-warning-modal-interior-content">
          <div id="general-warning-modal-title">{this.props.info.title}</div>
          <div id="general-warning-modal-message">
          {this.props.info.description}
          </div>
          <div id="general-warning-modal-footer">
            <div id="general-warning-modal-cancel">
                <ActionButton
                  className="general-warning-modal-button"
                  color='gray'
                  action={this.cancelAndToggle}
                  text={this.props.info.cancelText}
                  icon={this.props.info.cancelIcon}
                  iconClassName="cancel-icon"
                  />
              </div>
              <div id="general-warning-modal-accept">
                <ActionButton
                  className="general-warning-modal-button"
                  color='green'
                  action={this.acceptAndToggle}
                  text={this.props.info.acceptText}
                  icon={this.props.info.acceptIcon}
                  iconClassName="create-icon"
                  />
              </div>
           </div>
        </div>
      </WickModal>
    );
  }
}

export default GeneralWarning;
