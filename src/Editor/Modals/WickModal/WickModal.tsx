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
    // Set an app element for react-modal in both app and Storybook iframe contexts.
    try {
      const modalSelector =
        (window as Window & { __REACT_MODAL_APP_ELEMENT?: string })
          .__REACT_MODAL_APP_ELEMENT ?? "#root";
      const appElement =
        document.querySelector(modalSelector) ??
        document.querySelector("#storybook-root");

      if (appElement) {
        Modal.setAppElement(appElement);
      }
    } catch (e) {
      // No-op in non-DOM environments
    }
  }, []);

  const renderIcon = (): JSX.Element => {
    return (
      <div id="modal-icon-container" className="h-[60px] w-[60px]">
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
      <div
        id="modal-close-icon-container"
        className="absolute right-[15px] top-[15px] h-5 w-5 cursor-pointer select-none border-none bg-[#383434]"
      >
        <ActionButton
          color="tool"
          icon="cancel-white"
          action={toggle}
        />
      </div>
      <div className="modal-generic-container flex h-full w-full flex-col items-center">
        {icon && renderIcon()}
        {children}
      </div>
    </Modal>
  );
};

export default WickModal;
