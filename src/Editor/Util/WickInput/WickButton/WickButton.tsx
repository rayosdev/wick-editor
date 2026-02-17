import { useState, ReactNode, ButtonHTMLAttributes } from "react";
import { isMobile } from "react-device-detect";

import classNames from "classnames";

interface WickButtonProps {
  onClick?: () => void;
  secondaryAction?: () => void;
  className?: string;
  children?: ReactNode;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

/**
 * Wick Button
 *
 * Double Click Rules:
 * - Will always perform the single click action.
 * - Will perform the secondary action on a double click within 500 ms.
 */
export default function WickButton(props: WickButtonProps): JSX.Element {
  const [clicked, setClicked] = useState(false);

  /**
   * Initiates a delayed action, and fires double click if it exists.
   */
  function handleClick() {
    if (props.secondaryAction) {
      if (clicked) {
        // doubleclick
        props.secondaryAction();
        setClicked(false);
      } else {
        // Do the Action.
        props.onClick && props.onClick();
        setClicked(true);

        // Prepare for double clicks.
        setTimeout(() => {
          setClicked(false);
        }, 500);
      }
    } else {
      props.onClick && props.onClick();
    }
  }

  return (
    <button
      {...props.buttonProps}
      onTouchStart={isMobile ? handleClick : undefined}
      onClick={isMobile ? undefined : handleClick}
      className={classNames(
        "wick-button flex h-full w-full cursor-pointer items-center justify-center rounded-[2px] border-0 p-[2px] text-center no-underline",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
