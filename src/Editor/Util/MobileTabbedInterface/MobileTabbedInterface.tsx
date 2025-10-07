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

import { Component, ReactNode } from "react";

import "./_mobiletabbedinterface.scss";

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

interface MobileTabbedInterfaceState {
  selectedTab: string;
}

/**
 * MobileTabbedInterface - A mobile-optimized tabbed interface with icons.
 * @param props - Component props
 * @param props.tabs - Array of tab objects with label, icon, iconActive, and alt
 * @param props.children - Array of React nodes to render for each tab body
 * @param props.onTabSelect - Optional callback when a tab is selected
 * @returns JSX.Element
 */
class MobileTabbedInterface extends Component<MobileTabbedInterfaceProps, MobileTabbedInterfaceState> {
  constructor(props: MobileTabbedInterfaceProps) {
    super(props);

    this.state = {
      selectedTab: this.props.tabs[0]?.label || '',
    };
  }

  // Selects the tab of the given label.
  selectTab = (label: string): void => {
    this.setState({
      selectedTab: label,
    });

    if (this.props.onTabSelect) {
      this.props.onTabSelect(label);
    }
  };

  /**
   * Renders the selectable tab bar.
   */
  renderTabs = (): JSX.Element => {
    return (
      <div
        role="tablist"
        className="mobile-tabbed-interface-main-tab-container"
      >
        {this.props.tabs.map((tab, i) => (
          <button
            key={`tab-${tab.label}-${i}`}
            className={classNames(
              "mobile-tabbed-interface-main-tab",
              "mobile-" + tab.label + "-tab",
              this.props.tabClassName,
              { selected: this.state.selectedTab === tab.label }
            )}
            onClick={() => {
              this.selectTab(tab.label);
            }}
          >
            <img
              className={classNames(
                "mobile-tabbed-interface-icon",
                "mobile-" + tab.label + "-tab-icon"
              )}
              src={
                this.state.selectedTab === tab.label ? tab.iconActive : tab.icon
              }
              alt={tab.alt}
            ></img>
          </button>
        ))}
      </div>
    );
  };

  render(): JSX.Element {
    return (
      <div
        className={classNames("mobile-tabbed-interface", this.props.className)}
      >
        {this.renderTabs()}
        <div
          className={classNames(
            "mobile-tabbed-interface-body",
            this.props.bodyClassName
          )}
        >
          {
            this.props.children[
              this.props.tabs
                .map((tab) => tab.label)
                .indexOf(this.state.selectedTab)
            ]
          }
        </div>
      </div>
    );
  }
}

export default MobileTabbedInterface;
