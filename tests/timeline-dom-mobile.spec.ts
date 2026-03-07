import { expect, test } from "@playwright/test";

import {
  assertNoCriticalTimelineErrors,
  assertNoTimelineFallback,
  bootTimelineEditor,
  dispatchTouchSequence,
  getTimelineCellPoint,
  longPressTimelineCell,
  prepareTimelineFixture,
  readFrameStart,
  readLayerOrder,
  readPlayhead,
  readTimelineCellMetrics,
} from "./qa/helpers/timeline.helpers";

test.describe("Timeline DOM mobile", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });

  test("single-finger frame drag mutates the frame start position", async ({ page }) => {
    await bootTimelineEditor(page);
    const fixture = await prepareTimelineFixture(page, "mobile-touch");
    if (!fixture.frameUuids.primary) {
      throw new Error("Missing mobile primary frame fixture id");
    }

    const before = await readFrameStart(page, fixture.frameUuids.primary);
    const [startPoint, endPoint] = await Promise.all([
      getTimelineCellPoint(page, { layerIndex: 0, frame: 4 }),
      getTimelineCellPoint(page, { layerIndex: 0, frame: 5 }),
    ]);

    await dispatchTouchSequence(page, [
      { type: "pointerdown", x: startPoint.x, y: startPoint.y, pointerId: 20 },
      { type: "pointermove", x: endPoint.x, y: endPoint.y, pointerId: 20, delayMs: 60 },
      { type: "pointerup", x: endPoint.x, y: endPoint.y, pointerId: 20, delayMs: 60 },
    ]);

    const after = await readFrameStart(page, fixture.frameUuids.primary);
    expect(after).toBeGreaterThan(before);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test.fixme("touch layer reorder via UI remains unreliable in mobile-chrome input synthesis", async () => {
    // This stays explicit so the limitation is visible in reports instead of being hidden
    // behind a fallback inside the same interaction test.
  });

  test("layer reorder still has a model-level smoke check while touch UI reorder is under audit", async ({
    page,
  }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "mobile-touch");

    const orderBefore = await readLayerOrder(page);
    const orderAfter = await page.evaluate(() => {
      const bridge = window as Window & {
        editor?: {
          project?: {
            activeTimeline?: {
              layers?: Array<{ uuid?: string }>;
              moveLayer?: (layer: { uuid?: string }, index: number) => void;
            };
            view?: {
              render?: () => void;
            };
            guiElement?: {
              draw?: () => void;
            };
          };
          notifyTimelineSoftRender?: () => void;
        };
      };

      const editor = bridge.editor;
      const timeline = editor?.project?.activeTimeline;
      const sourceLayer = timeline?.layers?.[0];
      if (!editor || !timeline || !sourceLayer || typeof timeline.moveLayer !== "function") {
        return null;
      }

      timeline.moveLayer(sourceLayer, 1);
      editor.project?.view?.render?.();
      editor.project?.guiElement?.draw?.();
      editor.notifyTimelineSoftRender?.();

      return (timeline.layers ?? [])
        .map((layer: { uuid?: string }) => layer.uuid)
        .filter((uuid: string | undefined): uuid is string => typeof uuid === "string");
    });

    expect(orderAfter).not.toBeNull();
    expect(orderAfter).not.toEqual(orderBefore);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("long-press on a frame opens the context menu and actions remain reachable", async ({
    page,
  }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "mobile-touch");

    await longPressTimelineCell(page, { layerIndex: 0, frame: 4, durationMs: 700 });

    const menu = page.locator(".timeline-context-menu");
    await expect(menu).toBeVisible();
    const playheadBeforeAction = await readPlayhead(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Next Frame" }).click();

    expect(await readPlayhead(page)).toBe(playheadBeforeAction + 1);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("long-press on a tween strip exposes tween-specific insertion actions", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "mobile-touch");

    await longPressTimelineCell(page, { layerIndex: 0, frame: 7, durationMs: 650 });

    const menu = page.locator(".timeline-context-menu");
    await expect(menu).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Insert Blank Keyframe" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Add Tween Keyframe" })).toBeVisible();
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("mobile timeline controls remain reachable and hit targets stay above the minimum size", async ({
    page,
  }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "mobile-touch");

    const [metrics, toggleBox, shortcutBox, footerBox, frameBox, timelineBox] = await Promise.all([
      readTimelineCellMetrics(page),
      page.locator(".timeline-renderer-toggle").boundingBox(),
      page.locator(".timeline-shortcut-toggle").first().boundingBox(),
      page.locator(".timeline-flash-footer").boundingBox(),
      page.locator(".timeline-dom-frame").first().boundingBox(),
      page.locator("#animation-timeline-container").boundingBox(),
    ]);

    expect(toggleBox).not.toBeNull();
    expect(shortcutBox).not.toBeNull();
    expect(footerBox).not.toBeNull();
    expect(frameBox).not.toBeNull();
    expect(timelineBox).not.toBeNull();

    if (!toggleBox || !shortcutBox || !footerBox || !frameBox || !timelineBox) {
      throw new Error("Missing mobile timeline bounds");
    }

    expect(toggleBox.height).toBeGreaterThanOrEqual(30);
    expect(shortcutBox.height).toBeGreaterThanOrEqual(30);
    expect(footerBox.height).toBeGreaterThanOrEqual(30);
    expect(frameBox.height).toBeGreaterThanOrEqual(30);
    expect(metrics.cellHeight).toBeGreaterThanOrEqual(30);
    expect(footerBox.y).toBeGreaterThanOrEqual(frameBox.y + frameBox.height - 6);
    expect(frameBox.y + frameBox.height).toBeLessThanOrEqual(timelineBox.y + timelineBox.height);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });
});
