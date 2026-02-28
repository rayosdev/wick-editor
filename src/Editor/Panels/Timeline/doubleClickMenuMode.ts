import type { TimelineFrameLike } from "./Timeline.types";

export type DoubleClickMenuMode = "frame-strip" | "blank-strip" | "tween-strip";

export const resolveDoubleClickMenuMode = (
  closestLeftFrame: TimelineFrameLike | null | undefined,
): DoubleClickMenuMode => {
  if (!closestLeftFrame) {
    return "blank-strip";
  }

  const leftFrameTweens = Array.isArray(closestLeftFrame.tweens)
    ? closestLeftFrame.tweens
    : [];

  return leftFrameTweens.length > 0 ? "tween-strip" : "frame-strip";
};

export const shouldAutoRunDoubleClickInsert = (mode: DoubleClickMenuMode): boolean => {
  return mode === "blank-strip";
};
