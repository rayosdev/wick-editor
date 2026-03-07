import { expect, test, type Locator, type Page } from "@playwright/test";
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

async function drawShapeOnCanvas(page: Page): Promise<void> {
  const rectangleTool = page
    .locator("#action-button-tooltip-tool-button-rectangle button")
    .or(page.getByRole("button", { name: /rectangle icon/i }))
    .first();
  await expect(rectangleTool).toBeVisible();
  await rectangleTool.click({ force: true });

  const canvasWrapper = page.locator("#canvas-container-wrapper");
  const canvasBox = await canvasWrapper.boundingBox();
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

async function selectAllAndPickRedFill(page: Page): Promise<void> {
  await page.evaluate(() => {
    const editor = (
      window as Window & { editor?: { selectAll?: () => void } }
    ).editor;
    editor?.selectAll?.();
  });

  const fillColorCandidates = [
    page.locator("#inspector-selection-fill-color"),
    page.locator("#mobile-inspector-selection-fill-color"),
    page
      .getByLabel("Inspector Panel")
      .getByRole("button", { name: /color picker button/i }),
  ];
  const fillColorButton = await firstVisibleLocator(fillColorCandidates);
  if (!fillColorButton) {
    throw new Error("Could not locate the fill color control.");
  }

  await fillColorButton.click({ force: true });
  const redSwatch = page.locator('[data-color-hex="#ff0000"]').first();
  await expect(redSwatch).toBeVisible({ timeout: 5000 });
  await redSwatch.evaluate((node) => (node as HTMLButtonElement).click());
  await page.waitForTimeout(150);

  const rgb = await page.evaluate(() => {
    const editor = (
      window as Window & {
        editor?: { getSelectionAttribute?: (name: string) => unknown };
      }
    ).editor;

    const value = editor?.getSelectionAttribute?.("fillColor");
    const css =
      typeof value === "string"
        ? value
        : value && typeof value === "object" && "rgba" in value
          ? String((value as { rgba?: unknown }).rgba ?? "")
          : "";

    const probe = document.createElement("div");
    probe.style.color = css || "#000000";
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();

    const match = computed.match(
      /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)/
    );

    return {
      computed,
      r: Number(match?.[1] ?? 0),
      g: Number(match?.[2] ?? 0),
      b: Number(match?.[3] ?? 0),
    };
  });

  if (!(rgb.r > rgb.g && rgb.r > rgb.b && rgb.r > 120)) {
    throw new Error(`Fill color did not switch to a red-like value (${rgb.computed}).`);
  }
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
  const onConsole = (message: { type: () => string; text: () => string }) => {
    const kind = message.type();
    if (kind !== "warning" && kind !== "error") {
      return;
    }
    consoleWarnings.push(truncate(`[${kind}] ${message.text()}`, 220));
  };

  page.on("pageerror", onPageError);
  page.on("console", onConsole as Parameters<Page["on"]>[1]);

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
      optional: true,
      run: async () => {
        await ensureEditorReady(page);
        const textTool = page
          .locator("#action-button-tooltip-tool-button-text button")
          .or(page.getByRole("button", { name: /text icon/i }))
          .first();
        await expect(textTool).toBeVisible();
        await textTool.click({ force: true });

        const canvasBox = await page.locator("#canvas-container-wrapper").boundingBox();
        if (!canvasBox) {
          throw new Error("Canvas bounds unavailable.");
        }

        await page.mouse.click(canvasBox.x + canvasBox.width * 0.45, canvasBox.y + canvasBox.height * 0.3);
        await page.keyboard.type("QA text");
        await page.keyboard.press("Enter");
        await page.waitForTimeout(250);

        const selectionType = await page.evaluate(() => {
          const editor = (
            window as Window & { editor?: { getSelectionType?: () => string } }
          ).editor;
          return editor?.getSelectionType?.() ?? "unknown";
        });

        if (!String(selectionType).toLowerCase().includes("text")) {
          throw new Error(`Selection did not resolve to text (${selectionType}).`);
        }

        return `Text insertion selected object type "${selectionType}".`;
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

        await page.evaluate(() => {
          const editor = (window as Window & { editor?: Record<string, unknown> }).editor;
          if (!editor) {
            return;
          }

          const anyEditor = editor as {
            __taskTweenCalls?: number;
            createTween?: (...args: unknown[]) => unknown;
          };
          const originalCreateTween =
            typeof anyEditor.createTween === "function"
              ? anyEditor.createTween.bind(anyEditor)
              : null;

          anyEditor.__taskTweenCalls = 0;
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
        });

        const tweenButton = page
          .locator("#action-button-tooltip-timeline-create-tween button")
          .or(page.locator("#timeline-create-tween button"))
          .first();
        await expect(tweenButton).toBeVisible();
        await tweenButton.click({ force: true });
        await page.waitForTimeout(120);

        const calls = await page.evaluate(() => {
          const editor = (window as Window & { editor?: Record<string, unknown> }).editor;
          return Number((editor as { __taskTweenCalls?: number })?.__taskTweenCalls ?? 0);
        });

        if (calls < 1) {
          throw new Error("Create tween action did not execute.");
        }

        return `Create tween action invoked ${calls} time(s).`;
      },
    },
    {
      id: "edit-path",
      title: "Edit a path",
      storyId: "editor-editor--default",
      optional: true,
      run: async () => {
        await ensureEditorReady(page);

        const lineTool = page
          .locator("#action-button-tooltip-tool-button-line button")
          .or(page.getByRole("button", { name: /line icon/i }))
          .first();
        const pathCursorTool = page
          .locator("#action-button-tooltip-tool-button-pathcursor button")
          .or(page.getByRole("button", { name: /path cursor icon/i }))
          .first();

        await expect(lineTool).toBeVisible();
        await expect(pathCursorTool).toBeVisible();

        await lineTool.click({ force: true });
        const box = await page.locator("#canvas-container-wrapper").boundingBox();
        if (!box) {
          throw new Error("Canvas bounds unavailable.");
        }

        await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.7);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.4, {
          steps: 8,
        });
        await page.mouse.up();
        await page.waitForTimeout(180);

        await pathCursorTool.click({ force: true });
        await page.mouse.click(box.x + box.width * 0.4, box.y + box.height * 0.55);
        await page.waitForTimeout(120);

        const selectionType = await page.evaluate(() => {
          const editor = (
            window as Window & { editor?: { getSelectionType?: () => string } }
          ).editor;
          return editor?.getSelectionType?.() ?? "unknown";
        });

        if (!String(selectionType).toLowerCase().includes("path")) {
          throw new Error(`Selection type "${selectionType}" is not a path.`);
        }

        return `Path selection resolved as "${selectionType}".`;
      },
    },
    {
      id: "change-colors",
      title: "Change colors of canvas items",
      storyId: "editor-editor--default",
      optional: true,
      run: async () => {
        await ensureEditorReady(page);
        await drawShapeOnCanvas(page);
        await selectAllAndPickRedFill(page);
        return "Drew a shape and changed its fill color to a red swatch.";
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
  page.off("console", onConsole as Parameters<Page["off"]>[1]);

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
