import { useEffect, useState, type ReactElement, type ReactNode } from "react";
import { Popover } from "react-tiny-popover";
import classNames from "classnames";

import "./wickpopover-legacy.css";

type WickPopoverPosition = "left" | "right" | "top" | "bottom";
type WickPopoverAlign = "start" | "center" | "end";

interface WickPopoverProps {
  isOpen: boolean;
  content: ReactNode;
  children: ReactElement;
  targetId?: string;
  targetElement?: HTMLElement | null;
  positions?: WickPopoverPosition[];
  align?: WickPopoverAlign;
  padding?: number;
  reposition?: boolean;
  className?: string;
  onClickOutside?: (event: MouseEvent) => void;
}

const DEFAULT_POSITIONS: WickPopoverPosition[] = ["bottom", "top", "right", "left"];

const WickPopover: React.FC<WickPopoverProps> = ({
  isOpen,
  content,
  children,
  targetId,
  targetElement,
  positions = DEFAULT_POSITIONS,
  align = "center",
  padding = 6,
  reposition = true,
  className,
  onClickOutside,
}) => {
  const [resolvedTarget, setResolvedTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!targetId) {
      return;
    }

    const updateTarget = () => {
      setResolvedTarget(document.getElementById(targetId));
    };

    updateTarget();

    const observer = new MutationObserver(updateTarget);
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateTarget);
    };
  }, [targetId]);

  const parentElement = targetElement ?? resolvedTarget ?? undefined;

  return (
    <Popover
      isOpen={isOpen}
      parentElement={parentElement}
      positions={positions}
      align={align}
      padding={padding}
      reposition={reposition}
      onClickOutside={onClickOutside}
      containerClassName={classNames("wick-popover-container", className)}
      content={<div className="wick-popover-content">{content}</div>}
    >
      {children}
    </Popover>
  );
};

export default WickPopover;
