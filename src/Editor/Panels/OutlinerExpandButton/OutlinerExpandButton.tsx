import React from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";

import "./_outlinerexpandbutton.scss";

import classNames from "classnames";

interface OutlinerExpandButtonProps {
  expanded: boolean;
  toggleOutliner: (e?: React.MouseEvent) => void;
}

const OutlinerExpandButton: React.FC<OutlinerExpandButtonProps> = ({ 
  expanded, 
  toggleOutliner 
}) => {
  return (
    <ActionButton
      color="tool"
      isActive={() => false}
      id="outliner-toggle"
      tooltip={expanded ? "Hide Outliner" : "Show Outliner"}
      action={toggleOutliner}
      tooltipPlace="left"
      icon="outliner"
      className="outliner-expand-button"
      iconClassName={classNames("outliner-toggle-icon", {
        "outliner-expand-button-closed": !expanded,
      })}
    />
  );
};

export default OutlinerExpandButton;
