import React from "react";

import ActionButton from "Editor/Util/ActionButton/ActionButton";

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
      containerClassName="outliner-expand-button absolute right-0 top-[35px] !h-[39px] !w-[39px] z-10"
      className="!border-[4px] !border-black !border-r-0 rounded-l-[3px] bg-[#303030] !text-black transition-[background-color] duration-200 has-hover:bg-[#3B3B3B]"
      iconClassName={classNames("outliner-toggle-icon", {
        "outliner-expand-button-closed scale-x-[-1]": !expanded,
      })}
    />
  );
};

export default OutlinerExpandButton;
