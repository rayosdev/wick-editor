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

import { Component, ReactNode } from "react";
import Modal from "react-modal";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "./_wickmodal.scss";

import classNames from "classnames";

interface WickModalProps {
  open: boolean;
  toggle: () => void;
  className?: string;
  overlayClassName?: string;
  icon?: string;
  children?: ReactNode;
}

/**
 * WickModal component provides a standardized modal wrapper for the editor.
 * Includes close button, optional icon, and customizable styling.
 */
class WickModal extends Component<WickModalProps> {
  renderIcon(): JSX.Element {
    return (
      <div id="modal-icon-container">
        <ToolIcon name={this.props.icon} />
      </div>
    );
  }

  componentDidMount(): void {
    // Use #root as the app element so react-modal doesn't try to toggle aria-hidden on <body>
    try {
      const root = document.getElementById("root");
      if (root) {
        Modal.setAppElement("#root");
      }
    } catch (e) {
      // No-op in non-DOM environments
    }
  }

  render(): JSX.Element {
    return (
      <Modal
        isOpen={this.props.open}
        toggle={() => {
          this.props.toggle();
        }}
        onRequestClose={this.props.toggle}
        className={classNames("modal-body", this.props.className)}
        overlayClassName={classNames(
          "modal-overlay",
          this.props.overlayClassName
        )}
      >
        <div id="modal-close-icon-container">
          <ActionButton
            color="tool"
            icon="cancel-white"
            action={this.props.toggle}
          />
        </div>
        <div className="modal-generic-container">
          {this.props.icon && this.renderIcon()}
          {this.props.children}
        </div>
      </Modal>
    );
  }
}

export default WickModal;
