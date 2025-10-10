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

import { Component } from "react";
import HotKeyInterface from "Editor/hotKeyMap";
import ActionButton from "Editor/Util/ActionButton/ActionButton";
import type { HotKeyMap } from "Editor/types/hotkeys";

import "./_toolbutton.scss";

import classNames from "classnames";

export interface ToolButtonProps {
  name: string;
  tooltip: string;
  keyMap: HotKeyMap;
  getActiveToolName: () => string;
  setActiveTool?: (name: string) => void;
  action?: (e?: React.MouseEvent) => void;
  secondaryAction?: () => void;
  tooltipPlace?: 'top' | 'bottom' | 'left' | 'right';
  iconClassName?: string;
  dropdown?: boolean;
  className?: string;
}

class ToolButton extends Component<ToolButtonProps> {
  actionDefault: ((e?: React.MouseEvent) => void) | null;

  constructor(props: ToolButtonProps) {
    super(props);

    this.actionDefault = this.props.setActiveTool
      ? () => this.props.setActiveTool!(this.props.name)
      : null;
  }

  getHotKey = (action: string): string | undefined => {
    return HotKeyInterface.getHotKey(this.props.keyMap, action);
  };

  renderSelectButton = (): JSX.Element => {
    return (
      <ActionButton
        color="tool"
        isActive={() => this.props.getActiveToolName() === this.props.name}
        id={"tool-button-" + this.props.name}
        tooltip={this.props.tooltip}
        tooltipHotkey={this.getHotKey("activate-" + this.props.name)}
        action={this.props.action ? this.props.action : this.actionDefault!}
        secondaryAction={this.props.secondaryAction}
        tooltipPlace={
          this.props.tooltipPlace ? this.props.tooltipPlace : "bottom"
        }
        icon={this.props.name}
        className="tool-button-select"
        iconClassName={classNames("tool-button-icon", this.props.iconClassName)}
        dropdown={this.props.dropdown}
      />
    );
  };

  render(): JSX.Element {
    return (
      <div className={this.props.className ? this.props.className : ""}>
        <div className="tool-button-select-container">
          {this.renderSelectButton()}
        </div>
      </div>
    );
  }
}

export default ToolButton;
