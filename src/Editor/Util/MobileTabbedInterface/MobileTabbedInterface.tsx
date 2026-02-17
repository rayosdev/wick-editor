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

interface MobileTab {
  label: string;
  icon: string;
  iconActive: string;
  alt: string;
}

interface MobileTabbedInterfaceProps {
  tabs: MobileTab[];
  children: ReactNode[];
  className?: string;
  tabClassName?: string;
  bodyClassName?: string;
  onTabSelect?: (label: string) => void;
}

/**
 * MobileTabbedInterface - A mobile-optimized tabbed interface with icons.
 * @param props - Component props
 * @param props.tabs - Array of tab objects with label, icon, iconActive, and alt
 * @param props.children - Array of React nodes to render for each tab body
 * @param props.onTabSelect - Optional callback when a tab is selected
 * @returns JSX.Element
 */
const MobileTabbedInterface: React.FC<MobileTabbedInterfaceProps> = ({
  tabs,
  children,
  className,
  tabClassName,
  bodyClassName,
  onTabSelect
}) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]?.label || '');

  // Selects the tab of the given label.
  const selectTab = (label: string): void => {
    setSelectedTab(label);

    if (onTabSelect) {
      onTabSelect(label);
    }
  };

  /**
   * Renders the selectable tab bar.
   */
  const renderTabs = (): JSX.Element => {
    return (
      <div
        role="tablist"
        className="mobile-tabbed-interface-main-tab-container flex min-h-[42px] w-full flex-row items-end justify-between bg-[#666666]"
      >
        {tabs.map((tab, i) => (
          <button
            key={`tab-${tab.label}-${i}`}
            className={classNames(
              "mobile-tabbed-interface-main-tab h-full min-h-[34px] w-[22%] cursor-pointer rounded-t-[5px] border-0 bg-[#191919]",
              `mobile-${tab.label}-tab`,
              tabClassName,
              {
                "selected min-h-[42px] border-t-4 border-wick-green transition-[border-color,min-height] duration-[400ms]":
                  selectedTab === tab.label,
                "border-t-[#FA8A87]": selectedTab === tab.label && tab.label === "timeline",
                "border-t-[#4FF7DE]": selectedTab === tab.label && tab.label === "inspector",
                "border-t-[#FA73FA]": selectedTab === tab.label && tab.label === "code",
                "border-t-[#BAFA98]": selectedTab === tab.label && tab.label === "asset",
              }
            )}
            onClick={() => {
              selectTab(tab.label);
            }}
          >
            <img
              className={classNames(
                "mobile-tabbed-interface-icon m-auto",
                `mobile-${tab.label}-tab-icon`
              )}
              src={
                selectedTab === tab.label ? tab.iconActive : tab.icon
              }
              alt={tab.alt}
            ></img>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div
      className={classNames("mobile-tabbed-interface h-full w-full bg-transparent", className)}
    >
      {renderTabs()}
      <div
        className={classNames(
          "mobile-tabbed-interface-body h-[calc(100%_-_42px)] w-full bg-[#191919]",
          bodyClassName
        )}
      >
        {
          children[
          tabs
            .map((tab) => tab.label)
            .indexOf(selectedTab)
          ]
        }
      </div>
    </div>
  );
};

export default MobileTabbedInterface;
