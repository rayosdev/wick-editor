import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { afterEach, describe, expect, it, vi } from "vitest";

type ClipboardInstance = {
  copyObjectsToClipboard: (project: unknown, objects: unknown[]) => void;
  pasteObjectsFromClipboard: (project: unknown) => boolean;
};

type ClipboardContext = vm.Context & {
  Wick: {
    Project: new () => { activeFrame: null };
    Frame: new () => unknown;
    Tween: new () => unknown;
    Path: new () => unknown;
    Clip: new () => unknown;
    Base: { import: () => { copy: () => unknown } };
    Clipboard: new () => ClipboardInstance;
  };
  localStorage: Record<string, string>;
};

const clipboardSourcePath = path.resolve(process.cwd(), "engine/src/Clipboard.ts");
const clipboardSource = fs.readFileSync(clipboardSourcePath, "utf8");

function createClipboardContext(): ClipboardContext {
  const Project = class {
    activeFrame: null = null;
  };
  const Frame = class {};
  const Tween = class {};
  const Path = class {};
  const Clip = class {};
  const Base = {
    import: () => ({
      copy: () => ({}),
    }),
  };

  const context = vm.createContext({
    Wick: {
      Project,
      Frame,
      Tween,
      Path,
      Clip,
      Base,
    },
    localStorage: {},
    console,
    Number,
    JSON,
    Infinity,
  });

  vm.runInContext(clipboardSource, context, {
    filename: clipboardSourcePath,
  });

  return context as ClipboardContext;
}

describe("Clipboard project guards", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs a guard error when copy receives a non-project object", () => {
    const context = createClipboardContext();
    const clipboard = new context.Wick.Clipboard();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    clipboard.copyObjectsToClipboard({ activeFrame: null }, []);

    expect(errorSpy).toHaveBeenCalledWith(
      "copyObjectsToClipboard(): project is required"
    );
  });

  it("does not log a guard error when copy receives a Wick.Project", () => {
    const context = createClipboardContext();
    const clipboard = new context.Wick.Clipboard();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const project = new context.Wick.Project();
    clipboard.copyObjectsToClipboard(project, []);

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("logs a guard error when paste receives a non-project object", () => {
    const context = createClipboardContext();
    const clipboard = new context.Wick.Clipboard();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = clipboard.pasteObjectsFromClipboard({});

    expect(result).toBe(false);
    expect(errorSpy).toHaveBeenCalledWith(
      "pasteObjectsFromClipboard(): project is required"
    );
  });
});
