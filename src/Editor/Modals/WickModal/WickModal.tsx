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

import React, { ReactNode, useEffect } from "react";
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
const WickModal: React.FC<WickModalProps> = ({
  open,
  toggle,
  className,
  overlayClassName,
  icon,
  children
}) => {
  useEffect(() => {
    // Use #root as the app element so react-modal doesn't try to toggle aria-hidden on <body>
    try {
      const root = document.getElementById("root");
      if (root) {
        Modal.setAppElement("#root");
      }
    } catch (e) {
      // No-op in non-DOM environments
    }
  }, []);

  const renderIcon = (): JSX.Element => {
    return (
      <div id="modal-icon-container">
        <ToolIcon name={icon} />
      </div>
    );
  };

  return (
    <Modal
      isOpen={open}
      toggle={() => {
        toggle();
      }}
      onRequestClose={toggle}
      className={classNames("modal-body", className)}
      overlayClassName={classNames(
        "modal-overlay",
        overlayClassName
      )}
    >
      <div id="modal-close-icon-container">
        <ActionButton
          color="tool"
          icon="cancel-white"
          action={toggle}
        />
      </div>
      <div className="modal-generic-container">
        {icon && renderIcon()}
        {children}
      </div>
    </Modal>
  );
};

export default WickModal;
