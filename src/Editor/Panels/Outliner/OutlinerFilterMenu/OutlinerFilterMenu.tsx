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

import React, { useEffect, useRef, useState } from 'react';
import ToolIcon from 'Editor/Util/ToolIcon/ToolIcon';
import classNames from 'classnames';
import type { DisplayKey, DisplayOptions } from '../Outliner';

interface FilterItem {
  key: DisplayKey;
  label: string;
  icon: string;
}

interface OutlinerFilterMenuProps {
  display: DisplayOptions;
  onChange: (display: DisplayOptions) => void;
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleToggle = (key: DisplayKey) => {
    const newDisplay = { ...display };
    newDisplay[key] = !newDisplay[key];
    onChange(newDisplay);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent): void => {
      if (!containerRef.current) {
        return;
      }

      const target = event.target as Node | null;
      if (target && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const activeCount = Object.values(display).filter(Boolean).length;
  const allActive = activeCount === filterItems.length;

  return (
    <div ref={containerRef} className="outliner-filter-menu relative z-30 flex items-center">
      <button
        className={classNames(
          'outliner-filter-trigger',
          'flex items-center gap-1 rounded-[4px] border-0 bg-transparent px-2 py-1 text-editor-text-primary transition-colors duration-150 ease-in-out has-hover:bg-editor-secondary',
          { 'filter-active text-[#00ADEF]': !allActive }
        )}
        onClick={toggleMenu}
        title="Filter visible object types"
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <ToolIcon name="shown" className="filter-trigger-icon !h-4 !w-4" />
        <span className="filter-trigger-text text-[13px] font-medium">
          {allActive ? 'All' : activeCount}
        </span>
        <ToolIcon name="moreactions" className="filter-trigger-dropdown !h-[10px] !w-[10px] opacity-60" />
      </button>

      {isOpen && (
        <div
          className="outliner-filter-popup absolute right-0 top-full z-30 mt-1"
          role="menu"
          aria-label="Outliner Filter Menu"
        >
          <div className="outliner-filter-content w-[120.25px] rounded-[6px] border border-solid border-[#191919] bg-editor-primary py-2 shadow-[0_10px_26px_rgba(0,0,0,0.5)]">
          <div className="outliner-filter-header mb-1 box-border h-[29.5px] border-b border-solid border-[#191919] px-[12px] pb-2 pt-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.5px] text-editor-text-secondary">
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
              role="menuitemcheckbox"
              aria-checked={display[key]}
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
        </div>
      )}
    </div>
  );
};

export default OutlinerFilterMenu;
