import type { TimelineFrameLike, TimelineLayerLike } from "./Timeline.types";

export const getClosestLeftFrame = (
  layer: TimelineLayerLike,
  playheadPosition: number
): TimelineFrameLike | null => {
  const leftFrames = layer.frames.filter((candidateFrame) => {
    const start = Number(candidateFrame.start ?? 1);
    return Number.isFinite(start) && start < playheadPosition;
  });

  return leftFrames.sort((a, b) => Number(b.start ?? 1) - Number(a.start ?? 1))[0] ?? null;
};

export const duplicateClosestLeftFrameAt = (
  layer: TimelineLayerLike,
  targetPlayheadPosition: number
): TimelineFrameLike | null => {
  const sourceFrame = getClosestLeftFrame(layer, targetPlayheadPosition);
  if (
    !sourceFrame ||
    typeof sourceFrame.copy !== "function" ||
    typeof layer.addFrame !== "function"
  ) {
    return null;
  }

  const duplicatedFrame = sourceFrame.copy();
  duplicatedFrame.identifier = null;
  duplicatedFrame.start = targetPlayheadPosition;
  duplicatedFrame.end = targetPlayheadPosition;
  duplicatedFrame.removeSound?.();
  duplicatedFrame.removeAllTweens?.();
  layer.addFrame(duplicatedFrame);

  return duplicatedFrame;
};
