import { describe, expect, it } from "vitest";

import {
  resolveDoubleClickMenuMode,
  shouldAutoRunDoubleClickInsert,
} from "../src/Editor/Panels/Timeline/doubleClickMenuMode";

describe("resolveDoubleClickMenuMode", () => {
  it("defaults to blank-strip when no left keyframe exists", () => {
    expect(resolveDoubleClickMenuMode(null)).toBe("blank-strip");
    expect(resolveDoubleClickMenuMode(undefined)).toBe("blank-strip");
  });

  it("uses frame-strip when left keyframe has no tweens", () => {
    expect(resolveDoubleClickMenuMode({ tweens: [] })).toBe("frame-strip");
  });

  it("uses tween-strip when left keyframe has tween data", () => {
    expect(resolveDoubleClickMenuMode({ tweens: [{}], contentful: true })).toBe("tween-strip");
  });

  it("does not use tween-strip when left keyframe is not contentful", () => {
    expect(resolveDoubleClickMenuMode({ tweens: [{}], contentful: false })).toBe("frame-strip");
  });
});

describe("shouldAutoRunDoubleClickInsert", () => {
  it("auto-runs only for blank-strip mode", () => {
    expect(shouldAutoRunDoubleClickInsert("blank-strip")).toBe(true);
    expect(shouldAutoRunDoubleClickInsert("frame-strip")).toBe(false);
    expect(shouldAutoRunDoubleClickInsert("tween-strip")).toBe(false);
  });
});
