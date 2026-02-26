import { useState } from "react";
import { Popover } from "react-tiny-popover";

import WickInputV2LegacyAdapter from "Editor/Util/WickInputV2/WickInputV2LegacyAdapter";
import ToolIcon from "Editor/Util/ToolIcon/ToolIcon";

import "Editor/styles/Panels/Toolbox/settingsnumericslider.css";

import classNames from "classnames";

interface SettingsNumericSliderProps {
  icon: string;
  isMobile?: boolean;
  onChange: (value: number) => void;
  value: number;
  inputRestrictions?: Record<string, unknown>;
}

export default function SettingsNumericSlider(props: SettingsNumericSliderProps): JSX.Element {
  const [sliderOn, setSliderOn] = useState(false);

  return (
    <div className="settings-numeric-slider">
      <ToolIcon
        name={props.icon}
        className={classNames("settings-numeric-slider-icon", {
          mobile: props.isMobile,
        })}
      />

      <Popover
        isOpen={sliderOn}
        positions={["bottom", "top", "right", "left"]}
        content={
          <div className="settings-numeric-slider-container">
            <WickInputV2LegacyAdapter
              type="slider"
              containerclassname="settings-slider-wick-input-container"
              className="settings-numeric-slider"
              onChange={props.onChange}
              value={props.value}
              {...props.inputRestrictions}
            />
          </div>
        }
        onClickOutside={() => {
          setSliderOn(false);
        }}
      >
        <WickInputV2LegacyAdapter
          type="numeric"
          className={classNames("settings-numeric-input", {
            mobile: props.isMobile,
          })}
          disableBasePadding
          onChange={props.onChange}
          onFocus={() => {
            setSliderOn(true);
          }}
          onBlur={() => {
            setSliderOn(false);
          }}
          onClick={() => {
            setSliderOn(true);
          }}
          value={props.value}
          {...props.inputRestrictions}
        />
      </Popover>
    </div>
  );
}
