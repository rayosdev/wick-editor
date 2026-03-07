import { mkdir } from "node:fs/promises";
import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  assertNoCriticalTimelineErrors,
  assertNoTimelineFallback,
  bootTimelineEditor,
  doubleClickTweenStrip,
  ensureFooterControlVisible,
  ensureTimelineOptionsOpen,
  longPressTimelineCell,
  prepareTimelineFixture,
} from "./helpers/timeline.helpers";

const AUDIT_DIR = path.join(process.cwd(), "output/playwright/timeline-qa");

const ensureAuditDir = async (): Promise<void> => {
  await mkdir(AUDIT_DIR, { recursive: true });
};

test.describe.configure({ mode: "serial", timeout: 120000 });

test.describe("Timeline interaction audit", () => {
  test("desktop audit captures options discoverability, tween menu, and marker footer states", async ({
    page,
    isMobile,
    browserName,
  }) => {
    test.skip(browserName !== "chromium" || isMobile, "Desktop audit targets Chromium desktop only.");

    await ensureAuditDir();
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    await ensureTimelineOptionsOpen(page);
    await page.locator("#animation-timeline-container").screenshot({
      path: path.join(AUDIT_DIR, "desktop-options-panel.png"),
    });

    await doubleClickTweenStrip(page, { layerIndex: 0, frame: 8 });
    await expect(page.locator(".timeline-context-menu")).toBeVisible();
    await page.locator("#animation-timeline-container").screenshot({
      path: path.join(AUDIT_DIR, "desktop-tween-strip-menu.png"),
    });

    await page.keyboard.press("Escape");
    const markerActions = page.getByTestId("timeline-marker-actions");
    await ensureFooterControlVisible(markerActions.getByRole("button", { name: "Add marker at playhead" }));
    await page.locator("#animation-timeline-container").screenshot({
      path: path.join(AUDIT_DIR, "desktop-marker-footer-actions.png"),
    });

    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("mobile audit captures layout compression and long-press menu states", async ({
    page,
    isMobile,
    browserName,
  }) => {
    test.skip(browserName !== "chromium" || !isMobile, "Mobile audit targets mobile-chrome only.");

    await ensureAuditDir();
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "mobile-touch");

    await page.locator("#animation-timeline-container").screenshot({
      path: path.join(AUDIT_DIR, "mobile-timeline-layout.png"),
    });

    await longPressTimelineCell(page, { layerIndex: 0, frame: 4, durationMs: 700 });
    await expect(page.locator(".timeline-context-menu")).toBeVisible();
    await page.locator("#animation-timeline-container").screenshot({
      path: path.join(AUDIT_DIR, "mobile-frame-long-press-menu.png"),
    });

    await page.keyboard.press("Escape");
    await longPressTimelineCell(page, { layerIndex: 0, frame: 7, durationMs: 650 });
    await expect(page.locator(".timeline-context-menu")).toBeVisible();
    await page.locator("#animation-timeline-container").screenshot({
      path: path.join(AUDIT_DIR, "mobile-tween-strip-menu.png"),
    });

    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });
});
