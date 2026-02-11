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

import React, { useState } from 'react';
import PopupMenu from 'Editor/Util/PopupMenu/PopupMenu';
import ToolIcon from 'Editor/Util/ToolIcon/ToolIcon';
import classNames from 'classnames';

import './_outlinerfiltermenu.scss';

interface DisplaySettings {
  path: boolean;
  button: boolean;
  clip: boolean;
  text: boolean;
  image: boolean;
  [key: string]: boolean;
}

interface FilterItem {
  key: string;
  label: string;
  icon: string;
}

interface OutlinerFilterMenuProps {
  display: DisplaySettings;
  onChange: (display: DisplaySettings) => void;
}

const filterItems: FilterItem[] = [
  { key: 'path', label: 'Paths', icon: 'path-object' },
  { key: 'button', label: 'Buttons', icon: 'button-object' },
  { key: 'clip', label: 'Clips', icon: 'clip-object' },
  { key: 'text', label: 'Text', icon: 'text-object' },
  { key: 'image', label: 'Images', icon: 'image-object' },
];

const OutlinerFilterMenu: React.FC<OutlinerFilterMenuProps> = ({ display, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonId = 'outliner-filter-menu-btn';

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleToggle = (key: string) => {
    const newDisplay = { ...display };
    newDisplay[key] = !newDisplay[key];
    onChange(newDisplay);
  };

  const activeCount = Object.values(display).filter(Boolean).length;
  const allActive = activeCount === filterItems.length;

  return (
    <div className="outliner-filter-menu">
      <button
        id={buttonId}
        className={classNames('outliner-filter-trigger', { 'filter-active': !allActive })}
        onClick={toggleMenu}
        title="Filter visible object types"
      >
        <ToolIcon name="shown" className="filter-trigger-icon" />
        <span className="filter-trigger-text">{allActive ? 'All' : activeCount}</span>
        <ToolIcon name="moreactions" className="filter-trigger-dropdown" />
      </button>

      <PopupMenu
        isOpen={isOpen}
        toggle={toggleMenu}
        target={buttonId}
        className="outliner-filter-popup"
      >
        <div className="outliner-filter-content">
          <div className="outliner-filter-header">Show Objects</div>
          {filterItems.map(({ key, label, icon }) => (
            <button
              key={key}
              className={classNames('outliner-filter-item', { active: display[key] })}
              onClick={() => handleToggle(key)}
            >
              <span className="filter-item-check">
                {display[key] && <ToolIcon name="check" className="check-icon" />}
              </span>
              <ToolIcon name={icon} className="filter-item-icon" />
              <span className="filter-item-label">{label}</span>
            </button>
          ))}
        </div>
      </PopupMenu>
    </div>
  );
};

export default OutlinerFilterMenu;
