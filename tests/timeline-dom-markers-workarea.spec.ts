import { test, expect, type Page } from "@playwright/test";

type EditorBridge = Window & {
  editor?: {
    project?: {
      activeTimeline?: {
        playheadPosition?: number;
      };
    };
  };
};

const bootEditor = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("skipWelcomeMessage", "true");
    } catch {}
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.locator("#animation-timeline-container").waitFor({
    state: "visible",
    timeout: 30000,
  });
};

const readPlayhead = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    return Number(bridge.editor?.project?.activeTimeline?.playheadPosition ?? 0);
  });
};

test.describe("Timeline DOM markers and work area", () => {
  test("marker CRUD, marker jumps, and work-area handles operate", async ({ page }) => {
    await bootEditor(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    const addMarkerButton = page.locator(".timeline-dom-marker-actions button", {
      hasText: "+ Marker",
    });
    await addMarkerButton.click();
    await expect(page.locator(".timeline-dom-marker")).toHaveCount(1);

    page.once("dialog", (dialog) => dialog.accept("Intro"));
    await page.locator(".timeline-dom-marker").first().dblclick();
    await expect(page.locator(".timeline-dom-marker").first()).toHaveAttribute("title", /Intro/);

    const numberCell12 = page.locator(".timeline-dom-numberline-cell").nth(11);
    await numberCell12.click();
    await addMarkerButton.click();
    await expect(page.locator(".timeline-dom-marker")).toHaveCount(2);

    const playheadBeforeJump = await readPlayhead(page);
    await page
      .locator(".timeline-dom-marker-actions button", { hasText: "Next Marker" })
      .click();
    const playheadAfterNextJump = await readPlayhead(page);
    expect(playheadAfterNextJump).not.toBe(playheadBeforeJump);

    await page
      .locator(".timeline-dom-marker-actions button", { hasText: "Prev Marker" })
      .click();
    const playheadAfterPrevJump = await readPlayhead(page);
    expect(playheadAfterPrevJump).not.toBe(playheadAfterNextJump);

    await page.locator("#animation-timeline-container").click();
    const playheadBeforeKeyboardJump = await readPlayhead(page);
    await page.keyboard.press("]");
    const playheadAfterKeyboardNextJump = await readPlayhead(page);
    expect(playheadAfterKeyboardNextJump).not.toBe(playheadBeforeKeyboardJump);

    await page.keyboard.press("[");
    const playheadAfterKeyboardPrevJump = await readPlayhead(page);
    expect(playheadAfterKeyboardPrevJump).not.toBe(playheadAfterKeyboardNextJump);

    await page.keyboard.down("Control");
    await page.locator(".timeline-dom-marker").first().click();
    await page.keyboard.up("Control");
    await expect(page.locator(".timeline-dom-marker")).toHaveCount(1);

    const workAreaReadout = page.locator(".timeline-flash-footer-readout");
    const readoutBefore = (await workAreaReadout.textContent())?.trim() ?? "";
    const startHandle = page.locator(".timeline-dom-work-area-handle-start");
    const handleBox = await startHandle.boundingBox();
    expect(handleBox).not.toBeNull();
    if (!handleBox) {
      throw new Error("Work area start handle bounds unavailable");
    }

    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + 80, handleBox.y + handleBox.height / 2, { steps: 8 });
    await page.mouse.up();

    const readoutAfter = (await workAreaReadout.textContent())?.trim() ?? "";
    expect(readoutAfter).not.toBe(readoutBefore);

    const loopToggle = page.locator(".timeline-dom-marker-actions .timeline-flash-footer-choice");
    await loopToggle.click();
    await expect(loopToggle).toHaveAttribute("aria-pressed", "true");
  });
});
