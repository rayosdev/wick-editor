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

import "./_tabbedinterface.scss";

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
      <div role="tablist" className="tabbed-interface-main-tab-container">
        {tabNames.map((tab, i) => (
          <button
            key={`tab-${tab}-${i}`}
            className={classNames(
              "tabbed-interface-main-tab",
              tabClassName,
              { selected: selectedTab === tab }
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
    <div className={classNames("tabbed-interface", className)}>
      {renderTabs()}
      <div
        className={classNames(
          "tabbed-interface-body",
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
