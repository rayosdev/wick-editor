import { describe, expect, it } from "vitest";

import HotKeyInterface from "Editor/hotKeyMap";

const createHotKeys = (): HotKeyInterface => {
  return new HotKeyInterface({} as never);
};

describe("timeline shortcut preset hotkeys", () => {
  it("uses wick timeline defaults by default", () => {
    const hotkeys = createHotKeys();
    const map = hotkeys.getKeyMap();

    expect(map["extend-frame"]?.sequences[0]).toBe("shift+.");
    expect(map["cut-frame"]?.sequences[0]).toBe("shift+c");
    expect(map["insert-blank-frame"]?.sequences[0]).toBe("shift+8");
    expect(map["shrink-frame"]?.sequences[0]).toBe("shift+,");
  });

  it("applies flash timeline mappings when preset is flash", () => {
    const hotkeys = createHotKeys();
    hotkeys.setTimelineShortcutPreset("flash");
    const map = hotkeys.getKeyMap();

    expect(map["extend-frame"]?.sequences[0]).toBe("f5");
    expect(map["cut-frame"]?.sequences[0]).toBe("f6");
    expect(map["insert-blank-frame"]?.sequences[0]).toBe("f7");
    expect(map["shrink-frame"]?.sequences[0]).toBe("shift+f5");

    // Non-overridden timeline actions keep existing defaults.
    expect(map["create-tween"]?.sequences[0]).toBe("shift+t");
  });

  it("keeps custom overrides above preset overrides", () => {
    const hotkeys = createHotKeys();
    hotkeys.setTimelineShortcutPreset("flash");
    hotkeys.setCustomHotKeys({
      "extend-frame": ["alt+e"],
      "insert-blank-frame": ["alt+b"],
    });

    const map = hotkeys.getKeyMap();
    expect(map["extend-frame"]?.sequences[0]).toBe("alt+e");
    expect(map["insert-blank-frame"]?.sequences[0]).toBe("alt+b");
    expect(map["cut-frame"]?.sequences[0]).toBe("f6");
  });
});
