import React from "react";
import ActionButton from "Editor/Util/ActionButton/ActionButton";

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
      className="widget !mr-1 !h-[18px] !w-[18px] max-h-[18px] max-w-[18px] rounded-[3px] border-0 bg-transparent p-0 transition-colors duration-150 ease-in-out"
      action={() => {
        //e.stopPropagation();
        onClick();
      }}
      tooltip={tooltip}
      tooltipPlace="left"
      buttonClassName="no-bg"
      icon={icon}
      iconClassName={classNames(
        on === undefined || on ? "widget-on opacity-100" : "widget-off opacity-25",
        "!h-[18px] !max-h-[18px] align-top"
      )}
    />
  );
};

export default OutlinerLayerButtons;
