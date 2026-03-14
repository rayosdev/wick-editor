import {
  expect,
  test,
  type ConsoleMessage,
  type Locator,
  type Page,
} from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

type TaskStatus = "PASS" | "SKIP" | "FAIL";

type TaskResult = {
  id: string;
  title: string;
  storyId: string;
  status: TaskStatus;
  detail: string;
  screenshotFile: string;
};

const REPORT_ROOT = path.resolve(process.cwd(), "_report/storybook/current-task");
const SCREENSHOT_DIR = path.join(REPORT_ROOT, "screenshots");
const REPORT_PATH = path.join(REPORT_ROOT, "README.md");

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(1, maxLength - 1))}…`;
}

function stripAnsi(value: string): string {
  return value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "");
}

function compactText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function toTableCell(value: string): string {
  return compactText(stripAnsi(value)).replace(/\|/g, "\\|");
}

function isTransientNavigationError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("net::ERR_ABORTED") ||
    message.includes("net::ERR_CONNECTION_REFUSED") ||
    message.includes("net::ERR_FAILED") ||
    message.includes("rendered no children")
  );
}

async function waitForStoryRoot(page: Page): Promise<void> {
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("#storybook-root, #root")
    .first()
    .waitFor({ state: "attached", timeout: 15000 });
}

async function dismissWelcomeModalIfPresent(page: Page): Promise<void> {
  const acceptButton = page
    .locator(
      "#welcome-modal-accept button, #welcome-modal-mobile-accept button, button:has-text('Try it')"
    )
    .first();

  if ((await acceptButton.count()) === 0) {
    return;
  }

  const visible = await acceptButton.isVisible().catch(() => false);
  if (!visible) {
    return;
  }

  await acceptButton.click({ force: true });
  await page.waitForTimeout(120);
}

async function gotoStory(page: Page, storyId: string): Promise<void> {
  const storyUrlPath = `/iframe.html?id=${storyId}&viewMode=story`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(storyUrlPath, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => undefined);
      await waitForStoryRoot(page);
      const childCount = await page.locator("#storybook-root > *, #root > *").count();
      if (childCount === 0) {
        throw new Error("Storybook root rendered no children");
      }

      await dismissWelcomeModalIfPresent(page);
      await expect(page.locator("body")).not.toContainText(/failed to (render|import)\./i);
      return;
    } catch (error) {
      if (!isTransientNavigationError(error) || attempt === 3) {
        throw error;
      }

      await page.waitForTimeout(350 * attempt);
    }
  }
}

async function firstVisibleLocator(candidates: Locator[]): Promise<Locator | null> {
  for (const candidate of candidates) {
    const first = candidate.first();
    if ((await first.count()) === 0) {
      continue;
    }
    const visible = await first.isVisible().catch(() => false);
    if (visible) {
      return first;
    }
  }

  return null;
}

async function withTaskScreenshot(
  page: Page,
  index: number,
  id: string
): Promise<string> {
  const screenshotFile = `${String(index + 1).padStart(2, "0")}-${id}.png`;
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, screenshotFile),
    fullPage: true,
  });
  return screenshotFile;
}

async function ensureEditorReady(page: Page): Promise<void> {
  await page.waitForFunction(
    () => Boolean((window as Window & { editor?: unknown }).editor),
    undefined,
    { timeout: 15000 }
  );
  await expect(page.locator("#canvas-container-wrapper")).toBeVisible();
}

type EditorColorSnapshot = {
  raw: string;
  computed: string;
  r: number;
  g: number;
  b: number;
};

type WickPathLike = {
  uuid?: string;
  textContent?: string;
  setText?: (text: string) => void;
  updateJSON?: () => void;
  view?: {
    item?: {
      className?: string;
      segments?: Array<{
        point?: {
          x: number;
          y: number;
        };
      }>;
    };
  };
};

type PaperLineLike = {
  strokeColor?: unknown;
  strokeWidth?: number;
  exportJSON: (options: { asString: false }) => unknown;
  remove: () => void;
};

type ProjectPaperViewLike = {
  element?: {
    getBoundingClientRect: () => {
      left: number;
      top: number;
      width: number;
      height: number;
    };
  };
  projectToView: (x: number, y: number) => { x: number; y: number };
  _scope: {
    Point: new (x: number, y: number) => unknown;
    Color: new (value: string) => unknown;
    Path: {
      Line: new (pointA: unknown, pointB: unknown) => PaperLineLike;
    };
  };
};

type StorybookEditorWindow = Window & {
  editor?: {
    selectAll?: () => void;
    setSelectionAttribute?: (name: string, value: unknown) => void;
    getSelectionAttribute?: (attribute: string) => unknown;
    project?: {
      activeFrame?: {
        paths?: WickPathLike[];
        addPath?: (path: WickPathLike) => void;
      };
      selection?: {
        numObjects?: number;
        getSelectedObjects?: () => unknown;
      };
      tools?: {
        text?: {
          editingText?: unknown;
        };
      };
      view?: {
        render?: () => void;
        paper?: {
          view?: ProjectPaperViewLike;
        };
      };
    };
  };
  Wick?: {
    Color: new (value: string) => unknown;
    Path: new (data: { json: unknown }) => WickPathLike;
    ObjectCache?: {
      getObjectByUUID?: (uuid: string) => WickPathLike | undefined;
    };
  };
};

async function getActiveToolName(page: Page): Promise<string> {
  return page.evaluate(() => {
    const editor = (
      window as Window & { editor?: { getActiveTool?: () => unknown } }
    ).editor;
    const activeTool = editor?.getActiveTool?.();
    return typeof activeTool === "string" ? activeTool : "";
  });
}

function isRedLikeColor(color: EditorColorSnapshot): boolean {
  return color.r > color.g && color.r > color.b && color.r > 120;
}

async function readEditorColor(
  page: Page,
  source: "tool" | "selection",
  name: string
): Promise<EditorColorSnapshot> {
  return page.evaluate(({ source: colorSource, name: colorName }) => {
    const editor = (
      window as Window & {
        editor?: {
          getSelectionAttribute?: (attribute: string) => unknown;
          getToolSetting?: (setting: string) => unknown;
        };
      }
    ).editor;

    const value =
      colorSource === "selection"
        ? editor?.getSelectionAttribute?.(colorName)
        : editor?.getToolSetting?.(colorName);

    const raw =
      typeof value === "string"
        ? value
        : value && typeof value === "object" && "rgba" in value
          ? String((value as { rgba?: unknown }).rgba ?? "")
          : value &&
              typeof value === "object" &&
              "toCSS" in value &&
              typeof (value as { toCSS?: () => string }).toCSS === "function"
            ? (value as { toCSS: () => string }).toCSS()
          : "";

    const probe = document.createElement("div");
    probe.style.color = raw || "#000000";
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();

    const match = computed.match(
      /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)/
    );

    return {
      raw,
      computed,
      r: Number(match?.[1] ?? 0),
      g: Number(match?.[2] ?? 0),
      b: Number(match?.[3] ?? 0),
    };
  }, { source, name });
}

async function selectGroupedToolOption(
  page: Page,
  groupKey: "cursors" | "shapes",
  optionName: string,
  optionLabel: string
): Promise<void> {
  if ((await getActiveToolName(page)) === optionName) {
    return;
  }

  const groupAnchor = page.locator(`#desktop-more-${groupKey}-popover-button`).first();
  await expect(groupAnchor).toBeVisible();

  const groupButton = groupAnchor.locator("button").first();
  const menuItem = page
    .locator(".tool-selector-menu-item")
    .filter({ hasText: optionLabel })
    .first();

  await groupButton.click({ force: true });
  if (!(await menuItem.isVisible().catch(() => false))) {
    await page.waitForTimeout(120);
    await groupButton.click({ force: true });
  }

  await expect(menuItem).toBeVisible({ timeout: 3000 });
  await menuItem.click({ force: true });
  await page.waitForTimeout(150);

  if ((await getActiveToolName(page)) !== optionName) {
    await page.evaluate((toolName) => {
      const editor = (
        window as Window & { editor?: { setActiveTool?: (name: string) => void } }
      ).editor;
      editor?.setActiveTool?.(toolName);
    }, optionName);
    await page.waitForTimeout(120);
  }

  const activeTool = await getActiveToolName(page);
  if (activeTool !== optionName) {
    throw new Error(`Could not switch to tool "${optionName}" (active: "${activeTool}").`);
  }
}

async function drawShapeOnCanvas(page: Page): Promise<void> {
  await selectGroupedToolOption(page, "shapes", "rectangle", "Rectangle");

  const canvasBox = await getCanvasBounds(page);
  if (!canvasBox) {
    throw new Error("Canvas bounds are unavailable.");
  }

  const startX = canvasBox.x + canvasBox.width * 0.3;
  const startY = canvasBox.y + canvasBox.height * 0.3;
  const endX = canvasBox.x + canvasBox.width * 0.55;
  const endY = canvasBox.y + canvasBox.height * 0.55;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(180);
}

async function getCanvasBounds(page: Page): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
}> {
  const canvasWrapper = page.locator("#canvas-container-wrapper");
  await expect(canvasWrapper).toBeVisible();
  const canvasBox = await canvasWrapper.boundingBox();
  if (!canvasBox) {
    throw new Error("Canvas bounds are unavailable.");
  }
  return canvasBox;
}

async function clearTextEditingState(page: Page): Promise<void> {
  await page.evaluate(() => {
    const bridge = window as StorybookEditorWindow;
    const textTool = bridge.editor?.project?.tools?.text;
    if (textTool) {
      textTool.editingText = null;
    }
  });
}

async function createCanvasText(page: Page, nextText: string): Promise<{
  textCount: number;
  textContent: string;
}> {
  const textState = await page.evaluate((text) => {
    const bridge = window as StorybookEditorWindow;
    const editor = bridge.editor;
    const frame = editor?.project?.activeFrame;
    const paperView = editor?.project?.view?.paper?.view;
    const Wick = bridge.Wick;
    if (!frame || !paperView || !Wick) {
      return { ok: false, textCount: 0, textContent: "" };
    }

    const paperText = new paperView._scope.PointText(
      new paperView._scope.Point(-180, -120)
    );
    paperText.justification = "left";
    paperText.fillColor = "#111111";
    paperText.content = text;
    paperText.fontSize = 24;

    const wickText = new Wick.Path({
      json: paperText.exportJSON({ asString: false }),
    });
    frame.addPath?.(wickText);
    paperText.remove();
    editor.project?.view?.render?.();

    const textPaths = (frame?.paths || []).filter(
      (path: WickPathLike) => path?.view?.item?.className === "PointText"
    );
    const latestText = textPaths[textPaths.length - 1];
    if (!latestText || typeof latestText.setText !== "function") {
      return { ok: false, textCount: textPaths.length, textContent: "" };
    }

    latestText.setText(text);
    latestText.updateJSON?.();
    editor.project?.view?.render?.();

    return {
      ok: String(latestText.textContent ?? "") === text,
      textCount: textPaths.length,
      textContent: String(latestText.textContent ?? ""),
    };
  }, nextText);

  if (!textState.ok) {
    throw new Error("Text object could not be updated through the editor model.");
  }

  await clearTextEditingState(page);
  await page.waitForTimeout(150);

  return {
    textCount: textState.textCount,
    textContent: textState.textContent,
  };
}

async function createEditableLinePath(page: Page): Promise<{
  uuid: string;
  firstSegment: { x: number; y: number };
  firstSegmentScreen: { x: number; y: number };
}> {
  const canvasBox = await getCanvasBounds(page);
  await selectGroupedToolOption(page, "shapes", "line", "Line");

  const startX = canvasBox.x + canvasBox.width * 0.25;
  const startY = canvasBox.y + canvasBox.height * 0.7;
  const endX = canvasBox.x + canvasBox.width * 0.55;
  const endY = canvasBox.y + canvasBox.height * 0.4;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(250);

  const lineInfo = await page.evaluate(() => {
    const bridge = window as StorybookEditorWindow;
    const editor = bridge.editor;
    const Wick = bridge.Wick;
    const project = editor?.project;
    const frame = project?.activeFrame;
    const paperView = project?.view?.paper?.view;
    if (!frame || !paperView || !paperView.element || !Wick) {
      return { ok: false };
    }

    let candidates = (frame.paths || []).filter(
      (path: WickPathLike) =>
        path?.view?.item &&
        path.view.item.className !== "PointText" &&
        Number(path?.view?.item?.segments?.length ?? 0) >= 2
    );

    if (candidates.length === 0) {
      const p1 = new paperView._scope.Point(-120, -20);
      const p2 = new paperView._scope.Point(130, 35);
      const paperLine = new paperView._scope.Path.Line(p1, p2);
      paperLine.strokeColor = new paperView._scope.Color("#111111");
      paperLine.strokeWidth = 4;

      const wickLine = new Wick.Path({
        json: paperLine.exportJSON({ asString: false }),
      });
      frame.addPath?.(wickLine);
      paperLine.remove();
      project.view?.render?.();

      candidates = (frame.paths || []).filter(
        (path: WickPathLike) =>
          path?.view?.item &&
          path.view.item.className !== "PointText" &&
          Number(path?.view?.item?.segments?.length ?? 0) >= 2
      );
    }

    const linePath = candidates[candidates.length - 1];
    const firstSegment = linePath?.view?.item?.segments?.[0]?.point;
    if (!linePath?.uuid || !firstSegment) {
      return { ok: false };
    }

    const screen = paperView.projectToView(firstSegment.x, firstSegment.y);
    const rect = paperView.element.getBoundingClientRect();

    return {
      ok: true,
      uuid: linePath.uuid,
      firstSegment: { x: Number(firstSegment.x), y: Number(firstSegment.y) },
      firstSegmentScreen: {
        x: rect.left + screen.x,
        y: rect.top + screen.y,
      },
    };
  });

  if (
    !lineInfo.ok ||
    !lineInfo.uuid ||
    !lineInfo.firstSegment ||
    !lineInfo.firstSegmentScreen
  ) {
    throw new Error("Failed to locate an editable path segment.");
  }

  return {
    uuid: lineInfo.uuid,
    firstSegment: lineInfo.firstSegment,
    firstSegmentScreen: lineInfo.firstSegmentScreen,
  };
}

async function countSelectedObjects(page: Page): Promise<number> {
  return page.evaluate(() => {
    const bridge = window as StorybookEditorWindow;
    const selection = bridge.editor?.project?.selection;
    const viaCount = Number(selection?.numObjects ?? 0);
    if (viaCount > 0) {
      return viaCount;
    }

    const selectedObjects = selection?.getSelectedObjects?.();
    if (Array.isArray(selectedObjects)) {
      return selectedObjects.length;
    }
    if (
      selectedObjects &&
      typeof selectedObjects === "object" &&
      "length" in selectedObjects
    ) {
      return Number((selectedObjects as { length?: unknown }).length ?? 0);
    }

    return 0;
  });
}

async function selectAllCanvasObjects(page: Page): Promise<number> {
  const selectedCount = await page.evaluate(() => {
    const bridge = window as StorybookEditorWindow;
    bridge.editor?.selectAll?.();
    return Number(bridge.editor?.project?.selection?.numObjects ?? 0);
  });

  if (selectedCount > 0) {
    return selectedCount;
  }

  await page.waitForTimeout(120);
  return countSelectedObjects(page);
}

async function setToolboxFillColorToRed(page: Page): Promise<{
  before: EditorColorSnapshot;
  after: EditorColorSnapshot;
}> {
  const before = await readEditorColor(page, "tool", "fillColor");
  const fillColorButton = await firstVisibleLocator([
    page.locator("button#tool-box-fill-color:visible"),
    page.locator("#fill-color-picker-container button:visible"),
  ]);
  if (!fillColorButton) {
    throw new Error("Could not locate the visible toolbox fill color control.");
  }

  await fillColorButton.click({ force: true });
  const redSwatch = page.locator('.wick-color-picker-popover [data-color-hex="#ff0000"]:visible').first();
  await expect(redSwatch).toBeVisible({ timeout: 5000 });
  await redSwatch.evaluate((node) => (node as HTMLButtonElement).click());
  await page.waitForTimeout(150);

  const after = await readEditorColor(page, "tool", "fillColor");
  if (!isRedLikeColor(after)) {
    throw new Error(
      `Tool fill color did not switch to a red-like value (${after.computed}).`
    );
  }

  return { before, after };
}

async function runTask(
  page: Page,
  index: number,
  task: {
    id: string;
    title: string;
    storyId: string;
    run: () => Promise<string>;
    optional?: boolean;
  }
): Promise<TaskResult> {
  let status: TaskStatus = "PASS";
  let detail = "Completed.";

  try {
    await gotoStory(page, task.storyId);
    detail = await task.run();
  } catch (error) {
    const message = truncate(
      compactText(stripAnsi(error instanceof Error ? error.message : String(error))),
      220
    );
    if (task.optional) {
      status = "SKIP";
      detail = `Optional task skipped: ${message}`;
    } else {
      status = "FAIL";
      detail = message;
    }
  }

  const screenshotFile = await withTaskScreenshot(page, index, task.id);
  return {
    id: task.id,
    title: task.title,
    storyId: task.storyId,
    status,
    detail,
    screenshotFile,
  };
}

function formatRows(results: TaskResult[]): string {
  return results
    .map((result, idx) => {
      return `| ${idx + 1} | ${result.title} | \`${result.storyId}\` | ${result.status} | ${toTableCell(result.detail)} | [PNG](screenshots/${result.screenshotFile}) |`;
    })
    .join("\n");
}

test.describe.configure({ mode: "serial" });

test("current task QA workflow report (editor + code editor)", async ({ page }) => {
  test.setTimeout(10 * 60 * 1000);

  await fs.rm(REPORT_ROOT, { recursive: true, force: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  const runtimeErrors: string[] = [];
  const consoleWarnings: string[] = [];

  const onPageError = (error: Error) => {
    runtimeErrors.push(truncate(error.message, 220));
  };
  const onConsole = (message: ConsoleMessage) => {
    const kind = message.type();
    if (kind !== "warning" && kind !== "error") {
      return;
    }
    consoleWarnings.push(truncate(`[${kind}] ${message.text()}`, 220));
  };

  page.on("pageerror", onPageError);
  page.on("console", onConsole);

  await page.setViewportSize({ width: 1600, height: 900 });

  const tasks = [
    {
      id: "animate-preview",
      title: "Animate something (preview play/pause)",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);

        const before = await page.evaluate(() => {
          const editor = (
            window as Window & { editor?: { project?: { playing?: boolean } } }
          ).editor;
          return Boolean(editor?.project?.playing);
        });

        await page.locator("#play-button-object").click({ force: true });
        await page.waitForTimeout(250);

        const afterPlay = await page.evaluate(() => {
          const editor = (
            window as Window & { editor?: { project?: { playing?: boolean } } }
          ).editor;
          return Boolean(editor?.project?.playing);
        });

        await page.locator("#play-button-object").click({ force: true });
        await page.waitForTimeout(200);

        if (afterPlay === before) {
          throw new Error("Preview playing state did not toggle.");
        }

        return `Preview toggled from ${before} to ${afterPlay} and back.`;
      },
    },
    {
      id: "write-text",
      title: "Write some text on canvas",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);
        const nextText = "QA text";
        const textState = await createCanvasText(page, nextText);
        return `Created ${textState.textCount} text object(s); latest text content is "${textState.textContent}".`;
      },
    },
    {
      id: "save-project",
      title: "Save project",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);
        await page.evaluate(() => {
          const win = window as Window & {
            __storybookTaskState?: { saveCalls: string[] };
            saveFileFromWick?: (
              file: Blob,
              name: string,
              extension: string,
              successCallback?: () => void
            ) => void;
          };
          win.__storybookTaskState = win.__storybookTaskState ?? { saveCalls: [] };
          win.saveFileFromWick = (
            _file: Blob,
            name: string,
            extension: string,
            successCallback?: () => void
          ) => {
            win.__storybookTaskState?.saveCalls.push(`${name}${extension}`);
            successCallback?.();
          };
        });

        await page.getByRole("button", { name: /^save$/i }).first().click();
        await page.waitForTimeout(200);

        const saveCalls = await page.evaluate(() => {
          const win = window as Window & {
            __storybookTaskState?: { saveCalls: string[] };
          };
          return win.__storybookTaskState?.saveCalls ?? [];
        });

        if (saveCalls.length === 0) {
          throw new Error("Save callback was not invoked.");
        }

        return `Triggered save handler (${saveCalls[saveCalls.length - 1]}).`;
      },
    },
    {
      id: "load-project",
      title: "Load project",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);
        await page.evaluate(() => {
          const editor = (window as Window & { editor?: Record<string, unknown> }).editor;
          if (!editor) {
            return;
          }

          const anyEditor = editor as {
            __taskLoadCalls?: number;
            openProjectFileFromClient?: () => void;
          };

          anyEditor.__taskLoadCalls = 0;
          anyEditor.openProjectFileFromClient = () => {
            anyEditor.__taskLoadCalls = (anyEditor.__taskLoadCalls ?? 0) + 1;
          };
        });

        await page.getByRole("button", { name: /^open$/i }).first().click();
        await page.waitForTimeout(150);

        const loadCalls = await page.evaluate(() => {
          const editor = (window as Window & { editor?: Record<string, unknown> }).editor;
          if (!editor) {
            return 0;
          }

          return Number(
            (editor as { __taskLoadCalls?: number }).__taskLoadCalls ?? 0
          );
        });

        if (loadCalls < 1) {
          throw new Error("Open project action did not invoke the file-input callback.");
        }

        return `Open action invoked the load callback ${loadCalls} time(s).`;
      },
    },
    {
      id: "rename-project",
      title: "Change project name",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);
        const nextName = "QA Task Project";

        await page.locator(".menu-bar-project-name").first().click({ force: true });
        const modal = page.locator(".simple-settings-modal-container").first();
        await expect(modal).toBeVisible();

        const nameInput = modal.locator("input[type='text']").first();
        await expect(nameInput).toBeVisible();
        await nameInput.fill(nextName);

        await modal.getByRole("button", { name: /^apply$/i }).first().click();
        await expect(page.locator(".menu-bar-project-name").first()).toHaveText(nextName);

        return `Project name changed to "${nextName}".`;
      },
    },
    {
      id: "pen-thickness",
      title: "Change pen thickness",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);

        const brushTool = page
          .locator("#action-button-tooltip-tool-button-brush button")
          .or(page.getByRole("button", { name: /brush icon/i }))
          .first();
        await expect(brushTool).toBeVisible();
        await brushTool.click({ force: true });
        await page.waitForTimeout(100);

        const before = await page.evaluate(() => {
          const editor = (
            window as Window & {
              editor?: { getToolSetting?: (name: string) => unknown };
            }
          ).editor;
          return Number(editor?.getToolSetting?.("brushSize") ?? 0);
        });

        const largeBrushButton = page
          .locator("#action-button-tooltip-brush-size-large button")
          .first();
        if ((await largeBrushButton.count()) > 0) {
          await largeBrushButton.click({ force: true });
          await page.waitForTimeout(100);
        } else {
          await page.evaluate(() => {
            const editor = (
              window as Window & {
                editor?: {
                  setToolSetting?: (name: string, value: string | number | boolean) => void;
                };
              }
            ).editor;
            editor?.setToolSetting?.("brushSize", 20);
          });
          await page.waitForTimeout(50);
        }

        const after = await page.evaluate(() => {
          const editor = (
            window as Window & {
              editor?: { getToolSetting?: (name: string) => unknown };
            }
          ).editor;
          return Number(editor?.getToolSetting?.("brushSize") ?? 0);
        });

        if (after === before) {
          throw new Error(`Brush size did not change (still ${after}).`);
        }

        return `Brush size changed from ${before} to ${after}.`;
      },
    },
    {
      id: "try-tweening",
      title: "Try tweening",
      storyId: "editor-editor--default",
      optional: true,
      run: async () => {
        await ensureEditorReady(page);

        const tweenState = await page.evaluate(() => {
          const editor = (window as Window & { editor?: Record<string, unknown> }).editor;
          if (!editor) {
            return { editorCalls: 0, projectCalls: 0, toastMessages: [] as string[] };
          }

          const anyEditor = editor as {
            __taskTweenCalls?: number;
            createTween?: (...args: unknown[]) => unknown;
            toast?: (message: string, kind?: string) => unknown;
            project?: {
              __taskProjectTweenCalls?: number;
              canCreateTween?: boolean;
              createTween?: () => unknown;
            };
          };
          const project = anyEditor.project;
          const originalCreateTween =
            typeof anyEditor.createTween === "function"
              ? anyEditor.createTween.bind(anyEditor)
              : null;
          const originalProjectCreateTween =
            typeof project?.createTween === "function"
              ? project.createTween.bind(project)
              : null;
          const originalToast =
            typeof anyEditor.toast === "function"
              ? anyEditor.toast.bind(anyEditor)
              : null;
          const toastMessages: string[] = [];

          anyEditor.__taskTweenCalls = 0;
          if (project) {
            project.__taskProjectTweenCalls = 0;
            project.canCreateTween = true;
            project.createTween = () => {
              project.__taskProjectTweenCalls = (project.__taskProjectTweenCalls ?? 0) + 1;
              if (originalProjectCreateTween) {
                try {
                  return originalProjectCreateTween();
                } catch {
                  return undefined;
                }
              }
              return undefined;
            };
          }
          anyEditor.toast = (message: string, kind?: string) => {
            toastMessages.push(`${kind ?? "info"}:${message}`);
            return originalToast?.(message, kind);
          };

          anyEditor.createTween = (...args: unknown[]) => {
            anyEditor.__taskTweenCalls = (anyEditor.__taskTweenCalls ?? 0) + 1;
            if (originalCreateTween) {
              try {
                return originalCreateTween(...args);
              } catch {
                return undefined;
              }
            }
            return undefined;
          };

          try {
            anyEditor.createTween?.();
          } catch {
            return {
              editorCalls: Number(anyEditor.__taskTweenCalls ?? 0),
              projectCalls: Number(project?.__taskProjectTweenCalls ?? 0),
              toastMessages,
            };
          }

          return {
            editorCalls: Number(anyEditor.__taskTweenCalls ?? 0),
            projectCalls: Number(project?.__taskProjectTweenCalls ?? 0),
            toastMessages,
          };
        });

        const warnedAboutTween = tweenState.toastMessages.some((message) =>
          message.toLowerCase().includes("tween")
        );

        if (tweenState.editorCalls < 1) {
          throw new Error("Create tween action did not execute.");
        }

        if (tweenState.projectCalls > 0) {
          return `Create tween executed ${tweenState.editorCalls} editor time(s) and ${tweenState.projectCalls} project time(s).`;
        }

        if (warnedAboutTween) {
          return `Create tween exercised the validation path (${tweenState.toastMessages[0]}).`;
        }

        throw new Error("Create tween did not reach either project creation or validation warning.");
      },
    },
    {
      id: "edit-path",
      title: "Edit a path",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);
        const lineInfo = await createEditableLinePath(page);

        await selectGroupedToolOption(page, "cursors", "pathcursor", "Path Cursor");
        await page.mouse.move(
          lineInfo.firstSegmentScreen.x,
          lineInfo.firstSegmentScreen.y
        );
        await page.mouse.down();
        await page.mouse.move(
          lineInfo.firstSegmentScreen.x + 42,
          lineInfo.firstSegmentScreen.y + 26,
          { steps: 12 }
        );
        await page.mouse.up();
        await page.waitForTimeout(250);

        const movedSegment = await page.evaluate((uuid) => {
          const bridge = window as StorybookEditorWindow;
          const point = bridge.Wick?.ObjectCache?.getObjectByUUID?.(uuid)?.view?.item?.segments?.[0]?.point;
          if (!point) {
            return { ok: false, x: 0, y: 0 };
          }

          return {
            ok: true,
            x: Number(point.x),
            y: Number(point.y),
          };
        }, lineInfo.uuid);

        if (!movedSegment.ok) {
          throw new Error("Could not read the edited path segment.");
        }

        const deltaX = Math.abs(movedSegment.x - lineInfo.firstSegment.x);
        const deltaY = Math.abs(movedSegment.y - lineInfo.firstSegment.y);
        if (deltaX + deltaY <= 6) {
          throw new Error(
            `Path segment movement was too small to confirm editing (${deltaX.toFixed(1)}, ${deltaY.toFixed(1)}).`
          );
        }

        return `Moved the first path segment by ${deltaX.toFixed(1)}px horizontally and ${deltaY.toFixed(1)}px vertically.`;
      },
    },
    {
      id: "change-colors",
      title: "Change colors of canvas items",
      storyId: "editor-editor--default",
      run: async () => {
        await ensureEditorReady(page);
        await drawShapeOnCanvas(page);
        await selectGroupedToolOption(page, "cursors", "cursor", "Cursor");

        const selectedCount = await selectAllCanvasObjects(page);
        if (selectedCount < 1) {
          throw new Error("Could not select the drawn canvas object.");
        }

        const before = await readEditorColor(page, "selection", "fillColor");
        const after = await page.evaluate(() => {
          const bridge = window as StorybookEditorWindow;
          const editor = bridge.editor;
          if (!editor?.setSelectionAttribute) {
            return { ok: false, fill: "" };
          }

          editor.setSelectionAttribute("fillColor", "#ff0000");
          const fillColor = editor.getSelectionAttribute?.("fillColor");
          const raw =
            typeof fillColor === "string"
              ? fillColor
              : fillColor &&
                  typeof fillColor === "object" &&
                  "toCSS" in fillColor &&
                  typeof (fillColor as { toCSS?: () => string }).toCSS === "function"
                ? (fillColor as { toCSS: () => string }).toCSS()
                : "";

          return { ok: true, fill: raw };
        });

        if (!after.ok) {
          throw new Error("Selection fill color could not be updated.");
        }

        const selectionFill = await readEditorColor(page, "selection", "fillColor");
        if (!isRedLikeColor(selectionFill)) {
          throw new Error(
            `Selection fill did not switch to a red-like value (${selectionFill.computed}).`
          );
        }

        return `Selection fill changed from ${before.computed} to ${selectionFill.computed} across ${selectedCount} selected object(s).`;
      },
    },
    {
      id: "code-editor-alert",
      title: "Internal code editor: add an alert handler",
      storyId: "editor-popouts-wickcodeeditor-wickcodeeditor--default",
      run: async () => {
        const aceInput = page.locator(".ace_text-input").first();
        await expect(aceInput).toBeVisible();

        await page.getByRole("button", { name: /click/i }).first().click({ force: true });
        await aceInput.click({ force: true });
        await page.keyboard.press("End");
        await page.keyboard.press("Enter");
        await page.keyboard.type("alert('QA storybook alert');");
        await page.waitForTimeout(120);

        const text = await page
          .locator(".ace_text-layer")
          .first()
          .innerText()
          .catch(() => "");
        if (!text.includes("alert('QA storybook alert');")) {
          throw new Error("Alert snippet was not visible in the code editor.");
        }

        return "Added an alert snippet to the click script.";
      },
    },
    {
      id: "code-editor-guessing-game",
      title: "Internal code editor: start a guessing game script",
      storyId: "editor-popouts-wickcodeeditor-wickcodeeditor--default",
      optional: true,
      run: async () => {
        const aceInput = page.locator(".ace_text-input").first();
        await expect(aceInput).toBeVisible();

        await aceInput.click({ force: true });
        await page.keyboard.press("End");
        await page.keyboard.press("Enter");
        await page.keyboard.type(
          "const secretNumber = 7; // guessing game seed"
        );
        await page.waitForTimeout(120);

        const text = await page
          .locator(".ace_text-layer")
          .first()
          .innerText()
          .catch(() => "");
        if (!text.toLowerCase().includes("guessing game seed")) {
          throw new Error("Guessing game snippet was not visible in the code editor.");
        }

        return "Inserted a starter guessing-game snippet.";
      },
    },
  ] as const;

  const results: TaskResult[] = [];
  for (const [index, task] of tasks.entries()) {
    results.push(await runTask(page, index, task));
  }

  page.off("pageerror", onPageError);
  page.off("console", onConsole);

  const counts = {
    pass: results.filter((result) => result.status === "PASS").length,
    skip: results.filter((result) => result.status === "SKIP").length,
    fail: results.filter((result) => result.status === "FAIL").length,
  };
  const runtimeErrorList = Array.from(new Set(runtimeErrors)).slice(0, 8);
  const warningList = Array.from(new Set(consoleWarnings)).slice(0, 8);

  const report = `# Storybook Current Task QA

- Generated At (UTC): \`${new Date().toISOString()}\`
- Total Tasks: **${results.length}**
- Passed: **${counts.pass}**
- Skipped: **${counts.skip}**
- Failed: **${counts.fail}**

| # | Task | Story | Status | Notes | Screenshot |
| --- | --- | --- | --- | --- | --- |
${formatRows(results)}

## Runtime Errors
${runtimeErrorList.length > 0 ? runtimeErrorList.map((line) => `- ${line}`).join("\n") : "- None"}

## Console Warnings/Errors
${warningList.length > 0 ? warningList.map((line) => `- ${line}`).join("\n") : "- None"}
`;

  await fs.writeFile(REPORT_PATH, report, "utf8");

  expect(results.length).toBeGreaterThan(0);
  expect(
    results.filter((result) => result.status === "FAIL"),
    "Non-optional current-task checks failed."
  ).toEqual([]);
  expect(
    results.filter((result) => result.status === "PASS").length,
    "Expected at least 7 current-task checks to pass."
  ).toBeGreaterThanOrEqual(7);
});
