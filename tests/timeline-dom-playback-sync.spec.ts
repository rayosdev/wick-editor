import { test, expect, type Page } from "@playwright/test";

type EditorBridge = Window & {
  editor?: {
    project?: {
      activeTimeline?: TimelineModel;
      selection?: {
        clear?: () => void;
      };
      view?: {
        render?: () => void;
      };
      guiElement?: {
        draw?: () => void;
      };
    };
    state?: {
      previewPlaying?: boolean;
    };
    notifyTimelineSoftRender?: () => void;
    togglePreviewPlaying?: () => void;
  };
  Wick?: {
    Layer: new (args?: { name?: string }) => TimelineLayerModel;
    Frame: new (args?: { start?: number; end?: number; identifier?: string }) => TimelineFrameModel;
  };
};

type TimelineFrameModel = {
  uuid?: string;
  start?: number;
  end?: number;
  remove?: () => void;
};

type TimelineLayerModel = {
  frames: TimelineFrameModel[];
  addFrame?: (frame: TimelineFrameModel) => void;
};

type TimelineModel = {
  layers: TimelineLayerModel[];
  playheadPosition: number;
  activeLayerIndex: number;
  addLayer?: (layer: TimelineLayerModel) => void;
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

const preparePreviewTimeline = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    const bridge = window as EditorBridge;
    const editor = bridge.editor;
    const project = editor?.project;
    const Wick = bridge.Wick;

    if (!editor || !project || !Wick || !project.activeTimeline) {
      return;
    }

    const timeline = project.activeTimeline;
    while ((timeline.layers ?? []).length < 1) {
      timeline.addLayer?.(new Wick.Layer());
    }

    const layer = timeline.layers[0];
    if (!layer) {
      return;
    }

    layer.frames.slice().forEach((frame: TimelineFrameModel) => frame.remove?.());
    layer.addFrame?.(new Wick.Frame({ start: 1, end: 32, identifier: "Preview Span" }));

    timeline.playheadPosition = 1;
    timeline.activeLayerIndex = 0;
    project.selection?.clear?.();
    project.view?.render?.();
    project.guiElement?.draw?.();
    editor.notifyTimelineSoftRender?.();
  });
};

test.describe("Timeline DOM playback sync", () => {
  test("playback updates playhead, first scrub does not fallback, and follow toggle works", async ({
    page,
  }) => {
    await bootEditor(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await preparePreviewTimeline(page);

    const playheadBefore = await readPlayhead(page);
    await page.evaluate(() => {
      const bridge = window as EditorBridge;
      if (!bridge.editor?.togglePreviewPlaying) {
        return;
      }
      if (!bridge.editor.state?.previewPlaying) {
        bridge.editor.togglePreviewPlaying();
      }
    });

    await page.waitForFunction(
      (initialPlayhead) => {
        const bridge = window as EditorBridge;
        const current = Number(bridge.editor?.project?.activeTimeline?.playheadPosition ?? 0);
        return current !== Number(initialPlayhead);
      },
      playheadBefore,
      { timeout: 15000 },
    );

    const playheadAfterTick = await readPlayhead(page);

    expect(playheadAfterTick).not.toBe(playheadBefore);
    await expect(page.locator(".timeline-dom-playhead")).toBeVisible();

    await page.evaluate(() => {
      const bridge = window as EditorBridge;
      if (!bridge.editor?.togglePreviewPlaying) {
        return;
      }
      if (bridge.editor.state?.previewPlaying) {
        bridge.editor.togglePreviewPlaying();
      }
    });

    await page.waitForFunction(() => {
      const bridge = window as EditorBridge;
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
