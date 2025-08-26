import React, { Component } from 'react';

import ActionButton from 'Editor/Util/ActionButton/ActionButton';
import { OutlinerExpandButtonProps } from '../../../types/component-props';

import './_outlinerexpandbutton.scss';

import classNames from "classnames";

class OutlinerExpandButton extends Component<OutlinerExpandButtonProps> {
  render () {
    
    return (
      <ActionButton
      color="tool"
      isActive={ () => false }
      id="outliner-toggle"
      tooltip={this.props.expanded ? "Hide Outliner" : "Show Outliner"}
      action={this.props.toggleOutliner}
      tooltipPlace="left"
      icon="outliner"
      className="outliner-expand-button"
      iconClassName={classNames("outliner-toggle-icon", {"outliner-expand-button-closed": !this.props.expanded})}
      />
    );
  }
}

export default OutlinerExpandButton