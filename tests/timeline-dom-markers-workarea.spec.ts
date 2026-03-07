import { expect, test } from "@playwright/test";

import {
  assertNoCriticalTimelineErrors,
  assertNoTimelineFallback,
  bootTimelineEditor,
  ensureFooterControlVisible,
  getTimelineCellPoint,
  prepareTimelineFixture,
  readMarkerTitles,
  readPlayhead,
  readWorkAreaReadout,
} from "./qa/helpers/timeline.helpers";

test.describe("Timeline DOM markers and work area", () => {
  test("marker CRUD and jump controls stay reachable in the footer", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "markers-workarea");

    const markerActions = page.getByTestId("timeline-marker-actions");
    const addMarkerButton = markerActions.getByRole("button", { name: "Add marker at playhead" });
    await ensureFooterControlVisible(addMarkerButton);
    await addMarkerButton.click();
    await expect(page.locator(".timeline-dom-marker")).toHaveCount(1);

    page.once("dialog", (dialog) => dialog.accept("Intro"));
    await page.locator(".timeline-dom-marker").first().dblclick();
    await expect(page.locator(".timeline-dom-marker").first()).toHaveAttribute("title", /Intro/);

    const targetPoint = await getTimelineCellPoint(page, { layerIndex: 0, frame: 12 });
    await page.mouse.click(targetPoint.x, targetPoint.y);
    await addMarkerButton.click();
    await expect(page.locator(".timeline-dom-marker")).toHaveCount(2);

    const playheadBeforeNext = await readPlayhead(page);
    const nextMarkerButton = markerActions.getByRole("button", { name: "Jump to next marker" });
    await ensureFooterControlVisible(nextMarkerButton);
    await nextMarkerButton.click();
    const playheadAfterNext = await readPlayhead(page);
    expect(playheadAfterNext).not.toBe(playheadBeforeNext);

    const prevMarkerButton = markerActions.getByRole("button", { name: "Jump to previous marker" });
    await ensureFooterControlVisible(prevMarkerButton);
    await prevMarkerButton.click();
    const playheadAfterPrev = await readPlayhead(page);
    expect(playheadAfterPrev).not.toBe(playheadAfterNext);

    await page.locator("#animation-timeline-container").click();
    const playheadBeforeKeyboardJump = await readPlayhead(page);
    await page.keyboard.press("]");
    const playheadAfterKeyboardNext = await readPlayhead(page);
    expect(playheadAfterKeyboardNext).not.toBe(playheadBeforeKeyboardJump);

    await page.keyboard.press("[");
    const playheadAfterKeyboardPrev = await readPlayhead(page);
    expect(playheadAfterKeyboardPrev).not.toBe(playheadAfterKeyboardNext);

    await page.keyboard.down("Control");
    await page.locator(".timeline-dom-marker").first().click();
    await page.keyboard.up("Control");

    await expect(page.locator(".timeline-dom-marker")).toHaveCount(1);
    const markerTitles = await readMarkerTitles(page);
    expect(markerTitles.some((title) => title.includes("Intro"))).toBe(false);
    expect(markerTitles.some((title) => title.includes("M2"))).toBe(true);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("work-area handles and loop toggle update the footer state", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "markers-workarea");

    const readoutBefore = await readWorkAreaReadout(page);
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

    const readoutAfter = await readWorkAreaReadout(page);
    expect(readoutAfter).not.toBe(readoutBefore);

    const loopToggle = page.getByTestId("timeline-marker-actions").getByRole("button", { name: "Loop" });
    await ensureFooterControlVisible(loopToggle);
    await loopToggle.click();
    await expect(loopToggle).toHaveAttribute("aria-pressed", "true");
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });
});
