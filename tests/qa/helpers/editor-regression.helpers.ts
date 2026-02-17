import { expect, type Page } from "@playwright/test";

type RuntimeObject = {
  uuid?: string;
  classname?: string;
};

type RuntimeFrame = {
  children?: RuntimeObject[];
  paths?: RuntimeObject[];
};

type RuntimeLayer = {
  frames?: RuntimeFrame[];
};

type RuntimeTimeline = {
  playheadPosition?: number;
  layers?: RuntimeLayer[];
  activeLayerIndex?: number;
};

type RuntimeProject = {
  activeFrame?: RuntimeFrame;
  activeTimeline?: RuntimeTimeline;
  selection?: {
    numObjects?: number;
  };
  name?: string;
  framerate?: number;
};

type RuntimeEditor = {
  project?: RuntimeProject;
  getActiveTool?: () => string;
  getToolSetting?: (setting: string) => string | number | boolean;
  state?: {
    previewPlaying?: boolean;
  };
};

type RuntimeWindow = Window & {
  Wick?: {
    Project?: unknown;
  };
  editor?: RuntimeEditor;
};

export type EditorStateSnapshot = {
  pathCount: number;
  frameObjectCount: number;
  selectionCount: number;
  playheadPosition: number;
  layerCount: number;
  activeLayerFrameCount: number;
  projectName: string;
  framerate: number;
  previewPlaying: boolean;
};

const IGNORED_ERROR_PATTERNS = [
  "DevTools",
  "Ignoring Event",
  "favicon.ico",
  "Failed to load resource",
  "A preload for",
  "was preloaded using link preload but not used",
];

const shouldIgnoreError = (message: string): boolean => {
  return IGNORED_ERROR_PATTERNS.some((pattern) => message.includes(pattern));
};

export const attachCriticalErrorCollector = (page: Page) => {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() !== "error") {
      return;
    }

    const text = message.text();
    if (!shouldIgnoreError(text)) {
      errors.push(`[console] ${text}`);
    }
  });

  page.on("pageerror", (error) => {
    const message = error.message;
    if (!shouldIgnoreError(message)) {
      errors.push(`[pageerror] ${message}`);
    }
  });

  return {
    snapshot: (): string[] => [...errors],
    expectNoCriticalErrors: (): void => {
      expect(errors, "No critical console/page errors should occur").toEqual([]);
    },
  };
};

export const bootEditor = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("skipWelcomeMessage", "true");
    } catch {}
  });

  await page.goto("/", { waitUntil: "load" });

  await page.locator("#canvas-container-wrapper").waitFor({
    state: "visible",
    timeout: 30000,
  });
  await page.locator("#animation-timeline-container").waitFor({
    state: "visible",
    timeout: 30000,
  });

  await page.waitForFunction(() => {
    const bridge = window as RuntimeWindow;
    return Boolean(bridge.Wick?.Project && bridge.editor?.project);
  });

  await page.waitForFunction(() => {
    const preloader = document.getElementById("preloader");
    if (!preloader) {
      return true;
    }

    const style = window.getComputedStyle(preloader);
    return style.display === "none" || style.visibility === "hidden" || style.opacity === "0";
  });
};

export const getActiveTool = async (page: Page): Promise<string | null> => {
  return page.evaluate(() => {
    const bridge = window as RuntimeWindow;
    return bridge.editor?.getActiveTool?.() ?? null;
  });
};

export const readBrushSize = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const bridge = window as RuntimeWindow;
    return Number(bridge.editor?.getToolSetting?.("brushSize") ?? 0);
  });
};

export const readEditorState = async (page: Page): Promise<EditorStateSnapshot> => {
  return page.evaluate(() => {
    const bridge = window as RuntimeWindow;
    const editor = bridge.editor;
    const project = editor?.project;
    const timeline = project?.activeTimeline;
    const activeFrame = project?.activeFrame;

    const childObjects = Array.isArray(activeFrame?.children) ? activeFrame.children : [];
    const legacyPaths = Array.isArray(activeFrame?.paths) ? activeFrame.paths : [];

    const pathIds = new Set<string>();
    const ingestPath = (entry: RuntimeObject | undefined, fallbackKey: string): void => {
      if (!entry) {
        return;
      }

      if (entry.classname === "Path") {
        pathIds.add(entry.uuid ?? fallbackKey);
      }
    };

    childObjects.forEach((entry, index) => ingestPath(entry, `child-${index}`));
    legacyPaths.forEach((entry, index) => ingestPath(entry, `legacy-${index}`));

    const layers = Array.isArray(timeline?.layers) ? timeline.layers : [];
    const activeLayerIndex = Math.max(0, Number(timeline?.activeLayerIndex ?? 0));
    const activeLayer = layers[activeLayerIndex];
    const activeLayerFrameCount = Array.isArray(activeLayer?.frames)
      ? activeLayer.frames.length
      : 0;

    return {
      pathCount: pathIds.size,
      frameObjectCount: childObjects.length,
      selectionCount: Number(project?.selection?.numObjects ?? 0),
      playheadPosition: Number(timeline?.playheadPosition ?? 1),
      layerCount: layers.length,
      activeLayerFrameCount,
      projectName: String(project?.name ?? ""),
      framerate: Number(project?.framerate ?? 0),
      previewPlaying: Boolean(editor?.state?.previewPlaying),
    };
  });
};

export const clickToolButton = async (
  page: Page,
  toolName:
    | "cursor"
    | "brush"
    | "pencil"
    | "eraser"
    | "rectangle"
    | "ellipse"
    | "line"
    | "pathcursor"
    | "text"
    | "fillbucket"
    | "eyedropper",
): Promise<void> => {
  const button = page.locator(`#action-button-tooltip-tool-button-${toolName} button`);
  await expect(button, `Expected ${toolName} tool button to be visible`).toBeVisible();
  await button.click();
};

export const setBrushSizeFromUi = async (
  page: Page,
  brushSize: number,
): Promise<void> => {
  const sizeInput = page
    .locator("#settings-panel-container input.settings-numeric-input")
    .first();
  await expect(sizeInput).toBeVisible();
  await sizeInput.click();
  await sizeInput.fill(String(brushSize));
  await page.keyboard.press("Enter");

  await expect.poll(() => readBrushSize(page)).toBe(brushSize);
};

export const drawStrokeOnCanvas = async (
  page: Page,
): Promise<{ startX: number; startY: number; endX: number; endY: number }> => {
  const canvas = page.locator("#canvas-container-wrapper canvas").first();
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas bounding box was not available");
  }

  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.45;
  const endX = box.x + box.width * 0.68;
  const endY = box.y + box.height * 0.55;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  for (let step = 1; step <= 16; step += 1) {
    const progress = step / 16;
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress + Math.sin(progress * Math.PI * 4) * 15;
    await page.mouse.move(x, y);
  }
  await page.mouse.up();
  await page.waitForTimeout(500);

  return { startX, startY, endX, endY };
};

export const drawRectangleOnCanvas = async (
  page: Page,
): Promise<{ centerX: number; centerY: number }> => {
  const canvas = page.locator("#canvas-container-wrapper canvas").first();
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error("Canvas bounding box was not available");
  }

  const startX = box.x + box.width * 0.34;
  const startY = box.y + box.height * 0.34;
  const endX = box.x + box.width * 0.56;
  const endY = box.y + box.height * 0.56;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(400);

  return {
    centerX: (startX + endX) / 2,
    centerY: (startY + endY) / 2,
  };
};
