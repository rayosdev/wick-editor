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

import React, { type ComponentProps, useState } from "react";
import Modal from "react-modal";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import type { WickProject } from "Editor/types";

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
  onAccept?: (dontShowAgain: boolean) => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({
  open,
  toggle,
  editorVersion,
  isMobile,
  onAccept,
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
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
      <ul
        className={classNames(
          "updates-list mb-0 text-white",
          className
        )}
      >
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
          className="welcome-modal-highlight text-wick-green"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.patreon.com/WickEditor"
        >
          Become a Patreon Supporter!
        </a>
        <div className="supporter-list h-[35%] max-h-[75px] overflow-y-scroll text-[12px] text-white">
          {patreonSupporters.join(", ")}
        </div>
      </div>
    );
  };

  const renderMobileModal = (modalProps: ModalProps): JSX.Element => {
    return (
      <Modal
        {...modalProps}
        className="modal-body welcome-modal-mobile-body h-[380px] w-[80%] max-w-[400px] !bg-editor-primary p-0"
      >
        <div className="welcome-modal-mobile-image-container max-h-[30%] w-full overflow-hidden">
          <img
            className="welcome-modal-mobile-image w-full"
            alt="Night sky with mountains, clouds, a moon and stars"
            src={nightImageShort}
          />
        </div>
        <div className="welcome-modal-mobile-content px-5 pb-0 pt-[10px]">
          <div className="welcome-modal-title small-modal whitespace-nowrap font-nunito text-[22px] font-bold text-white">
            The Wick Editor
          </div>
          <div className="welcome-modal-version small-modal text-[16px] font-semibold text-editor-modal-text">
            <a
              className="welcome-modal-highlight text-wick-green"
              target="_blank"
              rel="noopener noreferrer"
              href={forumPost}
            >
              Version {editorVersion}
            </a>
          </div>
          {renderUpdates("small-modal [&_li]:text-[12px]")}
          {renderPatreonSupporters()}
          <label className="welcome-modal-dont-show-again mobile mt-[10px] inline-flex items-center gap-[6px] text-[12px] text-editor-modal-text [&_input]:m-0">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(event) => setDontShowAgain(event.target.checked)}
            />
            <span>Don&apos;t show again</span>
          </label>
        </div>
        <div id="welcome-modal-mobile-accept" className="absolute bottom-5 right-5 w-[65px]">
          <ActionButton
            className="welcome-modal-button h-[28px] w-full"
            color="green"
            action={() => {
              onAccept?.(dontShowAgain);
              toggle();
            }}
            text="Try it"
          />
        </div>
      </Modal>
    );
  };

  const renderDesktopModal = (modalProps: ModalProps): JSX.Element => {
    return (
      <Modal
        {...modalProps}
        className="modal-body welcome-modal-body h-[420px] max-h-[420px] w-[670px] max-w-[670px] p-0"
      >
        <div
          id="welcome-modal-interior-content"
          className="flex h-full w-full flex-row"
        >
          <div
            id="welcome-image-container"
            className="welcome-modal-main-container h-full w-1/2 max-w-[320px]"
          >
            <img
              id="welcome-image"
              className="h-full"
              alt="Night sky with mountains, clouds, a moon and stars"
              src={coolField}
            />
          </div>
          <div
            id="welcome-message-container"
            className="modal-main-container relative w-[350px] min-w-[350px] bg-editor-primary px-7 pb-7 pt-[30px]"
          >
            <div
              id="welcome-modal-title"
              className="welcome-modal-item whitespace-nowrap text-[22px] font-bold text-white"
            >
              Welcome To The Wick Editor!
            </div>
            <div
              id="welcome-modal-version"
              className="welcome-modal-item text-[16px] font-semibold text-editor-modal-text"
            >
              <a
                className="welcome-modal-highlight text-wick-green"
                target="_blank"
                rel="noopener noreferrer"
                href={forumPost}
              >
                Version {editorVersion}
              </a>
            </div>
            <div
              id="welcome-modal-subtitle"
              className="welcome-modal-item mt-5 text-[20px] font-bold text-white"
            >
              Wick Editor {editorVersion} includes:
            </div>
            <div
              id="welcome-modal-message"
              className="welcome-modal-item text-[14px] text-editor-modal-text"
            >
              {renderUpdates()}
              {renderPatreonSupporters("desktop-modal mt-5")}
            </div>
            <div
              id="welcome-modal-forum-link"
              className="welcome-modal-item absolute bottom-[68px] left-7 text-[14px] text-editor-modal-text"
            >
              Please report all bugs on our{" "}
              <a
                className="welcome-modal-highlight text-wick-green"
                target="_blank"
                rel="noopener noreferrer"
                href="https://forum.wickeditor.com"
              >
                forum!
              </a>
            </div>
            <div
              id="welcome-modal-footer"
              className="absolute bottom-7 flex h-[28px] w-[calc(100%_-_56px)] flex-row items-center"
            >
              <label className="welcome-modal-dont-show-again mr-2 inline-flex items-center gap-[6px] text-[13px] text-editor-modal-text [&_input]:m-0">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(event) => setDontShowAgain(event.target.checked)}
                />
                <span>Don&apos;t show again</span>
              </label>
              <div id="welcome-modal-accept" className="ml-auto h-full w-[65px]">
                <ActionButton
                  className="welcome-modal-button h-full w-full"
                  color="green"
                  action={() => {
                    onAccept?.(dontShowAgain);
                    toggle();
                  }}
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
