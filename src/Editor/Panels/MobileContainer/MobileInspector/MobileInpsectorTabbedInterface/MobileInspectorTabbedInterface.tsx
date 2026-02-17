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

import { useState, ReactNode } from "react";

import classNames from "classnames";

interface TabConfig {
  label: string;
  icon: string;
  iconActive: string;
  alt: string;
}

interface MobileInspectorTabbedInterfaceProps {
  tabs: TabConfig[];
  children: ReactNode[];
  className?: string;
  tabClassName?: string;
  bodyClassName?: string;
}

export default function MobileInspectorTabbedInterface(props: MobileInspectorTabbedInterfaceProps): JSX.Element {
  const [selectedTab, setSelectedTab] = useState(props.tabs[0]?.label || '');

  /**
   * Renders the selectable tab bar.
   */
  function renderTabs(): JSX.Element {
    return (
      <div
        role="tablist"
        className="mobile-inspector-tabbed-interface-main-tab-container flex min-h-10 w-full flex-row items-end justify-start bg-[#191919] pt-[5px]"
      >
        {props.tabs.map((tab, i) => (
          <button
            key={`tab-${tab.label}-${i}`}
            className={classNames(
              "mobile-inspector-tabbed-interface-main-tab mr-[5px] h-full min-h-10 w-[15%] cursor-pointer rounded-t-[5px] border-0 border-b-[3px] border-b-[#484747] bg-[#262626] first:ml-0",
              "mobile-inspector-" + tab.label + "-tab",
              props.tabClassName,
              {
                "selected border-b-wick-green bg-[#303030] transition-[background-color,border-color] duration-[400ms]":
                  tab.label === selectedTab,
              }
            )}
            onClick={() => {
              setSelectedTab(tab.label);
            }}
          >
            <img
              className={classNames(
                "mobile-inspector-tabbed-interface-icon m-auto",
                "mobile-inspector-" + tab.label + "-tab-icon"
              )}
              src={selectedTab === tab.label ? tab.iconActive : tab.icon}
              alt={tab.alt}
            />
          </button>
        ))}
      </div>
    );
  }

  const children = props.children.filter((obj) => obj);
  return (
    <div
      className={classNames(
        "mobile-inspector-tabbed-interface h-full w-full bg-[#191919]",
        props.className
      )}
    >
      {renderTabs()}
      <div
        className={classNames(
          "mobile-inspector-tabbed-interface-body h-[calc(100%_-_40px)] w-full bg-[#303030]",
          props.bodyClassName
        )}
      >
        {children[props.tabs.map((tab) => tab.label).indexOf(selectedTab)]}
      </div>
    </div>
  );
}
