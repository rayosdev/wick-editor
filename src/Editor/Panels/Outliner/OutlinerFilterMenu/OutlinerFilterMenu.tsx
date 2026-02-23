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
    <div className="outliner-filter-menu flex items-center">
      <button
        id={buttonId}
        className={classNames(
          'outliner-filter-trigger',
          'flex items-center gap-1 rounded-[4px] border-0 bg-transparent px-2 py-1 text-editor-text-primary transition-colors duration-150 ease-in-out has-hover:bg-editor-secondary',
          { 'filter-active text-[#00ADEF]': !allActive }
        )}
        onClick={toggleMenu}
        title="Filter visible object types"
      >
        <ToolIcon name="shown" className="filter-trigger-icon !h-4 !w-4" />
        <span className="filter-trigger-text text-[13px] font-medium">
          {allActive ? 'All' : activeCount}
        </span>
        <ToolIcon name="moreactions" className="filter-trigger-dropdown !h-[10px] !w-[10px] opacity-60" />
      </button>

      <PopupMenu
        isOpen={isOpen}
        toggle={toggleMenu}
        target={buttonId}
        className="outliner-filter-popup !max-w-[180px]"
      >
        <div className="outliner-filter-content py-2">
          <div className="outliner-filter-header mb-1 border-b border-solid border-[#191919] px-[12px] pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-editor-text-secondary">
            Show Objects
          </div>
          {filterItems.map(({ key, label, icon }) => (
            <button
              key={key}
              className={classNames(
                'outliner-filter-item',
                'flex w-full items-center gap-2 border-0 bg-transparent px-[12px] py-[6px] text-left text-editor-text-primary transition-colors duration-150 ease-in-out has-hover:bg-editor-secondary',
                { active: display[key] }
              )}
              onClick={() => handleToggle(key)}
            >
              <span className="filter-item-check flex h-4 w-4 items-center justify-center">
                {display[key] && <ToolIcon name="check" className="check-icon !h-3 !w-3" />}
              </span>
              <ToolIcon
                name={icon}
                className={classNames(
                  'filter-item-icon !h-4 !w-4 transition-opacity duration-150',
                  display[key] ? 'opacity-100' : 'opacity-60'
                )}
              />
              <span className="filter-item-label flex-1 text-[13px]">{label}</span>
            </button>
          ))}
        </div>
      </PopupMenu>
    </div>
  );
};

export default OutlinerFilterMenu;
