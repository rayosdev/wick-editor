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

import React, { useState, ReactNode } from "react";

import classNames from "classnames";

interface TabbedInterfaceProps {
  tabNames: string[];
  children: ReactNode[];
  className?: string;
  tabClassName?: string;
  bodyClassName?: string;
  onTabSelect?: (name: string) => void;
}

/**
 * TabbedInterface - A component that renders a tabbed interface with selectable tabs.
 * @param props - Component props
 * @param props.tabNames - Array of tab names to display
 * @param props.children - Array of React nodes to render for each tab body
 * @param props.onTabSelect - Optional callback when a tab is selected
 * @returns JSX.Element
 */
const TabbedInterface: React.FC<TabbedInterfaceProps> = ({
  tabNames,
  children,
  className,
  tabClassName,
  bodyClassName,
  onTabSelect
}) => {
  const [selectedTab, setSelectedTab] = useState(tabNames[0] || '');

  // Selects the tab of the given name.
  const selectTab = (name: string): void => {
    setSelectedTab(name);

    if (onTabSelect) {
      onTabSelect(name);
    }
  };

  /**
   * Renders the selectable tab bar.
   */
  const renderTabs = (): JSX.Element => {
    return (
      <div
        role="tablist"
        className="tabbed-interface-main-tab-container flex h-[30px] min-h-[30px] w-full flex-row items-end justify-start overflow-auto"
      >
        {tabNames.map((tab, i) => (
          <button
            key={`tab-${tab}-${i}`}
            className={classNames(
              "tabbed-interface-main-tab ml-[15px] cursor-pointer appearance-none border-0 bg-editor-modal-gray text-[16px] first:ml-0",
              tabClassName,
              selectedTab === tab
                ? "selected text-white shadow-[inset_0_-2px_0_0_#1EE29A] transition-[box-shadow,color] duration-[400ms]"
                : "text-[#CFCFCF] shadow-[inset_0_-2px_0_0_#484747]"
            )}
            onClick={() => {
              selectTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={classNames("tabbed-interface h-full w-full", className)}>
      {renderTabs()}
      <div
        className={classNames(
          "tabbed-interface-body h-[calc(100%_-_30px)] w-full",
          bodyClassName
        )}
      >
        {
          children[
          tabNames.indexOf(selectedTab)
          ]
        }
      </div>
    </div>
  );
};

export default TabbedInterface;
