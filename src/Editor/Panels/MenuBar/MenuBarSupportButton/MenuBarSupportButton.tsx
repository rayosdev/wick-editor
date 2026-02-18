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
import ActionButton from '../../../Util/ActionButton/ActionButton';

interface MenuBarSupportButtonProps {
  id?: string;
  action: (e?: React.MouseEvent) => void;
  text?: string;
  icon?: string;
}

const MenuBarSupportButton: React.FC<MenuBarSupportButtonProps> = ({
  id,
  action,
  text,
  icon,
}) => {
  return (
    <div className="menu-bar-support-button float-left h-full p-[2px]">
      <ActionButton
        color="support"
        id={id}
        action={action}
        text={text}
        icon={icon}>
      </ActionButton>
    </div>
  );
};

export default MenuBarSupportButton;
