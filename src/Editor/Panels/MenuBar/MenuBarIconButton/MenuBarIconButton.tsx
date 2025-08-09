import React, { Component } from 'react';
import './_menubariconbutton.scss';
import ActionButton from 'Editor/Util/ActionButton/ActionButton';

export type MenuBarIconButtonProps = {
  id?: string;
  tooltip?: string;
  action: () => void;
  icon: string;
};

export default class MenuBarIconButton extends Component<MenuBarIconButtonProps> {
  render() {
    return (
      <div className="menu-bar-icon-button">
        <ActionButton
          color="menu"
          id={this.props.id}
          tooltip={this.props.tooltip}
          action={this.props.action}
          icon={this.props.icon}
          tooltipPlace="bottom"
        />
      </div>
    );
  }
}

