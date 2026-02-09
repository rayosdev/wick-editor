import { describe, expect, it } from "vitest";

import sounds from "../src/Editor/Modals/BuiltinLibrary/sounds";
import wickobjects from "../src/Editor/Modals/BuiltinLibrary/wickobjects";

describe("builtin library data", () => {
  it("has expected category names", () => {
    expect(wickobjects.name).toBe("Clips");
    expect(sounds.name).toBe("Sounds");
  });

  it("contains assets in both catalogs", () => {
    expect(wickobjects.assets.length).toBeGreaterThan(0);
    expect(sounds.assets.length).toBeGreaterThan(0);
  });

  it("contains valid wick object entries", () => {
    wickobjects.assets.forEach((asset) => {
      expect(asset.file.endsWith(".wickobj")).toBe(true);
      expect(asset.name.trim()).not.toBe("");
      expect(asset.icon).toBeDefined();
      expect(asset.icon?.startsWith("icons/")).toBe(true);
    });
  });

  it("contains valid sound entries with attribution", () => {
    sounds.assets.forEach((asset) => {
      expect(asset.file.endsWith(".ogg")).toBe(true);
      expect(asset.name.trim()).not.toBe("");
      expect(asset.credit.trim()).not.toBe("");
      expect(asset.license.trim()).not.toBe("");
      expect(asset.licenseLink.startsWith("https://")).toBe(true);
      expect(asset.link.startsWith("https://")).toBe(true);
    });
  });

  it("does not duplicate asset file names", () => {
    const files = [...wickobjects.assets, ...sounds.assets].map((asset) => asset.file);
    const uniqueFiles = new Set(files);
    expect(uniqueFiles.size).toBe(files.length);
  });
});
