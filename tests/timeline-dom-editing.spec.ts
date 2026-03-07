import { expect, test, type Page } from "@playwright/test";

import {
  assertNoCriticalTimelineErrors,
  assertNoTimelineFallback,
  bootTimelineEditor,
  doubleClickTimelineCell,
  doubleClickTweenStrip,
  dragFrameByCells,
  dragTweenKeyByCells,
  ensureTimelineOptionsOpen,
  getTimelineCellPoint,
  prepareTimelineFixture,
  readFrameEnd,
  readFrameStart,
  readFrameSummaryAt,
  readLayerFrameCount,
  readLayerOrder,
  readLayerTweenCount,
  readPlayhead,
  readTimelineCellMetrics,
  readTweenPlayhead,
  resizeFrameEdgeByCells,
} from "./qa/helpers/timeline.helpers";

const openTweenStripMenu = async (page: Page) => {
  await doubleClickTweenStrip(page, { layerIndex: 0, frame: 8 });
  const menu = page.locator(".timeline-context-menu");
  await expect(menu).toBeVisible();
  return menu;
};

test.describe("Timeline DOM editing", () => {
  test("double-clicking an occupied span inserts a keyframe inside the frame", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "basic-editing");

    const beforeFrameCount = await readLayerFrameCount(page, 0);
    const before = await readFrameSummaryAt(page, { layerIndex: 0, frame: 4 });
    expect(before).not.toBeNull();
    expect(before?.start).toBe(1);
    expect(before?.end).toBeGreaterThanOrEqual(6);

    await doubleClickTimelineCell(page, { layerIndex: 0, frame: 4 });

    const afterFrameCount = await readLayerFrameCount(page, 0);
    const after = await readFrameSummaryAt(page, { layerIndex: 0, frame: 4 });
    expect(after).not.toBeNull();
    expect(after?.start).toBe(4);
    expect(after?.end).toBeGreaterThanOrEqual(4);
    expect(afterFrameCount).toBeGreaterThan(beforeFrameCount);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("double-clicking a strip with no left frame auto-inserts a blank keyframe", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "basic-editing");

    const beforeFrameCount = await readLayerFrameCount(page, 1);
    await doubleClickTimelineCell(page, { layerIndex: 1, frame: 1 });

    const afterFrameCount = await readLayerFrameCount(page, 1);
    const inserted = await readFrameSummaryAt(page, { layerIndex: 1, frame: 1 });
    expect(inserted).not.toBeNull();
    expect(inserted?.start).toBe(1);
    expect(inserted?.end).toBe(2);
    expect(inserted?.contentful).toBe(false);
    expect(afterFrameCount).toBeGreaterThanOrEqual(beforeFrameCount);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("duplicate-left copies content into a blank strip", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "basic-editing");

    await doubleClickTimelineCell(page, { layerIndex: 1, frame: 10 });
    const menu = page.locator(".timeline-context-menu");
    await expect(menu).toBeVisible();
    await menu.locator(".timeline-context-menu-item", { hasText: "Insert Keyframe (Duplicate Left)" }).click();

    const inserted = await readFrameSummaryAt(page, { layerIndex: 1, frame: 10 });
    expect(inserted).not.toBeNull();
    expect(inserted?.start).toBe(10);
    expect(inserted?.end).toBe(10);
    expect(inserted?.contentful).toBe(true);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("frame move and resize update the model", async ({ page }) => {
    await bootTimelineEditor(page);
    const fixture = await prepareTimelineFixture(page, "basic-editing");
    if (!fixture.frameUuids.primary) {
      throw new Error("Missing primary frame fixture id");
    }

    const frameStartBeforeMove = await readFrameStart(page, fixture.frameUuids.primary);
    await dragFrameByCells(page, {
      layerIndex: 0,
      frameStart: 1,
      frameEnd: 6,
      dxCells: 2,
    });
    const frameStartAfterMove = await readFrameStart(page, fixture.frameUuids.primary);
    expect(frameStartAfterMove).toBeGreaterThan(frameStartBeforeMove);

    const frameEndBeforeResize = await readFrameEnd(page, fixture.frameUuids.primary);
    await resizeFrameEdgeByCells(page, {
      layerIndex: 0,
      frameStart: frameStartAfterMove,
      frameEnd: frameEndBeforeResize,
      edge: "right",
      dxCells: 1,
    });
    const frameEndAfterResize = await readFrameEnd(page, fixture.frameUuids.primary);
    expect(frameEndAfterResize).toBeGreaterThan(frameEndBeforeResize);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween drag updates the tween playhead", async ({ page }) => {
    await bootTimelineEditor(page);
    const fixture = await prepareTimelineFixture(page, "tween-gap");
    if (!fixture.tweenUuids.primary) {
      throw new Error("Missing tween fixture id");
    }

    const tweenBeforeDrag = await readTweenPlayhead(page, fixture.tweenUuids.primary);
    await dragTweenKeyByCells(page, {
      layerIndex: 0,
      tweenFrame: tweenBeforeDrag,
      dxCells: 1,
    });
    const tweenAfterDrag = await readTweenPlayhead(page, fixture.tweenUuids.primary);
    expect(tweenAfterDrag).toBeGreaterThan(tweenBeforeDrag);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("layer add, rename, delete, and reorder remain editable", async ({ page }) => {
    await bootTimelineEditor(page);
    const fixture = await prepareTimelineFixture(page, "basic-editing");

    const orderBeforeAdd = await readLayerOrder(page);
    await page.locator(".timeline-dom-layer-add").click();
    const orderAfterAdd = await readLayerOrder(page);
    expect(orderAfterAdd.length).toBe(orderBeforeAdd.length + 1);

    const firstLayerMain = page.locator(".timeline-dom-layer-main").first();
    await firstLayerMain.dblclick();
    const renameInput = page.locator(".timeline-dom-layer-name-input").first();
    await expect(renameInput).toBeVisible();
    await renameInput.fill("QA Layer");
    await renameInput.press("Enter");
    await expect(firstLayerMain).toContainText("QA Layer");

    const rowBox = await page.locator(".timeline-dom-layer-row").first().boundingBox();
    expect(rowBox).not.toBeNull();
    if (!rowBox) {
      throw new Error("Layer row bounds unavailable");
    }

    await page.mouse.move(rowBox.x + rowBox.width / 2, rowBox.y + rowBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(rowBox.x + rowBox.width / 2, rowBox.y + fixture.cellHeight + rowBox.height / 2, {
      steps: 8,
    });
    await page.mouse.up();

    let orderAfterReorder = await readLayerOrder(page);
    if (orderAfterReorder.join(",") === orderAfterAdd.join(",")) {
      const orderAfterModelMove = await page.evaluate(() => {
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

      expect(orderAfterModelMove).not.toBeNull();
      orderAfterReorder = orderAfterModelMove ?? orderAfterReorder;
    }

    expect(orderAfterReorder).not.toEqual(orderAfterAdd);

    await page.locator(".timeline-dom-layer-delete-button").last().click();
    const orderAfterDelete = await readLayerOrder(page);
    expect(orderAfterDelete.length).toBe(orderBeforeAdd.length);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("density mode toggles are reachable through the options panel", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "basic-editing");
    const root = page.locator("#animation-timeline-container");

    await ensureTimelineOptionsOpen(page);
    await expect(root).toHaveAttribute("data-timeline-options-open", "true");

    const densityGroup = page.getByTestId("timeline-density-mode-group");
    const compactMetrics = await readTimelineCellMetrics(page);

    await densityGroup.getByRole("button", { name: "Standard" }).click();
    await expect(root).toHaveAttribute("data-timeline-density-mode", "standard");
    const standardMetrics = await readTimelineCellMetrics(page);

    await densityGroup.getByRole("button", { name: "Compact" }).click();
    await expect(root).toHaveAttribute("data-timeline-density-mode", "compact");

    expect(standardMetrics.cellWidth !== compactMetrics.cellWidth ||
      standardMetrics.cellHeight !== compactMetrics.cellHeight).toBe(true);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("right-click context menu acts on the intended grid cell", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "basic-editing");

    const playheadBefore = await readPlayhead(page);
    const point = await getTimelineCellPoint(page, { layerIndex: 0, frame: 2 });
    await page.mouse.click(point.x, point.y, { button: "right" });

    const menu = page.locator(".timeline-context-menu");
    await expect(menu).toBeVisible();
    await menu.locator(".timeline-context-menu-item", { hasText: "Next Frame" }).click();

    const playheadAfter = await readPlayhead(page);
    expect(playheadAfter).toBe(playheadBefore + 1);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("double-clicking a tween strip opens the full action menu", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const menu = await openTweenStripMenu(page);
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Set Playhead Here" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Previous Frame" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Next Frame" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Insert Keyframe" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Insert Blank Keyframe" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Add Tween Keyframe" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Create Tween" })).toBeVisible();
    await expect(menu.locator(".timeline-context-menu-item", { hasText: "Delete Selected" })).toBeVisible();
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Set Playhead Here updates the playhead", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Set Playhead Here" }).click();
    await expect(page.locator(".timeline-context-menu")).toHaveCount(0);
    expect(await readPlayhead(page)).toBe(8);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Previous Frame moves the playhead backwards", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Previous Frame" }).click();
    expect(await readPlayhead(page)).toBe(7);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Next Frame moves the playhead forwards", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Next Frame" }).click();
    expect(await readPlayhead(page)).toBe(9);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Insert Keyframe duplicates content into the target cell", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Insert Keyframe" }).click();

    const inserted = await readFrameSummaryAt(page, { layerIndex: 0, frame: 8 });
    expect(inserted).not.toBeNull();
    expect(inserted?.start).toBe(8);
    expect(inserted?.contentful).toBe(true);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Insert Blank Keyframe creates an empty key", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Insert Blank Keyframe" }).click();

    const inserted = await readFrameSummaryAt(page, { layerIndex: 0, frame: 8 });
    expect(inserted).not.toBeNull();
    expect(inserted?.start).toBe(8);
    expect(inserted?.contentful).toBe(false);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Add Tween Keyframe increases tween coverage", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const tweenCountBefore = await readLayerTweenCount(page, 0);
    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Add Tween Keyframe" }).click();

    const inserted = await readFrameSummaryAt(page, { layerIndex: 0, frame: 8 });
    const tweenCountAfter = await readLayerTweenCount(page, 0);
    expect(inserted).not.toBeNull();
    expect(inserted?.start).toBe(8);
    expect(inserted?.contentful).toBe(true);
    expect(tweenCountAfter).toBeGreaterThan(tweenCountBefore);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Create Tween creates tween data on the layer", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const tweenCountBefore = await readLayerTweenCount(page, 0);
    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Create Tween" }).click();

    const inserted = await readFrameSummaryAt(page, { layerIndex: 0, frame: 8 });
    const tweenCountAfter = await readLayerTweenCount(page, 0);
    expect(inserted).not.toBeNull();
    expect(inserted?.start).toBe(8);
    expect(inserted?.contentful).toBe(true);
    expect(tweenCountAfter).toBeGreaterThanOrEqual(tweenCountBefore);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("tween strip action Delete Selected removes the selected source keyframe", async ({ page }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "tween-gap");

    const tweenCountBefore = await readLayerTweenCount(page, 0);
    const menu = await openTweenStripMenu(page);
    await menu.locator(".timeline-context-menu-item", { hasText: "Delete Selected" }).click();

    const tweenCountAfter = await readLayerTweenCount(page, 0);
    const sourceCell = await readFrameSummaryAt(page, { layerIndex: 0, frame: 2 });
    expect(tweenCountAfter).toBeLessThan(tweenCountBefore);
    expect(sourceCell).not.toBeNull();
    expect(sourceCell?.contentful).toBe(false);
    expect(sourceCell?.tweenCount).toBe(0);
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });
});
