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

import React from 'react';

import OutlinerWidget from '../../OutlinerWidget/OutlinerWidget';
import type { DisplayKey, DisplayOptions } from '../../Outliner';

interface OutlinerDisplayProps {
  tooltip: string;
  display: DisplayOptions;
  onChange: (display: DisplayOptions) => void;
}

const OutlinerDisplay: React.FC<OutlinerDisplayProps> = ({ tooltip, display, onChange }) => {
  const items: Record<DisplayKey, string> = {
    path: "path-object",
    button: "button-object",
    clip: "clip-object",
    text: "text-object",
    image: "image-object"
  };
  const itemKeys = Object.keys(items) as DisplayKey[];

  return (
    <div className="outliner-row mb-0 flex h-[26px] w-full items-center">
      {/* Identifier */}
      <span className="outliner-row-identifier mt-[3px] flex h-full w-[30%] max-w-[30%] items-center justify-center overflow-hidden whitespace-nowrap pl-0 pr-[1%] text-right text-[16px] font-bold text-editor-text-primary">
        {tooltip}
      </span>
      {/* Input */}
      <span className="outliner-input-container ml-1 flex h-[90%] w-[70%] items-center">
        {itemKeys.map((item) => {
          return (
            <OutlinerWidget
              tooltip={`${display[item] ? "Hide " : "Show "}${item.charAt(0).toUpperCase()}${item.slice(1)} Objects`}
              key={item}
              onClick={() => {
                const newDisplay = { ...display };
                newDisplay[item] = !newDisplay[item];
                onChange(newDisplay);
              }}
              icon={items[item] || ''}
              on={display[item]}
            />);
        })}
      </span>
    </div>
  );
};

export default OutlinerDisplay;
/*
renderDisplay = () => {
  
  return (
    <div className="wick-display-container">
      {Object.keys(items).map((item) => {
        let is_displayed = this.props.display[item] ? "true" : "false";
        
        return (
          <img 
            alt={item}
            src={items[item]}
            className={"wick-display-item " + is_displayed}
            onClick={() => {
              var newDisplay = {...this.props.display};
              newDisplay[item] = !newDisplay[item];
              this.props.onChange(newDisplay);
              }
            }
          />
        );
      })}
    </div>
  );
}

.wick-display-item {
  padding-right: 2px;
  width: 17px;
}
.false {
  opacity: 0.25;
}
.true {
  opacity: 1.0;
}*/
