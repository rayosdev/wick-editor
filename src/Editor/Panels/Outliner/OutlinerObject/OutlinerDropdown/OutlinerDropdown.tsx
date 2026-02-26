import React from 'react';
import classNames from "classnames";

import dropdownIcon from 'resources/outliner-icons/dropdown.svg';
import emptyDropdownIcon from 'resources/outliner-icons/empty_dropdown.svg';

interface OutlinerDropdownProps {
  collapsed: boolean;
  empty: boolean;
  toggle: () => void;
}

const OutlinerDropdown: React.FC<OutlinerDropdownProps> = ({
  collapsed,
  empty,
  toggle
}) => {
  const collapsedClass = collapsed ? "collapsed" : "expanded";

  return empty ? (
    <img
      className={classNames(
        "outliner-dropdown-icon empty",
        "relative z-[-1] ml-1 inline-block h-[12px] w-[12px] align-middle p-[3px]",
        "transition-colors duration-150 ease-in-out has-hover:bg-transparent"
      )}
      alt="dropdown-icon"
      src={emptyDropdownIcon}
    />
  ) : (
    <input
      type="image"
      className={classNames(
        "outliner-dropdown-icon",
        collapsedClass,
        "relative z-0 ml-1 h-[12px] w-[12px] align-middle",
        "transition-colors duration-150 ease-in-out has-hover:bg-white/20",
        !collapsed && "animate-outliner-dropdown-rotate"
      )}
      alt="dropdown-icon"
      src={dropdownIcon}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
    />
  );
};

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
