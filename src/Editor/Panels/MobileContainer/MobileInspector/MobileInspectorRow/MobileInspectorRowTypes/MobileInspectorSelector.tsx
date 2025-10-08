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

import { Component } from 'react';

import MobileInspectorInput from '../MobileInspectorInput/MobileInspectorInput';

import '../_mobileinspectorrow.scss';

interface MobileInspectorSelectorProps {
  tooltip: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ name: string; value: string }>;
  className?: string;
}

class MobileInspectorSelector extends Component<MobileInspectorSelectorProps> {
  render(): JSX.Element {
    const idLabel = this.props.tooltip.replace(/\s+/g, '-').toLowerCase();
    return(
      <div className="mobile-inspector-row">
        {/* Identifier */} 
        <label htmlFor={idLabel + "-input-mobile"} className="mobile-inspector-row-identifier">
          {this.props.tooltip}
        </label>

        {/* Input */}
        <div className="mobile-inspector-large-input-container">
          <MobileInspectorInput 
            inputProps={{id: idLabel+ "-input-mobile"}}
            input={
              {
                type: "select",
                value: this.props.value,
                onChange: this.props.onChange,
                options: this.props.options,
                className: this.props.className,
              }
            } />
        </div>
      </div>
    );
  }
}

export default MobileInspectorSelector
