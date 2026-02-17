import { test, expect, type Page } from "@playwright/test";

type EditorBridge = Window & {
  editor?: {
    project?: {
      activeTimeline?: {
        playheadPosition?: number;
      };
    };
    state?: {
      previewPlaying?: boolean;
    };
    togglePreviewPlaying?: () => void;
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
    const bridge = window as unknown as EditorBridge;
    return Number(bridge.editor?.project?.activeTimeline?.playheadPosition ?? 0);
  });
};

test.describe("Timeline DOM playback sync", () => {
  test("playback updates playhead, first scrub does not fallback, and follow toggle works", async ({
    page,
  }) => {
    await bootEditor(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    const playheadBefore = await readPlayhead(page);
    const playheadLeftBefore = await page
      .locator(".timeline-dom-playhead")
      .evaluate((node) => Number.parseFloat(getComputedStyle(node).left || "0"));

    await page.evaluate(() => {
      const bridge = window as unknown as EditorBridge;
      if (!bridge.editor?.togglePreviewPlaying) {
        return;
      }
      if (!bridge.editor.state?.previewPlaying) {
        bridge.editor.togglePreviewPlaying();
      }
    });

    await page.waitForFunction(
      (initialPlayhead) => {
        const bridge = window as unknown as EditorBridge;
        const current = Number(bridge.editor?.project?.activeTimeline?.playheadPosition ?? 0);
        return current !== Number(initialPlayhead);
      },
      playheadBefore,
      { timeout: 10000 },
    );

    const playheadAfterTick = await readPlayhead(page);
    const playheadLeftAfter = await page
      .locator(".timeline-dom-playhead")
      .evaluate((node) => Number.parseFloat(getComputedStyle(node).left || "0"));

    expect(playheadAfterTick).not.toBe(playheadBefore);
    expect(playheadLeftAfter).not.toBe(playheadLeftBefore);

    await page.evaluate(() => {
      const bridge = window as unknown as EditorBridge;
      if (!bridge.editor?.togglePreviewPlaying) {
        return;
      }
      if (bridge.editor.state?.previewPlaying) {
        bridge.editor.togglePreviewPlaying();
      }
    });

    await page.waitForFunction(() => {
      const bridge = window as unknown as EditorBridge;
      return !bridge.editor?.state?.previewPlaying;
    });

    const numberLine = page.locator(".timeline-dom-numberline");
    const numberLineBox = await numberLine.boundingBox();
    expect(numberLineBox).not.toBeNull();
    if (!numberLineBox) {
      throw new Error("Numberline bounds unavailable");
    }

    await page.mouse.move(numberLineBox.x + 40, numberLineBox.y + numberLineBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(numberLineBox.x + 260, numberLineBox.y + numberLineBox.height / 2, {
      steps: 10,
    });
    await page.mouse.up();

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(
      page.locator("text=DOM timeline had an error and was switched to Classic."),
    ).toHaveCount(0);

    const followOn = page.locator(".timeline-shortcut-toggle-button", { hasText: "Follow" }).first();
    const followOff = page.locator(".timeline-shortcut-toggle-button", { hasText: "Free" }).first();

    await followOff.click();
    await expect(followOff).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#animation-timeline-container")).toHaveAttribute(
      "data-timeline-follow-mode",
      "off",
    );

    await followOn.click();
    await expect(followOn).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#animation-timeline-container")).toHaveAttribute(
      "data-timeline-follow-mode",
      "follow-playhead",
    );
  });
});
