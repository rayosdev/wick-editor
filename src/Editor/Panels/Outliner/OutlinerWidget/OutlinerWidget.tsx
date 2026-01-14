import React from "react";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "../_outliner.scss";

import classNames from "classnames";

interface OutlinerLayerButtonsProps {
  tooltip: string;
  onClick: () => void;
  icon: string;
  on?: boolean;
}

const OutlinerLayerButtons: React.FC<OutlinerLayerButtonsProps> = ({
  tooltip,
  onClick,
  icon,
  on,
}) => {
  return (
    <ActionButton
      color="tool"
      id={`${tooltip}widget`}
      className="widget"
      action={() => {
        //e.stopPropagation();
        onClick();
      }}
      tooltip={tooltip}
      tooltipPlace="left"
      buttonClassName="no-bg"
      icon={icon}
      iconClassName={classNames(
        on === undefined || on ? "widget-on" : "widget-off"
      )}
    />
  );
};

export default OutlinerLayerButtons;
