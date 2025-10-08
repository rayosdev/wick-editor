import { Component } from 'react';

import './_outlinerdropdown.scss';

import dropdownIcon from 'resources/outliner-icons/dropdown.svg';
import emptyDropdownIcon from 'resources/outliner-icons/empty_dropdown.svg';

interface OutlinerDropdownProps {
  collapsed: boolean;
  empty: boolean;
  toggle: () => void;
}

class OutlinerDropdown extends Component<OutlinerDropdownProps> {
  render(): JSX.Element {
    const collapsed = this.props.collapsed ? "collapsed" : "expanded";
    return (
      this.props.empty ? 
        <img
          className="outliner-dropdown-icon empty"
          alt="dropdown-icon"
          src={emptyDropdownIcon}
        />
        :
        <input
          type="image" 
          className={"outliner-dropdown-icon " + collapsed}
          alt="dropdown-icon"
          src={dropdownIcon}
          onClick={(e) => {
            e.stopPropagation();
            this.props.toggle();
          }}
        />
    );
  }
}

export default OutlinerDropdown;

/*  <button
        className="outliner-dropdown"
        onClick={(e) => {
          e.stopPropagation();
          this.props.toggle();
        }}
        >
          <img
          className={"outliner-dropdown-icon" + collapsed}
          src={dropdownIcon}
          alt="dropdown"
          />
        </button>*/