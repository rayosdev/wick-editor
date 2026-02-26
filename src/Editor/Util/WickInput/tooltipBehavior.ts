export const TOOLTIP_HOVER_DELAY_MS = 650;
export const TOOLTIP_LONG_PRESS_MS = 650;
export const TOUCH_MOVE_CANCEL_PX = 12;

export const DEFAULT_DOUBLE_TAP_WINDOW_MS = 500;

export const hasMovedBeyondThreshold = (
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  thresholdPx: number = TOUCH_MOVE_CANCEL_PX,
): boolean => {
  return (
    Math.abs(currentX - startX) > thresholdPx ||
    Math.abs(currentY - startY) > thresholdPx
  );
};
