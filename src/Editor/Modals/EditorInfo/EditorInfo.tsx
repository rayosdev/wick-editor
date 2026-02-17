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
import WickModal from 'Editor/Modals/WickModal/WickModal';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

import ToolIcon from '../../Util/ToolIcon/ToolIcon';

interface EditorInfoProps {
    open: boolean;
    toggle: () => void;
    editorVersion: string;
    openModal: (modalName: string) => void;
}

/**
 * EditorInfo modal displays information about Wick Editor.
 * Shows version, links to policies, forum, and open source notices.
 */
const WelcomeModal: React.FC<EditorInfoProps> = ({ open, toggle, editorVersion, openModal }) => {
    return (
        <WickModal
            open={open}
            toggle={toggle}
            className="editor-info-modal-container h-[325px] w-[250px]"
            overlayClassName="editor-info-modal-overlay">
            <div className="editor-info-modal-body flex h-full w-full flex-col items-center">
                <div className="editor-info-icon mx-auto mb-2 h-[100px] w-[100px]">
                    <ToolIcon name="mascot" />
                </div>
                <div className="editor-info-name text-center text-2xl text-white">Wick Editor</div>
                <div className="editor-info-version text-center text-white">Version {editorVersion}</div>
                <a className="editor-info-link" href="https://www.wickeditor.com/#/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
                <br />
                <a className="editor-info-link" href="https://www.wickeditor.com/#/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                <br />
                <a className="editor-info-link" href="https://www.wickeditor.com/#/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
                <br />
                <a className="editor-info-link" href="https://forum.wickeditor.com" target="_blank" rel="noopener noreferrer">Community Forum</a>
                <br />
                <div className="editor-info-open-source-notices mt-2 h-[32px] w-full max-w-[200px]">
                    <ActionButton
                        color="gray"
                        text="Open Source Notices"
                        action={() => { openModal("OpenSourceNotices") }} />
                </div>
            </div>
        </WickModal>
    );
};

export default WelcomeModal;
