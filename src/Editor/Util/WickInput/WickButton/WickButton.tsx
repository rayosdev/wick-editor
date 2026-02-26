import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type TouchEvent,
} from "react";
import { isMobile } from "react-device-detect";

import classNames from "classnames";
import {
  DEFAULT_DOUBLE_TAP_WINDOW_MS,
  TOOLTIP_LONG_PRESS_MS,
  hasMovedBeyondThreshold,
} from "Editor/Util/WickInput/tooltipBehavior";

interface WickButtonProps {
  onClick?: () => void;
  secondaryAction?: () => void;
  onLongPress?: () => void;
  longPressMs?: number;
  consumeClickAfterLongPress?: boolean;
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
  const clickResetTimerRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressTriggeredRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const clearClickResetTimer = (): void => {
    if (clickResetTimerRef.current !== null) {
      window.clearTimeout(clickResetTimerRef.current);
      clickResetTimerRef.current = null;
    }
  };

  const clearLongPressTimer = (): void => {
    if (longPressTimerRef.current !== null) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearClickResetTimer();
      clearLongPressTimer();
    };
  }, []);

  /**
   * Initiates a delayed action, and fires double click if it exists.
   */
  function handleTapAction() {
    if (props.secondaryAction) {
      if (clicked) {
        // doubleclick
        props.secondaryAction();
        setClicked(false);
        clearClickResetTimer();
      } else {
        // Do the Action.
        props.onClick && props.onClick();
        setClicked(true);

        // Prepare for double clicks.
        clearClickResetTimer();
        clickResetTimerRef.current = window.setTimeout(() => {
          setClicked(false);
          clickResetTimerRef.current = null;
        }, DEFAULT_DOUBLE_TAP_WINDOW_MS);
      }
    } else {
      props.onClick && props.onClick();
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLButtonElement>) {
    props.buttonProps?.onTouchStart?.(event);

    const touch = event.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    } else {
      touchStartRef.current = null;
    }
    longPressTriggeredRef.current = false;
    clearLongPressTimer();

    if (props.onLongPress) {
      longPressTimerRef.current = window.setTimeout(() => {
        longPressTriggeredRef.current = true;
        props.onLongPress?.();
        longPressTimerRef.current = null;
      }, props.longPressMs ?? TOOLTIP_LONG_PRESS_MS);
    }
  }

  function handleTouchMove(event: TouchEvent<HTMLButtonElement>) {
    props.buttonProps?.onTouchMove?.(event);

    const start = touchStartRef.current;
    const touch = event.touches[0];
    if (!start || !touch) {
      return;
    }

    if (
      hasMovedBeyondThreshold(start.x, start.y, touch.clientX, touch.clientY)
    ) {
      clearLongPressTimer();
    }
  }

  function handleTouchEnd(event: TouchEvent<HTMLButtonElement>) {
    props.buttonProps?.onTouchEnd?.(event);
    clearLongPressTimer();
    touchStartRef.current = null;

    const shouldConsumeClick =
      props.consumeClickAfterLongPress !== undefined
        ? props.consumeClickAfterLongPress
        : true;
    if (longPressTriggeredRef.current && shouldConsumeClick) {
      longPressTriggeredRef.current = false;
      return;
    }

    longPressTriggeredRef.current = false;
    handleTapAction();
  }

  function handleTouchCancel(event: TouchEvent<HTMLButtonElement>) {
    props.buttonProps?.onTouchCancel?.(event);
    clearLongPressTimer();
    longPressTriggeredRef.current = false;
    touchStartRef.current = null;
  }

  function handleDesktopClick(event: MouseEvent<HTMLButtonElement>) {
    props.buttonProps?.onClick?.(event);
    handleTapAction();
  }

  return (
    <button
      {...props.buttonProps}
      onTouchStart={isMobile ? handleTouchStart : props.buttonProps?.onTouchStart}
      onTouchMove={isMobile ? handleTouchMove : props.buttonProps?.onTouchMove}
      onTouchEnd={isMobile ? handleTouchEnd : props.buttonProps?.onTouchEnd}
      onTouchCancel={isMobile ? handleTouchCancel : props.buttonProps?.onTouchCancel}
      onClick={isMobile ? undefined : handleDesktopClick}
      className={classNames(
        "wick-button flex h-full w-full cursor-pointer items-center justify-center rounded-[2px] border-0 p-[2px] text-center no-underline",
        props.className
      )}
    >
      {props.children}
    </button>
  );
}
