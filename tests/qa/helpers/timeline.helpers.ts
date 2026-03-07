import { expect, type Locator, type Page } from "@playwright/test";

import {
  attachCriticalErrorCollector,
  bootEditor as bootBaseEditor,
} from "./editor-regression.helpers";

type TimelineTweenModel = {
  uuid?: string;
  playheadPosition?: number;
};

type TimelineFrameModel = {
  uuid?: string;
  start?: number;
  end?: number;
  identifier?: string;
  contentful?: boolean;
  tweens: TimelineTweenModel[];
  remove?: () => void;
  addTween?: (tween: TimelineTweenModel) => void;
  addClip?: (clip: unknown) => void;
};

type TimelineLayerModel = {
  uuid?: string;
  name?: string;
  hidden?: boolean;
  locked?: boolean;
  frames: TimelineFrameModel[];
  addFrame?: (frame: TimelineFrameModel) => void;
};

type TimelineModel = {
  layers: TimelineLayerModel[];
  activeLayerIndex: number;
  playheadPosition: number;
  addLayer?: (layer: TimelineLayerModel) => void;
  moveLayer?: (layer: TimelineLayerModel, index: number) => void;
  deferFrameGapResolve?: () => void;
};

type ProjectModel = {
  activeTimeline: TimelineModel;
  activeFrame?: {
    clips?: unknown[];
  };
  selection: {
    clear: () => void;
    select?: (value: unknown) => void;
    getSelectedObjects?: (type?: string) => unknown[];
    numObjects?: number;
  };
  view: {
    render: () => void;
  };
  guiElement: {
    draw: () => void;
  };
};

type RuntimeEditor = {
  project?: ProjectModel;
  notifyTimelineSoftRender?: () => void;
  state?: {
    previewPlaying?: boolean;
  };
  togglePreviewPlaying?: () => void;
};

type EditorBridge = Window & {
  editor?: RuntimeEditor;
  Wick?: {
    Layer: new (args?: { name?: string }) => TimelineLayerModel;
    Frame: new (args?: { start?: number; end?: number; identifier?: string }) => TimelineFrameModel;
    Tween: new (args?: { playheadPosition?: number }) => TimelineTweenModel;
    Clip: new (args?: Record<string, unknown>) => unknown;
    GUIElement?: {
      GRID_DEFAULT_CELL_WIDTH?: number;
      GRID_DEFAULT_CELL_HEIGHT?: number;
    };
  };
};

type CriticalCollector = ReturnType<typeof attachCriticalErrorCollector>;

export type TimelineFixtureVariant =
  | "basic-editing"
  | "tween-gap"
  | "markers-workarea"
  | "playback-follow"
  | "mobile-touch";

export type TimelineFixture = {
  variant: TimelineFixtureVariant;
  cellWidth: number;
  cellHeight: number;
  layerUuids: {
    primary: string;
    secondary?: string;
  };
  frameUuids: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    layerB?: string;
  };
  tweenUuids: {
    primary?: string;
  };
};

export type TimelineCellTarget = {
  layerIndex: number;
  frame: number;
};

export type DragFrameByCellsOptions = {
  layerIndex: number;
  frameStart: number;
  dxCells: number;
  frameEnd?: number;
};

export type ResizeFrameEdgeByCellsOptions = {
  layerIndex: number;
  frameStart: number;
  dxCells: number;
  frameEnd?: number;
  edge: "left" | "right";
};

export type DragTweenKeyByCellsOptions = {
  layerIndex: number;
  tweenFrame: number;
  dxCells: number;
};

export type TouchSequenceStep = {
  type: "pointerdown" | "pointermove" | "pointerup";
  x: number;
  y: number;
  pointerId?: number;
  delayMs?: number;
};

type TimelineCellMetrics = {
  cellWidth: number;
  cellHeight: number;
};

const criticalCollectors = new WeakMap<Page, CriticalCollector>();

const getCriticalCollector = (page: Page): CriticalCollector => {
  let collector = criticalCollectors.get(page);
  if (!collector) {
    collector = attachCriticalErrorCollector(page);
    criticalCollectors.set(page, collector);
  }
  return collector;
};

const ensureTimelineRoot = (page: Page): Locator =>
  page.locator("#animation-timeline-container");

export const bootTimelineEditor = async (
  page: Page,
  options?: { viewport?: { width: number; height: number } },
): Promise<void> => {
  getCriticalCollector(page);
  if (options?.viewport) {
    await page.setViewportSize(options.viewport);
  }
  await bootBaseEditor(page);
  await expect(ensureTimelineRoot(page)).toHaveAttribute("data-timeline-renderer-mode", "dom");
};

export const prepareTimelineFixture = async (
  page: Page,
  variant: TimelineFixtureVariant,
): Promise<TimelineFixture> => {
  const fixture = await page.evaluate((inputVariant: TimelineFixtureVariant) => {
    const bridge = window as EditorBridge;
    const editor = bridge.editor;
    const project = editor?.project;
    const Wick = bridge.Wick;

    if (!editor || !project || !Wick) {
      return null;
    }

    const timeline = project.activeTimeline;
    while (timeline.layers.length < 2) {
      timeline.addLayer?.(new Wick.Layer());
    }

    const layerA = timeline.layers[0];
    const layerB = timeline.layers[1];
    if (!layerA || !layerB) {
      return null;
    }

    const buildFixtureResult = (
      frameUuids: TimelineFixture["frameUuids"],
      tweenUuids: TimelineFixture["tweenUuids"],
    ): TimelineFixture | null => {
      if (!layerA.uuid) {
        return null;
      }

      return {
        variant: inputVariant,
        cellWidth: Number(Wick.GUIElement?.GRID_DEFAULT_CELL_WIDTH ?? 38),
        cellHeight: Number(Wick.GUIElement?.GRID_DEFAULT_CELL_HEIGHT ?? 42),
        layerUuids: {
          primary: layerA.uuid,
          secondary: layerB.uuid,
        },
        frameUuids,
        tweenUuids,
      };
    };

    layerA.frames.slice().forEach((frame: TimelineFrameModel) => frame.remove?.());
    layerB.frames.slice().forEach((frame: TimelineFrameModel) => frame.remove?.());

    if (inputVariant === "basic-editing") {
      const frameA = new Wick.Frame({ start: 1, end: 6, identifier: "A" });
      const frameA2 = new Wick.Frame({ start: 9, end: 10, identifier: "A2" });
      const frameKey = new Wick.Frame({ start: 12, end: 12, identifier: "K" });
      const frameB = new Wick.Frame({ start: 3, end: 8, identifier: "B" });
      const tween = new Wick.Tween({ playheadPosition: 2 });

      frameA.addClip?.(new Wick.Clip());
      frameA.addTween?.(tween);
      frameB.addClip?.(new Wick.Clip());

      layerA.addFrame?.(frameA);
      layerA.addFrame?.(frameA2);
      layerA.addFrame?.(frameKey);
      layerB.addFrame?.(frameB);

      timeline.activeLayerIndex = 0;
      timeline.playheadPosition = 1;
      project.selection.clear();
      project.view.render();
      project.guiElement.draw();
      editor.notifyTimelineSoftRender?.();

      if (!frameA.uuid || !frameA2.uuid || !frameKey.uuid || !frameB.uuid || !tween.uuid) {
        return null;
      }

      return buildFixtureResult(
        {
          primary: frameA.uuid,
          secondary: frameA2.uuid,
          tertiary: frameKey.uuid,
          layerB: frameB.uuid,
        },
        { primary: tween.uuid },
      );
    }

    if (inputVariant === "tween-gap") {
      timeline.deferFrameGapResolve?.();

      const frameA = new Wick.Frame({ start: 1, end: 6, identifier: "Tween Source" });
      const frameKey = new Wick.Frame({ start: 12, end: 12, identifier: "Target Key" });
      const tween = new Wick.Tween({ playheadPosition: 2 });

      frameA.addClip?.(new Wick.Clip());
      frameA.addTween?.(tween);

      layerA.addFrame?.(frameA);
      layerA.addFrame?.(frameKey);

      timeline.activeLayerIndex = 0;
      timeline.playheadPosition = 1;
      project.selection.clear();
      project.view.render();
      project.guiElement.draw();
      editor.notifyTimelineSoftRender?.();

      if (!frameA.uuid || !frameKey.uuid || !tween.uuid) {
        return null;
      }

      return buildFixtureResult(
        {
          primary: frameA.uuid,
          tertiary: frameKey.uuid,
        },
        { primary: tween.uuid },
      );
    }

    if (inputVariant === "markers-workarea") {
      const frameA = new Wick.Frame({ start: 1, end: 24, identifier: "Markers Span" });
      const frameB = new Wick.Frame({ start: 4, end: 12, identifier: "Markers B" });

      frameA.addClip?.(new Wick.Clip());
      layerA.addFrame?.(frameA);
      layerB.addFrame?.(frameB);

      timeline.activeLayerIndex = 0;
      timeline.playheadPosition = 1;
      project.selection.clear();
      project.view.render();
      project.guiElement.draw();
      editor.notifyTimelineSoftRender?.();

      if (!frameA.uuid || !frameB.uuid) {
        return null;
      }

      return buildFixtureResult(
        {
          primary: frameA.uuid,
          layerB: frameB.uuid,
        },
        {},
      );
    }

    if (inputVariant === "playback-follow") {
      const frameA = new Wick.Frame({ start: 1, end: 32, identifier: "Preview Span" });
      layerA.addFrame?.(frameA);

      timeline.activeLayerIndex = 0;
      timeline.playheadPosition = 1;
      project.selection.clear();
      project.view.render();
      project.guiElement.draw();
      editor.notifyTimelineSoftRender?.();

      if (!frameA.uuid) {
        return null;
      }

      return buildFixtureResult(
        {
          primary: frameA.uuid,
        },
        {},
      );
    }

    if (inputVariant === "mobile-touch") {
      const frameA = new Wick.Frame({ start: 1, end: 5, identifier: "Mobile A" });
      const frameB = new Wick.Frame({ start: 2, end: 6, identifier: "Mobile B" });
      const tween = new Wick.Tween({ playheadPosition: 2 });

      frameA.addClip?.(new Wick.Clip());
      frameA.addTween?.(tween);

      layerA.addFrame?.(frameA);
      layerB.addFrame?.(frameB);

      timeline.activeLayerIndex = 0;
      timeline.playheadPosition = 1;
      project.selection.clear();
      project.view.render();
      project.guiElement.draw();
      editor.notifyTimelineSoftRender?.();

      if (!frameA.uuid || !frameB.uuid || !tween.uuid) {
        return null;
      }

      return buildFixtureResult(
        {
          primary: frameA.uuid,
          layerB: frameB.uuid,
        },
        { primary: tween.uuid },
      );
    }

    return null;
  }, variant);

  if (!fixture) {
    throw new Error(`Could not prepare timeline fixture for variant "${variant}"`);
  }

  return fixture;
};

export const openTimelineOptions = async (page: Page): Promise<void> => {
  const root = ensureTimelineRoot(page);
  const toggle = page.getByTestId("timeline-options-toggle");
  await toggle.scrollIntoViewIfNeeded();

  if ((await root.getAttribute("data-timeline-options-open")) !== "true") {
    await toggle.click();
  }

  await expect(root).toHaveAttribute("data-timeline-options-open", "true");
};

export const closeTimelineOptions = async (page: Page): Promise<void> => {
  const root = ensureTimelineRoot(page);
  const toggle = page.getByTestId("timeline-options-toggle");
  await toggle.scrollIntoViewIfNeeded();

  if ((await root.getAttribute("data-timeline-options-open")) === "true") {
    await toggle.click();
  }

  await expect(root).toHaveAttribute("data-timeline-options-open", "false");
};

export const ensureTimelineOptionsOpen = async (page: Page): Promise<void> => {
  await openTimelineOptions(page);
};

export const readTimelineCellMetrics = async (page: Page): Promise<TimelineCellMetrics> => {
  return page.evaluate(() => {
    const shell = document.querySelector(".timeline-dom-shell") as HTMLElement | null;
    const computed = shell ? window.getComputedStyle(shell) : null;
    return {
      cellWidth: Number.parseFloat(computed?.getPropertyValue("--timeline-cell-width") || "38"),
      cellHeight: Number.parseFloat(computed?.getPropertyValue("--timeline-cell-height") || "42"),
    };
  });
};

export const getTimelineRowBox = async (
  page: Page,
  layerIndex: number,
): Promise<NonNullable<Awaited<ReturnType<Locator["boundingBox"]>>>> => {
  const row = page.locator(".timeline-unified-track").nth(layerIndex);
  const box = await row.boundingBox();
  expect(box, `Timeline row ${layerIndex} should have a bounding box`).not.toBeNull();
  if (!box) {
    throw new Error(`Timeline row ${layerIndex} bounds unavailable`);
  }
  return box;
};

const scrollTimelineViewportToCell = async (
  page: Page,
  target: TimelineCellTarget,
): Promise<TimelineCellMetrics> => {
  const metrics = await readTimelineCellMetrics(page);
  await page.getByTestId("timeline-grid-workspace").evaluate(
    (
      element,
      input: {
        cellWidth: number;
        cellHeight: number;
        frame: number;
        layerIndex: number;
      },
    ) => {
      const workspace = element as HTMLElement;
      const targetLeft = Math.max(0, (input.frame - 1) * input.cellWidth - workspace.clientWidth / 2);
      const targetTop = Math.max(0, input.layerIndex * input.cellHeight - workspace.clientHeight / 2);
      workspace.scrollTo({
        left: targetLeft,
        top: targetTop,
        behavior: "instant" as ScrollBehavior,
      });
    },
    {
      cellWidth: metrics.cellWidth,
      cellHeight: metrics.cellHeight,
      frame: target.frame,
      layerIndex: target.layerIndex,
    },
  );
  return metrics;
};

export const getTimelineCellPoint = async (
  page: Page,
  target: TimelineCellTarget,
): Promise<{ x: number; y: number }> => {
  const metrics = await scrollTimelineViewportToCell(page, target);
  const rowBox = await getTimelineRowBox(page, target.layerIndex);

  return {
    x: rowBox.x + (target.frame - 1) * metrics.cellWidth + metrics.cellWidth / 2,
    y: rowBox.y + metrics.cellHeight / 2,
  };
};

export const doubleClickTimelineCell = async (
  page: Page,
  target: TimelineCellTarget,
): Promise<void> => {
  const point = await getTimelineCellPoint(page, target);
  await page.mouse.dblclick(point.x, point.y);
};

export const doubleClickTweenStrip = async (
  page: Page,
  target: TimelineCellTarget,
): Promise<void> => {
  await doubleClickTimelineCell(page, target);
};

export const dragFrameByCells = async (
  page: Page,
  options: DragFrameByCellsOptions,
): Promise<void> => {
  const frameEnd = options.frameEnd ?? options.frameStart;
  const midpointFrame = options.frameStart + (frameEnd - options.frameStart) / 2;
  const startPoint = await getTimelineCellPoint(page, {
    layerIndex: options.layerIndex,
    frame: Math.round(midpointFrame),
  });
  const metrics = await readTimelineCellMetrics(page);

  await page.mouse.move(startPoint.x, startPoint.y);
  await page.mouse.down();
  await page.mouse.move(startPoint.x + options.dxCells * metrics.cellWidth, startPoint.y, {
    steps: Math.max(4, Math.abs(options.dxCells) * 4),
  });
  await page.mouse.up();
};

export const resizeFrameEdgeByCells = async (
  page: Page,
  options: ResizeFrameEdgeByCellsOptions,
): Promise<void> => {
  const targetFrame = options.edge === "left" ? options.frameStart : (options.frameEnd ?? options.frameStart);
  const metrics = await scrollTimelineViewportToCell(page, {
    layerIndex: options.layerIndex,
    frame: targetFrame,
  });
  const rowBox = await getTimelineRowBox(page, options.layerIndex);
  const frameEnd = options.frameEnd ?? options.frameStart;
  const boundaryFrame = options.edge === "left" ? options.frameStart : frameEnd;
  const boundaryLeft = rowBox.x + (boundaryFrame - 1) * metrics.cellWidth;
  const startX =
    options.edge === "left"
      ? boundaryLeft + 2
      : boundaryLeft + metrics.cellWidth - 3;
  const startY = rowBox.y + metrics.cellHeight / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + options.dxCells * metrics.cellWidth, startY, {
    steps: Math.max(4, Math.abs(options.dxCells) * 4),
  });
  await page.mouse.up();
};

export const dragTweenKeyByCells = async (
  page: Page,
  options: DragTweenKeyByCellsOptions,
): Promise<void> => {
  const metrics = await scrollTimelineViewportToCell(page, {
    layerIndex: options.layerIndex,
    frame: options.tweenFrame,
  });
  const tweenHandle = page
    .locator(".timeline-unified-track")
    .nth(options.layerIndex)
    .locator(".timeline-dom-tween")
    .first();
  await expect(tweenHandle, `Expected a tween handle on layer ${options.layerIndex}`).toBeVisible();
  const tweenBox = await tweenHandle.boundingBox();
  expect(tweenBox, `Tween handle on layer ${options.layerIndex} should have a bounding box`).not.toBeNull();
  if (!tweenBox) {
    throw new Error(`Tween handle bounds unavailable for layer ${options.layerIndex}`);
  }

  const startPoint = {
    x: tweenBox.x + tweenBox.width / 2,
    y: tweenBox.y + tweenBox.height / 2,
  };

  await page.mouse.move(startPoint.x, startPoint.y);
  await page.mouse.down();
  await page.mouse.move(startPoint.x + options.dxCells * metrics.cellWidth, startPoint.y, {
    steps: Math.max(4, Math.abs(options.dxCells) * 4),
  });
  await page.mouse.up();
};

export const dispatchTouchSequence = async (
  page: Page,
  steps: TouchSequenceStep[],
): Promise<void> => {
  await page.evaluate(async (inputSteps: TouchSequenceStep[]) => {
    const wait = (timeMs: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, timeMs);
      });

    let activeTarget: EventTarget | null = null;

    for (const step of inputSteps) {
      if (step.delayMs && step.delayMs > 0) {
        await wait(step.delayMs);
      }

      const hitTarget = document.elementFromPoint(step.x, step.y) ?? document.body;
      const target: EventTarget = step.type === "pointerdown" ? hitTarget : activeTarget ?? hitTarget;
      const event = new PointerEvent(step.type, {
        pointerId: step.pointerId ?? 12,
        pointerType: "touch",
        bubbles: true,
        cancelable: true,
        composed: true,
        isPrimary: true,
        clientX: step.x,
        clientY: step.y,
        button: 0,
        buttons: step.type === "pointerup" ? 0 : 1,
        pressure: step.type === "pointerup" ? 0 : 0.5,
      });

      target.dispatchEvent(event);

      if (step.type === "pointerdown") {
        activeTarget = target;
      }
      if (step.type === "pointerup") {
        activeTarget = null;
      }
    }
  }, steps);
};

export const longPressTimelineCell = async (
  page: Page,
  options: TimelineCellTarget & { durationMs?: number; pointerId?: number },
): Promise<void> => {
  const point = await getTimelineCellPoint(page, options);
  const durationMs = options.durationMs ?? 650;
  const pointerId = options.pointerId ?? 22;
  const releaseDelayMs = durationMs + 120;

  await dispatchTouchSequence(page, [
    {
      type: "pointerdown",
      x: point.x,
      y: point.y,
      pointerId,
    },
    {
      type: "pointerup",
      x: point.x,
      y: point.y,
      pointerId,
      delayMs: releaseDelayMs,
    },
  ]);
};

export const assertNoTimelineFallback = async (page: Page): Promise<void> => {
  await expect(ensureTimelineRoot(page)).toHaveAttribute("data-timeline-renderer-mode", "dom");
  await expect(
    page.locator("text=DOM timeline had an error and was switched to Classic."),
  ).toHaveCount(0);
};

export const assertNoCriticalTimelineErrors = async (page: Page): Promise<void> => {
  getCriticalCollector(page).expectNoCriticalErrors();
};

export const readFrameStart = async (page: Page, frameUuid: string): Promise<number> => {
  return page.evaluate((inputFrameUuid) => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    if (!project) {
      return -1;
    }

    const frame = project.activeTimeline.layers
      .flatMap((layer: TimelineLayerModel) => layer.frames)
      .find((entry: TimelineFrameModel) => entry.uuid === inputFrameUuid);

    return Number(frame?.start ?? -1);
  }, frameUuid);
};

export const readFrameEnd = async (page: Page, frameUuid: string): Promise<number> => {
  return page.evaluate((inputFrameUuid) => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    if (!project) {
      return -1;
    }

    const frame = project.activeTimeline.layers
      .flatMap((layer: TimelineLayerModel) => layer.frames)
      .find((entry: TimelineFrameModel) => entry.uuid === inputFrameUuid);

    return Number(frame?.end ?? -1);
  }, frameUuid);
};

export const readTweenPlayhead = async (page: Page, tweenUuid: string): Promise<number> => {
  return page.evaluate((inputTweenUuid) => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    if (!project) {
      return -1;
    }

    const tween = project.activeTimeline.layers
      .flatMap((layer: TimelineLayerModel) => layer.frames)
      .flatMap((frame: TimelineFrameModel) => frame.tweens)
      .find((entry: TimelineTweenModel) => entry.uuid === inputTweenUuid);

    return Number(tween?.playheadPosition ?? -1);
  }, tweenUuid);
};

export const readLayerOrder = async (page: Page): Promise<string[]> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    return (project?.activeTimeline.layers ?? [])
      .map((layer: TimelineLayerModel) => layer.uuid)
      .filter((uuid: string | undefined): uuid is string => typeof uuid === "string");
  });
};

export const readPlayhead = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    return Number(bridge.editor?.project?.activeTimeline?.playheadPosition ?? 0);
  });
};

export const readSelectedFrameCount = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    return bridge.editor?.project?.selection?.getSelectedObjects?.("Frame")?.length ?? 0;
  });
};

export const readFrameSummaryAt = async (
  page: Page,
  target: TimelineCellTarget,
): Promise<{
  uuid: string | null;
  start: number;
  end: number;
  contentful: boolean;
  tweenCount: number;
} | null> => {
  return page.evaluate((inputTarget: TimelineCellTarget) => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    const layer = project?.activeTimeline.layers?.[inputTarget.layerIndex];
    if (!layer) {
      return null;
    }

    const frame = layer.frames.find((entry: TimelineFrameModel) => {
      const start = Number(entry.start ?? 1);
      const end = Number(entry.end ?? start);
      return start <= inputTarget.frame && end >= inputTarget.frame;
    });

    if (!frame) {
      return null;
    }

    const start = Number(frame.start ?? 1);
    const end = Number(frame.end ?? start);
    return {
      uuid: frame.uuid ?? null,
      start,
      end,
      contentful: Boolean(frame.contentful),
      tweenCount: Array.isArray(frame.tweens) ? frame.tweens.length : 0,
    };
  }, target);
};

export const readLayerFrameCount = async (page: Page, layerIndex: number): Promise<number> => {
  return page.evaluate((inputLayerIndex: number) => {
    const bridge = window as EditorBridge;
    const layer = bridge.editor?.project?.activeTimeline.layers?.[inputLayerIndex];
    return Array.isArray(layer?.frames) ? layer.frames.length : 0;
  }, layerIndex);
};

export const readLayerTweenCount = async (page: Page, layerIndex: number): Promise<number> => {
  return page.evaluate((inputLayerIndex: number) => {
    const bridge = window as EditorBridge;
    const layer = bridge.editor?.project?.activeTimeline.layers?.[inputLayerIndex];
    if (!layer) {
      return 0;
    }

    return layer.frames.reduce((count: number, frame: TimelineFrameModel) => {
      return count + (Array.isArray(frame.tweens) ? frame.tweens.length : 0);
    }, 0);
  }, layerIndex);
};

export const readMarkerTitles = async (page: Page): Promise<string[]> => {
  return page.locator(".timeline-dom-marker").evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("title") ?? ""),
  );
};

export const readWorkAreaReadout = async (page: Page): Promise<string> => {
  const readout = page.locator(".timeline-flash-footer-readout");
  return (await readout.textContent())?.trim() ?? "";
};

export const togglePreviewPlayback = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const bridge = window as EditorBridge;
    bridge.editor?.togglePreviewPlaying?.();
  });
};

export const ensureFooterControlVisible = async (control: Locator): Promise<void> => {
  await control.scrollIntoViewIfNeeded();
  await expect(control).toBeVisible();
};
