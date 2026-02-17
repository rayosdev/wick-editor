import { describe, expect, it, vi } from "vitest";
import { installWickCompat } from "../src";
import type { WickCompatApi } from "../src/types";

class MockProject {
  loaded = false;

  loadFromData(): void {
    this.loaded = true;
  }

  static fromData(): MockProject {
    return new MockProject();
  }
}

function createMockWick(): WickCompatApi {
  return {
    version: "legacy-1.0.0",
    resourcepath: "corelibs/wick-engine/",
    _originals: {},
    Project: MockProject,
    Clip: { animationTypes: { loop: "Loop" } },
    ClipAsset: class ClipAsset {},
    Color: class Color {},
    FileAsset: { getValidExtensions: () => [".wick"] },
    GIFAsset: { fromImages: vi.fn() },
    HTMLExport: { bundleProject: vi.fn() },
    HTMLPreview: { previewProject: vi.fn() },
    History: { StateType: { ONLY_VISIBLE_OBJECTS: "ONLY_VISIBLE_OBJECTS" } },
    ImageAsset: class ImageAsset {},
    ImageSequence: { toPNGSequence: vi.fn() },
    Layer: class Layer {},
    ObjectCache: { getObjectByUUID: vi.fn() },
    SVGAsset: class SVGAsset {},
    SVGFile: { toSVGFile: vi.fn() },
    Tween: { VALID_EASING_TYPES: ["linear", "easeIn"] },
    WickFile: {
      fromWickFile: (_file: unknown, callback: (project: unknown) => void) => {
        callback(new MockProject());
      },
      toWickFile: vi.fn()
    },
    WickObjectFile: {
      toWickObjectFile: vi.fn()
    },
    ZIPExport: { bundleProject: vi.fn() },
    AutoSave: {
      delete: vi.fn(),
      generateAutosaveData: vi.fn(),
      generateProjectFromAutosaveData: (_data: unknown, callback: (project: unknown) => void) => {
        callback(new MockProject());
      },
      getAutosavesList: vi.fn(),
      load: (_projectId: string, callback: (project: unknown) => void) => {
        callback(new MockProject());
      },
      save: vi.fn()
    }
  };
}

describe("installWickCompat", () => {
  it("tracks the active project from construction and static fromData", () => {
    const wick = createMockWick();

    installWickCompat(wick);

    const projectA = new (wick.Project as typeof MockProject)();
    expect(wick.project).toBe(projectA);

    const projectB = (wick.Project as typeof MockProject).fromData();
    expect(wick.project).toBe(projectB);
  });

  it("tracks projects loaded through callback-based loaders", () => {
    const wick = createMockWick();

    installWickCompat(wick);

    let loadedFromWickFile: unknown;
    wick.WickFile.fromWickFile({}, (project: unknown) => {
      loadedFromWickFile = project;
    });
    expect(wick.project).toBe(loadedFromWickFile);

    let loadedFromAutosave: unknown;
    wick.AutoSave.load("abc", (project: unknown) => {
      loadedFromAutosave = project;
    });
    expect(wick.project).toBe(loadedFromAutosave);
  });

  it("exposes rewrite metadata and allows API overrides", () => {
    const wick = createMockWick();

    installWickCompat(wick);

    const replacement = vi.fn();
    wick.__compat?.registerOverride("HTMLExport.bundleProject", replacement);

    expect(wick.__compat?.mode).toBe("bridge");
    expect(wick.__compat?.legacyVersion).toBe("legacy-1.0.0");
    expect(wick.HTMLExport.bundleProject).toBe(replacement);
    expect(wick.__compat?.resolve("HTMLExport.bundleProject")).toBe(replacement);
  });

  it("reports missing surface and throws in strict mode", () => {
    const wick = createMockWick();
    delete wick.WickObjectFile;

    const warn = vi.fn();

    installWickCompat(wick, { logger: { warn } });

    expect(warn).toHaveBeenCalledTimes(1);
    expect(wick.__compat?.getMissingSurface()).toContain("WickObjectFile.toWickObjectFile");

    expect(() => installWickCompat(createMockWick(), { strictSurface: true })).not.toThrow();

    const missing = createMockWick();
    delete missing.WickObjectFile;
    expect(() => installWickCompat(missing, { strictSurface: true })).toThrow(
      /missing required Wick API surface/i
    );
  });
});
