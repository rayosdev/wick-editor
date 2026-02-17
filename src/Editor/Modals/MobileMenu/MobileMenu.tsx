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
import Modal from 'react-modal';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

interface MobileMenuItem {
  text: string;
  icon: string;
  action: () => void;
}

interface MobileMenuProps {
  open: boolean;
  toggle: () => void;
  openNewProjectConfirmation: () => void;
  openProjectFileDialog: () => void;
  openModal: (modalName: string) => void;
}

/**
 * MobileMenu component displays a mobile-specific menu modal.
 * Shows options for new project, open, export, settings, and about.
 */
const MobileMenu: React.FC<MobileMenuProps> = ({
  open,
  toggle,
  openNewProjectConfirmation,
  openProjectFileDialog,
  openModal
}) => {
  const modalProps = {
    isOpen: open,
    toggle: toggle,
    onRequestClose: toggle,
    overlayClassName: "modal-overlay mobile-menu-overlay",
  };

  const items: MobileMenuItem[] = [
    { text: "new", icon: "create-white", action: openNewProjectConfirmation },
    { text: "open", icon: "load-white", action: openProjectFileDialog },
    { text: "export", icon: "export", action: () => openModal('ExportOptions') },
    { text: "settings", icon: "gear-white", action: () => openModal('SettingsModal') },
    { text: "about", icon: "mascotmarkwhite", action: () => openModal('EditorInfo') }
  ];

  return (
    <Modal
      {...modalProps}
      className="mobile-menu-mobile-body h-full">
      <div className="mobile-menu-options-container my-2 flex h-full flex-col">
        {items.map(({ text, icon, action }) => (
          <ActionButton
            key={text}
            className="mobile-menu-option max-h-[20%]"
            buttonClassName="mobile-menu-button !bg-transparent flex justify-start pl-4"
            iconClassName="mobile-menu-icon h-[60px] w-[60px] fill-white"
            textClassName="mobile-menu-option-text relative left-[10%] h-[60%] w-[70%] text-left font-['Nunito'] text-[40px] text-white"
            action={action}
            text={text}
            icon={icon}
          />
        ))}
      </div>
      <div className="mobile-menu-close absolute right-[15px] top-[15px] min-h-[30px] min-w-[30px]">
        <ActionButton
          icon="cancel-white"
          iconClassName="mobile-menu-close-icon w-[30px]"
          buttonClassName="!bg-transparent"
          action={toggle}
          color="gray"
        />
      </div>
    </Modal>
  );
};

export default MobileMenu;
