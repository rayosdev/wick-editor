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

interface TabbedInterfaceState {
  selectedTab: string;
}

/**
 * TabbedInterface - A component that renders a tabbed interface with selectable tabs.
 * @param props - Component props
 * @param props.tabNames - Array of tab names to display
 * @param props.children - Array of React nodes to render for each tab body
 * @param props.onTabSelect - Optional callback when a tab is selected
 * @returns JSX.Element
 */
class TabbedInterface extends Component<TabbedInterfaceProps, TabbedInterfaceState> {
  constructor(props: TabbedInterfaceProps) {
    super(props);

    this.state = {
      selectedTab: this.props.tabNames[0] || '',
    };
  }

  // Selects the tab of the given name.
  selectTab = (name: string): void => {
    this.setState({
      selectedTab: name,
    });

    if (this.props.onTabSelect) {
      this.props.onTabSelect(name);
    }
  };

  /**
   * Renders the selectable tab bar.
   */
  renderTabs = (): JSX.Element => {
    return (
      <div role="tablist" className="tabbed-interface-main-tab-container">
        {this.props.tabNames.map((tab, i) => (
          <button
            key={`tab-${tab}-${i}`}
            className={classNames(
              "tabbed-interface-main-tab",
              this.props.tabClassName,
              { selected: this.state.selectedTab === tab }
            )}
            onClick={() => {
              this.selectTab(tab);
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  render(): JSX.Element {
    return (
      <div className={classNames("tabbed-interface", this.props.className)}>
        {this.renderTabs()}
        <div
          className={classNames(
            "tabbed-interface-body",
            this.props.bodyClassName
          )}
        >
          {
            this.props.children[
              this.props.tabNames.indexOf(this.state.selectedTab)
            ]
          }
        </div>
      </div>
    );
  }
}

export default TabbedInterface;
