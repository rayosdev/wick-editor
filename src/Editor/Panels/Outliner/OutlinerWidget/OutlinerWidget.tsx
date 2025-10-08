import { Component } from "react";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "../_outliner.scss";

import classNames from "classnames";

interface OutlinerLayerButtonsProps {
  tooltip: string;
  onClick: () => void;
  icon: string;
  on?: boolean;
}

class OutlinerLayerButtons extends Component<OutlinerLayerButtonsProps> {
  render(): JSX.Element {
    return (
      <ActionButton
        color="tool"
        id={this.props.tooltip + "widget"}
        className="widget"
        action={() => {
          //e.stopPropagation();
          this.props.onClick();
        }}
        tooltip={this.props.tooltip}
        tooltipPlace="left"
        buttonClassName="no-bg"
        icon={this.props.icon}
        iconClassName={classNames(
          this.props.on === undefined || this.props.on
            ? "widget-on"
            : "widget-off"
        )}
      />
    );
  }
}

export default OutlinerLayerButtons;
