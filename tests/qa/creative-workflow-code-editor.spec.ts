import { expect, type Page, test } from "@playwright/test";

async function setAceScript(page: Page, source: string): Promise<void> {
  const updated = await page.evaluate((code) => {
    const aceGlobal = (window as any).ace;
    const root = document.querySelector("#wick-code-editor-resizeable .ace_editor");
    if (!aceGlobal || !root) {
      return false;
    }

    const editor = aceGlobal.edit(root);
    editor.setValue(code, -1);
    editor.clearSelection();
    return editor.getValue() === code;
  }, source);

  expect(updated).toBe(true);
}

async function drawBaseShape(page: Page): Promise<void> {
  const rectangleTool = page.locator(
    "#action-button-tooltip-tool-button-rectangle button"
  );
  await expect(rectangleTool).toBeVisible();
  await rectangleTool.click();

  const canvasWrapper = page.locator("#canvas-container-wrapper");
  await expect(canvasWrapper).toBeVisible();
  const canvasBox = await canvasWrapper.boundingBox();
  expect(canvasBox).not.toBeNull();

  if (!canvasBox) {
    return;
  }

  const startX = canvasBox.x + canvasBox.width * 0.4;
  const startY = canvasBox.y + canvasBox.height * 0.4;
  const endX = canvasBox.x + canvasBox.width * 0.56;
  const endY = canvasBox.y + canvasBox.height * 0.56;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();
  await page.waitForTimeout(500);
}

async function isPreviewPlaying(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const editor = (window as any).editor;
    const project = editor?.project || (window as any).project;
    return Boolean(editor?.state?.previewPlaying || project?.playing || project?.isPlaying);
  });
}

async function ensurePlaying(page: Page): Promise<void> {
  const playing = await isPreviewPlaying(page);
  if (playing) return;

  const playButton = page.locator('input[type="image"][id="play-button-object"]');
  await expect(playButton).toBeVisible();
  await playButton.click();
  await page.waitForTimeout(600);
}

async function ensureStopped(page: Page): Promise<void> {
  const playing = await isPreviewPlaying(page);
  if (!playing) return;

  const playButton = page.locator('input[type="image"][id="play-button-object"]');
  await expect(playButton).toBeVisible();
  await playButton.click();
  await page.waitForTimeout(600);
}

async function readMouseclickSource(
  page: Page,
  buttonUuid: string
): Promise<string | null> {
  return page.evaluate((uuid) => {
    const Wick = (window as any).Wick;
    const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
    return button?.getScript?.("mouseclick")?.src ?? null;
  }, buttonUuid);
}

async function selectButtonInEditor(page: Page, buttonUuid: string): Promise<void> {
  const selected = await page.evaluate((uuid) => {
    const editor = (window as any).editor;
    const Wick = (window as any).Wick;
    if (!editor || !Wick) {
      return false;
    }

    const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
    if (!button) {
      return false;
    }

    if (editor?.setFocusObject) {
      editor.setFocusObject(editor.project.root);
    }
    if (editor?.clearSelection) {
      editor.clearSelection();
    }
    if (editor?.selectObject) {
      editor.selectObject(button);
    }

    const selectedUuid = editor.project?.selection?.getSelectedObject?.()?.uuid ?? null;
    return selectedUuid === uuid;
  }, buttonUuid);

  expect(selected).toBe(true);
}

async function runMouseclickScript(
  page: Page,
  buttonUuid: string
): Promise<void> {
  const runResult = await page.evaluate((uuid) => {
    const Wick = (window as any).Wick;
    const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
    if (!button) {
      return { ok: false, reason: "button-not-found" };
    }
    const scriptSource = button.getScript?.("mouseclick")?.src ?? "";
    if (!scriptSource) {
      return { ok: false, reason: "mouseclick-script-empty" };
    }

    try {
      const fn = new Function([], scriptSource);
      fn.bind(button)();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        reason:
          error instanceof Error
            ? error.message
            : String(error ?? "unknown-script-error"),
      };
    }
  }, buttonUuid);

  expect(runResult.ok).toBe(true);
}

test.describe("Creative workflow: code editor scripting", () => {
  test("button alert and guessing game script run from internal editor", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {
        // Ignore localStorage access issues.
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    await drawBaseShape(page);

    // Convert drawn object into button.
    const convertState = await page.evaluate(() => {
      const editor = (window as any).editor;
      const Wick = (window as any).Wick;
      if (!editor) return { ok: false };

      editor.selectAll();
      editor.createButtonFromSelection("guess_button");
      editor.selectAll();

      const selectedObject = editor.project?.selection?.getSelectedObject?.();
      if (selectedObject && editor?.setFocusObject) {
        editor.setFocusObject(editor.project.root);
        editor.clearSelection();
        const sameButton = Wick?.ObjectCache?.getObjectByUUID?.(selectedObject.uuid);
        if (sameButton && editor?.selectObject) {
          editor.selectObject(sameButton);
        }
      }

      const types = editor.project?.selection?.types ?? [];
      return {
        ok: true,
        types,
        buttonUuid: selectedObject?.uuid ?? null,
        focusIsRoot: editor.project?.focus?.isRoot ?? false,
      };
    });

    expect(convertState.ok).toBe(true);
    expect(Array.isArray(convertState.types)).toBe(true);
    expect(convertState.types.join(",").toLowerCase()).toContain("button");
    expect(convertState.buttonUuid).toBeTruthy();
    expect(convertState.focusIsRoot).toBe(true);
    const buttonUuid = convertState.buttonUuid as string;
    await selectButtonInEditor(page, buttonUuid);

    // Open internal code editor directly on mouseclick script.
    await page.evaluate(() => {
      const editor = (window as any).editor;
      editor.editScript("mouseclick");
    });

    await expect(page.locator("#wick-code-editor-resizeable")).toBeVisible();
    await expect(
      page.locator("#wick-code-editor-resizeable .ace_editor")
    ).toBeVisible();

    // Script 1: alert-equivalent probe via button instance state.
    const alertScript = `this.__qaProbe = "Button clicked";`;
    await setAceScript(page, alertScript);
    await expect
      .poll(async () => readMouseclickSource(page, buttonUuid), {
        timeout: 5000,
      })
      .toContain("Button clicked");

    await page
      .locator("#wick-code-editor-resizeable .wick-code-editor-drag-handle button")
      .click();

    await ensurePlaying(page);
    await runMouseclickScript(page, buttonUuid);
    await expect
      .poll(
        async () =>
          page.evaluate((uuid) => {
            const Wick = (window as any).Wick;
            const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
            return button?.__qaProbe ?? null;
          }, buttonUuid),
        { timeout: 5000 }
      )
      .toBe("Button clicked");

    await ensureStopped(page);
    await selectButtonInEditor(page, buttonUuid);

    // Script 2: guessing game branch logic.
    await page.evaluate(() => {
      const editor = (window as any).editor;
      editor.editScript("mouseclick");
    });

    await expect(page.locator("#wick-code-editor-resizeable")).toBeVisible();
    await expect(
      page.locator("#wick-code-editor-resizeable .ace_editor")
    ).toBeVisible();

    const guessingScript = `const target = 3;
const guess = Number(this.__guessInput || 0);
if (guess === target) {
  this.__guessResult = "Correct guess";
} else {
  this.__guessResult = "Try again";
}`;
    await setAceScript(page, guessingScript);
    await expect
      .poll(async () => readMouseclickSource(page, buttonUuid), {
        timeout: 5000,
      })
      .toContain("this.__guessInput");

    await page
      .locator("#wick-code-editor-resizeable .wick-code-editor-drag-handle button")
      .click();

    await ensurePlaying(page);

    // Correct path
    await page.evaluate((uuid) => {
      const Wick = (window as any).Wick;
      const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
      if (button) {
        button.__guessInput = 3;
        button.__guessResult = null;
      }
    }, buttonUuid);
    await runMouseclickScript(page, buttonUuid);
    await expect
      .poll(
        async () =>
          page.evaluate((uuid) => {
            const Wick = (window as any).Wick;
            const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
            return button?.__guessResult ?? null;
          }, buttonUuid),
        { timeout: 5000 }
      )
      .toBe("Correct guess");

    // Incorrect path
    await page.evaluate((uuid) => {
      const Wick = (window as any).Wick;
      const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
      if (button) {
        button.__guessInput = 1;
        button.__guessResult = null;
      }
    }, buttonUuid);
    await runMouseclickScript(page, buttonUuid);
    await expect
      .poll(
        async () =>
          page.evaluate((uuid) => {
            const Wick = (window as any).Wick;
            const button = Wick?.ObjectCache?.getObjectByUUID?.(uuid);
            return button?.__guessResult ?? null;
          }, buttonUuid),
        { timeout: 5000 }
      )
      .toBe("Try again");
  });
});
