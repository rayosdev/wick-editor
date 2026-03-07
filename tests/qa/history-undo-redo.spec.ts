import { expect, test, type Page } from "@playwright/test";
import {
  attachCriticalErrorCollector,
  bootEditor,
  drawRectangleOnCanvas,
  readEditorState,
} from "./helpers/editor-regression.helpers";

type HistoryEntryDebug = {
  isArray: boolean;
  isUndefined: boolean;
  hasState: boolean;
  stateIsArray: boolean;
  hasObjectsSet: boolean;
  actionName: string | null;
};

type HistoryDebugSnapshot = {
  undoLen: number;
  redoLen: number;
  undoEntries: HistoryEntryDebug[];
  redoEntries: HistoryEntryDebug[];
  historyObjectUUIDs: string[];
  missingHistoryObjects: string[];
  activeTool: string | null;
  lastUsedTool: string | null;
  showClipBorders: boolean;
  onionSkinEnabled: boolean;
};

type RuntimePathSnapshot = {
  pathUUIDs: string[];
};

type EditorAction =
  | "toggleClipBorders"
  | "toggleOnionSkin"
  | "undoAction"
  | "redoAction"
  | "resetCache";

type RuntimeWindow = Window & {
  Wick?: {
    ObjectCache?: {
      _objects?: Record<string, unknown>;
    };
  };
  editor?: {
    lastUsedTool?: string;
    getActiveTool?: () => string;
    setActiveTool?: (toolName: string) => void;
    toggleClipBorders?: () => void;
    toggleOnionSkin?: () => void;
    undoAction?: () => void;
    redoAction?: () => void;
    project?: {
      showClipBorders?: boolean;
      onionSkinEnabled?: boolean;
      resetCache?: () => void;
      history?: {
        _undoStack?: unknown[];
        _redoStack?: unknown[];
        getObjectUUIDs?: () => Set<string>;
      };
      activeFrame?: {
        children?: Array<{ uuid?: string; classname?: string }>;
        paths?: Array<{ uuid?: string; classname?: string }>;
      };
    };
  };
};

test.describe.configure({ mode: "serial", timeout: 90000 });
test.skip(
  ({ browserName, isMobile }) => browserName !== "chromium" || isMobile,
  "Undo/redo regression suite currently targets desktop Chromium only.",
);

const runEditorAction = async (page: Page, action: EditorAction): Promise<void> => {
  await page.evaluate((actionName: EditorAction) => {
    const bridge = window as RuntimeWindow;
    const editor = bridge.editor;

    switch (actionName) {
      case "toggleClipBorders":
        editor?.toggleClipBorders?.();
        break;
      case "toggleOnionSkin":
        editor?.toggleOnionSkin?.();
        break;
      case "undoAction":
        editor?.undoAction?.();
        break;
      case "redoAction":
        editor?.redoAction?.();
        break;
      case "resetCache":
        editor?.project?.resetCache?.();
        break;
      default:
        break;
    }
  }, action);
};

const setActiveTool = async (page: Page, toolName: string): Promise<void> => {
  await page.evaluate((nextToolName: string) => {
    const bridge = window as RuntimeWindow;
    bridge.editor?.setActiveTool?.(nextToolName);
  }, toolName);
};

const readHistoryDebug = async (page: Page): Promise<HistoryDebugSnapshot> => {
  return page.evaluate(() => {
    const bridge = window as RuntimeWindow;
    const editor = bridge.editor;
    const history = editor?.project?.history;
    const objectCache = bridge.Wick?.ObjectCache?._objects ?? {};
    const historyObjectUUIDs = Array.from(history?.getObjectUUIDs?.() ?? []).filter(
      (uuid): uuid is string => typeof uuid === "string",
    );
    const summarizeEntry = (entry: unknown): HistoryEntryDebug => ({
      isArray: Array.isArray(entry),
      isUndefined: typeof entry === "undefined",
      hasState:
        Boolean(entry) && !Array.isArray(entry) && Array.isArray((entry as { state?: unknown }).state),
      stateIsArray: Array.isArray((entry as { state?: unknown }).state),
      hasObjectsSet:
        Boolean(entry) &&
        !Array.isArray(entry) &&
        (entry as { objects?: unknown }).objects instanceof Set,
      actionName:
        Boolean(entry) && !Array.isArray(entry) && typeof (entry as { actionName?: unknown }).actionName === "string"
          ? ((entry as { actionName: string }).actionName)
          : null,
    });

    return {
      undoLen: history?._undoStack?.length ?? 0,
      redoLen: history?._redoStack?.length ?? 0,
      undoEntries: (history?._undoStack ?? []).map(summarizeEntry),
      redoEntries: (history?._redoStack ?? []).map(summarizeEntry),
      historyObjectUUIDs,
      missingHistoryObjects: historyObjectUUIDs.filter((uuid) => !objectCache[uuid]),
      activeTool: editor?.getActiveTool?.() ?? null,
      lastUsedTool: typeof editor?.lastUsedTool === "string" ? editor.lastUsedTool : null,
      showClipBorders: Boolean(editor?.project?.showClipBorders),
      onionSkinEnabled: Boolean(editor?.project?.onionSkinEnabled),
    };
  });
};

const readPathSnapshot = async (page: Page): Promise<RuntimePathSnapshot> => {
  return page.evaluate(() => {
    const bridge = window as RuntimeWindow;
    const activeFrame = bridge.editor?.project?.activeFrame;
    const childPaths = Array.isArray(activeFrame?.children)
      ? activeFrame.children.filter((child) => child?.classname === "Path")
      : [];
    const legacyPaths = Array.isArray(activeFrame?.paths) ? activeFrame.paths : [];
    const pathUUIDs = new Set<string>();

    childPaths.forEach((path) => {
      if (typeof path?.uuid === "string") {
        pathUUIDs.add(path.uuid);
      }
    });
    legacyPaths.forEach((path) => {
      if (typeof path?.uuid === "string") {
        pathUUIDs.add(path.uuid);
      }
    });

    return {
      pathUUIDs: Array.from(pathUUIDs),
    };
  });
};

const expectNormalizedHistoryEntries = (entries: HistoryEntryDebug[]): void => {
  expect(entries.length, "History should contain at least one entry").toBeGreaterThan(0);

  entries.forEach((entry) => {
    expect(entry.isUndefined, "History entry should not be undefined").toBe(false);
    expect(entry.isArray, "History entry should never be a raw array").toBe(false);
    expect(entry.hasState, "History entry should expose a state array").toBe(true);
    expect(entry.stateIsArray, "History entry state should be an array").toBe(true);
    expect(entry.hasObjectsSet, "History entry should expose a UUID set").toBe(true);
  });
};

test("clip border undo/redo roundtrip stays structurally valid", async ({ page }) => {
  const criticalErrors = attachCriticalErrorCollector(page);
  await bootEditor(page);

  const initial = await readHistoryDebug(page);

  await runEditorAction(page, "toggleClipBorders");
  await expect
    .poll(async () => (await readHistoryDebug(page)).showClipBorders)
    .toBe(!initial.showClipBorders);

  await runEditorAction(page, "undoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).showClipBorders)
    .toBe(initial.showClipBorders);

  await runEditorAction(page, "redoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).showClipBorders)
    .toBe(!initial.showClipBorders);

  await runEditorAction(page, "undoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).showClipBorders)
    .toBe(initial.showClipBorders);

  await runEditorAction(page, "redoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).showClipBorders)
    .toBe(!initial.showClipBorders);

  const finalDebug = await readHistoryDebug(page);
  expectNormalizedHistoryEntries(finalDebug.undoEntries);
  expectNormalizedHistoryEntries(finalDebug.redoEntries.length > 0 ? finalDebug.redoEntries : finalDebug.undoEntries);
  expect(finalDebug.redoLen, "Alternating undo/redo should end with an empty redo stack").toBe(0);
  criticalErrors.expectNoCriticalErrors();
});

test("onion skin undo/redo roundtrip restores editor view state", async ({ page }) => {
  const criticalErrors = attachCriticalErrorCollector(page);
  await bootEditor(page);

  const initial = await readHistoryDebug(page);

  await runEditorAction(page, "toggleOnionSkin");
  await expect
    .poll(async () => (await readHistoryDebug(page)).onionSkinEnabled)
    .toBe(!initial.onionSkinEnabled);

  await runEditorAction(page, "undoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).onionSkinEnabled)
    .toBe(initial.onionSkinEnabled);

  await runEditorAction(page, "redoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).onionSkinEnabled)
    .toBe(!initial.onionSkinEnabled);

  criticalErrors.expectNoCriticalErrors();
});

test("tool switch undo/redo restores active tool and last-used tool", async ({ page }) => {
  const criticalErrors = attachCriticalErrorCollector(page);
  await bootEditor(page);

  await expect
    .poll(async () => (await readHistoryDebug(page)).activeTool)
    .toBe("cursor");

  await setActiveTool(page, "brush");
  await expect
    .poll(async () => (await readHistoryDebug(page)).activeTool)
    .toBe("brush");

  await runEditorAction(page, "undoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).activeTool)
    .toBe("cursor");

  const afterUndo = await readHistoryDebug(page);
  expect(afterUndo.lastUsedTool).toBe("brush");

  await runEditorAction(page, "redoAction");
  await expect
    .poll(async () => (await readHistoryDebug(page)).activeTool)
    .toBe("brush");

  const afterRedo = await readHistoryDebug(page);
  expect(afterRedo.lastUsedTool).toBe("cursor");
  criticalErrors.expectNoCriticalErrors();
});

test("content history survives redo and resetCache without losing redo objects", async ({ page }) => {
  const criticalErrors = attachCriticalErrorCollector(page);
  await bootEditor(page);

  const beforeDraw = await readEditorState(page);
  await setActiveTool(page, "rectangle");
  await drawRectangleOnCanvas(page);

  await expect
    .poll(async () => (await readEditorState(page)).pathCount, {
      timeout: 10000,
      message: "Drawing a rectangle should add a path to the active frame",
    })
    .toBeGreaterThan(beforeDraw.pathCount);

  const afterDraw = await readEditorState(page);
  const afterDrawPaths = await readPathSnapshot(page);
  expect(afterDrawPaths.pathUUIDs.length).toBeGreaterThan(0);

  await runEditorAction(page, "undoAction");
  await expect
    .poll(async () => (await readEditorState(page)).pathCount, {
      timeout: 10000,
      message: "Undo should remove the drawn rectangle from the active frame",
    })
    .toBe(beforeDraw.pathCount);

  const afterUndoDebug = await readHistoryDebug(page);
  expect(afterUndoDebug.redoLen, "Undo should populate the redo stack").toBeGreaterThan(0);
  expect(
    afterDrawPaths.pathUUIDs.some((uuid) => afterUndoDebug.historyObjectUUIDs.includes(uuid)),
    "History UUIDs should retain objects referenced by redo entries",
  ).toBe(true);

  await runEditorAction(page, "redoAction");
  await expect
    .poll(async () => (await readEditorState(page)).pathCount, {
      timeout: 10000,
      message: "Redo should restore the drawn rectangle",
    })
    .toBe(afterDraw.pathCount);

  await runEditorAction(page, "resetCache");
  const afterResetDebug = await readHistoryDebug(page);
  expect(afterResetDebug.missingHistoryObjects).toEqual([]);

  await runEditorAction(page, "undoAction");
  await expect
    .poll(async () => (await readEditorState(page)).pathCount, {
      timeout: 10000,
      message: "Undo should still work after resetCache",
    })
    .toBe(beforeDraw.pathCount);

  await runEditorAction(page, "redoAction");
  await expect
    .poll(async () => (await readEditorState(page)).pathCount, {
      timeout: 10000,
      message: "Redo should still work after resetCache",
    })
    .toBe(afterDraw.pathCount);

  const finalDebug = await readHistoryDebug(page);
  expectNormalizedHistoryEntries(finalDebug.undoEntries);
  criticalErrors.expectNoCriticalErrors();
});
