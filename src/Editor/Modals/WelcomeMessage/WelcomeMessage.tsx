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

import React, { type ComponentProps } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-modal";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import type { WickProject } from "Editor/types";

import "./_welcomemessage.scss";

// import nightImage from 'resources/interface-images/blue_night.svg';
import nightImageShort from "resources/interface-images/blue_night_short.svg";

import coolField from "resources/splash-screens/cool_field3.png";

import classNames from "classnames";

interface WelcomeModalProps {
  open: boolean;
  toggle: () => void;
  editorVersion: string;
  isMobile?: boolean;
  project: WickProject;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  open,
  toggle,
  editorVersion,
  isMobile
}) => {
  type ModalProps = ComponentProps<typeof Modal>;
  const forumPost =
    "https://forum.wickeditor.com/t/help-needed-wick-editor-version-1-18-new-fill-bucket-outliner-tool-mobile-improvements/3314";
  const updates = [
    "New Code Editor!",
    "New Hit Test Options",
    "And Much More!",
  ]; // No More than 3

  const t1 = ["Guy de Bree", "Dimp", "Hyun's Dojo"];
  const t2 = ["Constance Ye", "Dan Doggett", "Anonymous"];
  const t3 = [
    "Gautaum Bose",
    "Trevor",
    "Jovanny Rodriguez",
    "André Bray",
    "Colin Fitz-Gerald",
  ];
  const t4 = [
    "Golan Levin",
    "Daniel Sun",
    "Benjamin Briand",
    "Joseph Hocking",
    "Charisse Hampton",
    "Jessie Young",
    "Bluecake",
    "O.K. Keyes",
    "Sarksus",
    "Laurens Bonnema",
    "Anonymous",
  ];
  const t5 = [
    "Joe",
    "Karlin Fox",
    "StepSwitcher",
    "Kandy Kat",
    "Ann Griffin",
    "Happyships",
    "Dixie Dorward",
    "Albin Rodriguex",
  ];
  const patreonSupporters = t1.concat(t2, t3, t4, t5);

  // Render updates as a list.
  const renderUpdates = (className?: string): JSX.Element => {
    return (
      <ul className={classNames("updates-list", className)}>
        {updates.map((update, i) => {
          return <li key={`update-${i}`}>{update}</li>;
        })}
      </ul>
    );
  };

  // Render a list of all Patreon supporters.
  const renderPatreonSupporters = (className?: string): JSX.Element => {
    return (
      <div className={classNames("supporter-list-container", className)}>
        <a
          className="welcome-modal-highlight"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.patreon.com/WickEditor"
        >
          Become a Patreon Supporter!
        </a>
        <div className="supporter-list">
          {patreonSupporters.join(", ")}
        </div>
      </div>
    );
  };

  const renderMobileModal = (modalProps: ModalProps): JSX.Element => {
    return (
      <Modal {...modalProps} className="modal-body welcome-modal-mobile-body">
        <div className="welcome-modal-mobile-image-container">
          <img
            className="welcome-modal-mobile-image"
            alt="Night sky with mountains, clouds, a moon and stars"
            src={nightImageShort}
          />
        </div>
        <div className="welcome-modal-mobile-content">
          <div className="welcome-modal-title small-modal">The Wick Editor</div>
          <div className="welcome-modal-version small-modal">
            <a
              className="welcome-modal-highlight"
              target="_blank"
              rel="noopener noreferrer"
              href={forumPost}
            >
              Version {editorVersion}
            </a>
          </div>
          {renderUpdates("small-modal")}
          {renderPatreonSupporters()}
        </div>
        <div id="welcome-modal-mobile-accept">
          <ActionButton
            className="welcome-modal-button"
            color="green"
            action={toggle}
            text="Try it"
          />
        </div>
      </Modal>
    );
  };

  const renderDesktopModal = (modalProps: ModalProps): JSX.Element => {
    return (
      <Modal {...modalProps} className="modal-body welcome-modal-body">
        <div id="welcome-modal-interior-content">
          <div
            id="welcome-image-container"
            className="welcome-modal-main-container"
          >
            <img
              id="welcome-image"
              alt="Night sky with mountains, clouds, a moon and stars"
              src={coolField}
            />
          </div>
          <div id="welcome-message-container" className="modal-main-container">
            <div id="welcome-modal-title" className="welcome-modal-item">
              Welcome To The Wick Editor!
            </div>
            <div id="welcome-modal-version" className="welcome-modal-item">
              <a
                className="welcome-modal-highlight"
                target="_blank"
                rel="noopener noreferrer"
                href={forumPost}
              >
                Version {editorVersion}
              </a>
            </div>
            <div id="welcome-modal-subtitle" className="welcome-modal-item">
              Wick Editor {editorVersion} includes:
            </div>
            <div id="welcome-modal-message" className="welcome-modal-item">
              {renderUpdates()}
              {renderPatreonSupporters("desktop-modal")}
            </div>
            <div id="welcome-modal-forum-link" className="welcome-modal-item">
              Please report all bugs on our{" "}
              <a
                className="welcome-modal-highlight"
                target="_blank"
                rel="noopener noreferrer"
                href="https://forum.wickeditor.com"
              >
                forum!
              </a>
            </div>
            <div id="welcome-modal-footer">
              <div id="welcome-modal-accept">
                <ActionButton
                  className="welcome-modal-button"
                  color="green"
                  action={toggle}
                  text="Try it"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const modalProps = {
    isOpen: open,
    onRequestClose: toggle,
    overlayClassName: "modal-overlay welcome-modal-overlay",
  };

  if (isMobile) {
    return renderMobileModal(modalProps);
  } else {
    return renderDesktopModal(modalProps);
  }
};

export default WelcomeModal;
