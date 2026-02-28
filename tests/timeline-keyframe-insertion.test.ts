import { describe, expect, it, vi } from "vitest";

import {
  duplicateClosestLeftFrameAt,
  getClosestLeftFrame,
} from "../src/Editor/Panels/Timeline/keyframeInsertion";

describe("getClosestLeftFrame", () => {
  it("returns the nearest frame on the left of target playhead", () => {
    const layer = {
      frames: [
        { start: 1, tweens: [] },
        { start: 4, tweens: [] },
        { start: 8, tweens: [] },
      ],
    };

    expect(getClosestLeftFrame(layer, 7)).toMatchObject({ start: 4 });
  });

  it("returns null when no frame exists to the left", () => {
    const layer = {
      frames: [{ start: 5, tweens: [] }],
    };

    expect(getClosestLeftFrame(layer, 5)).toBeNull();
    expect(getClosestLeftFrame(layer, 1)).toBeNull();
  });
});

describe("duplicateClosestLeftFrameAt", () => {
  it("copies the closest left frame into a one-frame keyframe at the target", () => {
    const removeSound = vi.fn();
    const removeAllTweens = vi.fn();
    const addFrame = vi.fn();
    const duplicate = {
      start: 1,
      end: 6,
      identifier: "LeftFrame",
      tweens: [],
      removeSound,
      removeAllTweens,
    };
    const sourceFrame = {
      start: 2,
      end: 6,
      identifier: "Source",
      tweens: [],
      copy: vi.fn(() => duplicate),
    };
    const layer = {
      frames: [sourceFrame],
      addFrame,
    };

    const result = duplicateClosestLeftFrameAt(layer, 10);

    expect(result).toBe(duplicate);
    expect(duplicate.identifier).toBeNull();
    expect(duplicate.start).toBe(10);
    expect(duplicate.end).toBe(10);
    expect(removeSound).toHaveBeenCalledTimes(1);
    expect(removeAllTweens).toHaveBeenCalledTimes(1);
    expect(addFrame).toHaveBeenCalledWith(duplicate);
  });

  it("returns null when duplication cannot be performed", () => {
    const layerWithoutLeftFrame = {
      frames: [],
      addFrame: vi.fn(),
    };
    const layerWithoutCopy = {
      frames: [{ start: 2, tweens: [] }],
      addFrame: vi.fn(),
    };

    expect(duplicateClosestLeftFrameAt(layerWithoutLeftFrame, 5)).toBeNull();
    expect(duplicateClosestLeftFrameAt(layerWithoutCopy, 5)).toBeNull();
  });
});
