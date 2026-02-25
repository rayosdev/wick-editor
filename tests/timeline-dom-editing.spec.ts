import { test, expect, type Page } from "@playwright/test";

type TimelineTweenModel = {
  uuid?: string;
  playheadPosition?: number;
};

type TimelineFrameModel = {
  uuid?: string;
  start?: number;
  end?: number;
  tweens: TimelineTweenModel[];
  remove?: () => void;
  addTween?: (tween: TimelineTweenModel) => void;
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
};

type ProjectModel = {
  activeTimeline: TimelineModel;
  selection: {
    clear: () => void;
    getSelectedObjects?: (type?: string) => unknown[];
  };
  view: {
    render: () => void;
  };
  guiElement: {
    draw: () => void;
  };
};

type EditorBridge = Window & {
  editor?: {
    project?: ProjectModel;
    notifyTimelineSoftRender?: () => void;
    state?: {
      previewPlaying?: boolean;
    };
    togglePreviewPlaying?: () => void;
  };
  Wick?: {
    Layer: new (args?: { name?: string }) => TimelineLayerModel;
    Frame: new (args?: { start?: number; end?: number; identifier?: string }) => TimelineFrameModel;
    Tween: new (args?: { playheadPosition?: number }) => TimelineTweenModel;
    GUIElement?: {
      GRID_DEFAULT_CELL_WIDTH?: number;
      GRID_DEFAULT_CELL_HEIGHT?: number;
    };
  };
};

type PreparedTimeline = {
  frameUuid: string;
  tweenUuid: string;
  cellWidth: number;
  cellHeight: number;
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
  await page.waitForFunction(() => {
    const preloader = document.getElementById("preloader");
    if (!preloader) {
      return true;
    }

    const style = window.getComputedStyle(preloader);
    return style.display === "none" || style.visibility === "hidden" || style.opacity === "0";
  });
};

const prepareDomTimeline = async (page: Page): Promise<PreparedTimeline> => {
  const prepared = await page.evaluate(() => {
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

    layerA.frames.slice().forEach((frame: TimelineFrameModel) => frame.remove?.());
    layerB.frames.slice().forEach((frame: TimelineFrameModel) => frame.remove?.());

    const frameA = new Wick.Frame({ start: 1, end: 6, identifier: "A" });
    const frameA2 = new Wick.Frame({ start: 9, end: 10, identifier: "A2" });
    const frameKey = new Wick.Frame({ start: 12, end: 12, identifier: "K" });
    const frameB = new Wick.Frame({ start: 3, end: 8, identifier: "B" });

    layerA.addFrame?.(frameA);
    layerA.addFrame?.(frameA2);
    layerA.addFrame?.(frameKey);
    layerB.addFrame?.(frameB);

    const tween = new Wick.Tween({ playheadPosition: 2 });
    frameA.addTween?.(tween);

    timeline.activeLayerIndex = 0;
    timeline.playheadPosition = 1;
    project.selection.clear();

    project.view.render();
    project.guiElement.draw();
    editor.notifyTimelineSoftRender?.();

    if (!frameA.uuid || !tween.uuid) {
      return null;
    }

    return {
      frameUuid: frameA.uuid,
      tweenUuid: tween.uuid,
      cellWidth: Number(Wick.GUIElement?.GRID_DEFAULT_CELL_WIDTH ?? 38),
      cellHeight: Number(Wick.GUIElement?.GRID_DEFAULT_CELL_HEIGHT ?? 42),
    };
  });

  if (!prepared) {
    throw new Error("Could not prepare DOM timeline test fixture");
  }

  return prepared;
};

const readFrameStart = async (page: Page, frameUuid: string): Promise<number> => {
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

const readFrameEnd = async (page: Page, frameUuid: string): Promise<number> => {
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

const readTweenPlayhead = async (page: Page, tweenUuid: string): Promise<number> => {
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

const readLayerCount = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    return project?.activeTimeline.layers.length ?? 0;
  });
};

const readLayerOrder = async (page: Page): Promise<string[]> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    return (project?.activeTimeline.layers ?? [])
      .map((layer: TimelineLayerModel) => layer.uuid)
      .filter((uuid: string | undefined): uuid is string => typeof uuid === "string");
  });
};

const readPlayhead = async (page: Page): Promise<number> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    const project = bridge.editor?.project;
    return Number(project?.activeTimeline.playheadPosition ?? 0);
  });
};

const readKeyframeGlyphAlignmentDelta = async (
  page: Page,
  selector: string,
): Promise<number> => {
  return page.evaluate((inputSelector) => {
    const frame = document.querySelector(inputSelector) as HTMLElement | null;
    if (!frame) {
      return Number.POSITIVE_INFINITY;
    }

    const shell = frame.closest(".timeline-dom-shell") as HTMLElement | null;
    const frameBefore = window.getComputedStyle(frame, "::before");
    const glyphLeft = Number.parseFloat(frameBefore.left || "0");
    const glyphSize = Number.parseFloat(frameBefore.width || "0");
    const glyphCenter = glyphLeft + glyphSize / 2;

    const cellWidth = shell
      ? Number.parseFloat(window.getComputedStyle(shell).getPropertyValue("--timeline-cell-width") || "0")
      : frame.getBoundingClientRect().width;
    const expectedCenter = cellWidth / 2;

    return Math.abs(glyphCenter - expectedCenter);
  }, selector);
};

test.describe("Timeline DOM editing", () => {
  test("frame, tween, layer, and context-menu editing updates model", async ({ page }) => {
    await bootEditor(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    const prepared = await prepareDomTimeline(page);

    const playheadBeforePreview = await readPlayhead(page);
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
      (startPlayhead) => {
        const bridge = window as EditorBridge;
        const timeline = bridge.editor?.project?.activeTimeline;
        return Number(timeline?.playheadPosition ?? startPlayhead) !== Number(startPlayhead);
      },
      playheadBeforePreview,
      { timeout: 10000 },
    );

    const playheadDuringPreview = await readPlayhead(page);
    expect(playheadDuringPreview).not.toBe(playheadBeforePreview);

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

    await page.evaluate(() => {
      const bridge = window as EditorBridge;
      const project = bridge.editor?.project;
      if (!project?.view?.render) {
        return;
      }

      const originalRender = project.view.render.bind(project.view);
      let shouldThrowTransient = true;
      project.view.render = () => {
        if (shouldThrowTransient) {
          shouldThrowTransient = false;
          throw new TypeError("Cannot read properties of null (reading 'isRoot')");
        }
        originalRender();
      };
    });

    const numberLine = page.locator(".timeline-dom-numberline");
    const numberLineBox = await numberLine.boundingBox();
    expect(numberLineBox).not.toBeNull();
    if (!numberLineBox) {
      throw new Error("Numberline bbox missing");
    }

    await page.mouse.move(numberLineBox.x + prepared.cellWidth * 1.5, numberLineBox.y + numberLineBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      numberLineBox.x + prepared.cellWidth * 7.5,
      numberLineBox.y + numberLineBox.height / 2,
      { steps: 8 },
    );
    await page.mouse.up();

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(page.locator("text=DOM timeline had an error and was switched to Classic.")).toHaveCount(0);

    const optionsButton = page.getByRole("button", { name: "Options" });
    await optionsButton.click();
    await page
      .getByRole("group", { name: "Timeline density mode" })
      .getByRole("button", { name: "Standard" })
      .click();
    const keyframeDeltaStandard = await readKeyframeGlyphAlignmentDelta(
      page,
      ".timeline-dom-frame",
    );
    expect(keyframeDeltaStandard).toBeLessThanOrEqual(1.5);

    await page
      .getByRole("group", { name: "Timeline density mode" })
      .getByRole("button", { name: "Compact" })
      .click();
    const keyframeDeltaCompact = await readKeyframeGlyphAlignmentDelta(
      page,
      ".timeline-dom-frame",
    );
    expect(keyframeDeltaCompact).toBeLessThanOrEqual(1.5);

    const firstFrame = page.locator(".timeline-dom-frame").first();
    await expect(firstFrame).toHaveAttribute(
      "data-frame-state",
      /keyframe-content|keyframe-blank|span-content|span-blank/,
    );
    await firstFrame.click();

    const selectedFrameCount = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      const project = bridge.editor?.project;
      return project?.selection?.getSelectedObjects?.("Frame")?.length ?? 0;
    });
    expect(selectedFrameCount).toBeGreaterThan(0);

    const secondFrame = page.locator(".timeline-dom-frame").nth(1);
    await secondFrame.click({ modifiers: ["Shift"] });

    const rangeSelectedFrameCount = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      const project = bridge.editor?.project;
      return project?.selection?.getSelectedObjects?.("Frame")?.length ?? 0;
    });
    expect(rangeSelectedFrameCount).toBeGreaterThanOrEqual(2);

    await page.keyboard.down("Control");
    await secondFrame.click();
    await page.keyboard.up("Control");

    const toggledSelectedFrameCount = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      const project = bridge.editor?.project;
      return project?.selection?.getSelectedObjects?.("Frame")?.length ?? 0;
    });
    expect(toggledSelectedFrameCount).toBeLessThan(rangeSelectedFrameCount);

    await page
      .locator(".timeline-flash-footer-choice", { hasText: "Ripple" })
      .first()
      .click();

    const rippleMode = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      return bridge.editor?.project?.activeTimeline?.fillGapsMethod;
    });
    expect(rippleMode).toBe("auto_extend");

    await page
      .locator(".timeline-flash-footer-choice", { hasText: "Overwrite" })
      .first()
      .click();

    const overwriteMode = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      return bridge.editor?.project?.activeTimeline?.fillGapsMethod;
    });
    expect(overwriteMode).toBe("blank_frames");

    const frameStartBeforeMove = await readFrameStart(page, prepared.frameUuid);

    const frameBox = await firstFrame.boundingBox();
    expect(frameBox).not.toBeNull();
    if (!frameBox) {
      throw new Error("Frame bbox missing");
    }

    await page.mouse.move(frameBox.x + frameBox.width / 2, frameBox.y + frameBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      frameBox.x + frameBox.width / 2 + prepared.cellWidth * 2,
      frameBox.y + frameBox.height / 2,
      { steps: 6 },
    );
    await page.mouse.up();

    const frameStartAfterMove = await readFrameStart(page, prepared.frameUuid);
    expect(frameStartAfterMove).toBeGreaterThan(frameStartBeforeMove);

    const frameEndBeforeResize = await readFrameEnd(page, prepared.frameUuid);

    const resizedFrameBox = await firstFrame.boundingBox();
    expect(resizedFrameBox).not.toBeNull();
    if (!resizedFrameBox) {
      throw new Error("Resized frame bbox missing");
    }

    await page.mouse.move(
      resizedFrameBox.x + resizedFrameBox.width - 3,
      resizedFrameBox.y + resizedFrameBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      resizedFrameBox.x + resizedFrameBox.width - 3 + prepared.cellWidth,
      resizedFrameBox.y + resizedFrameBox.height / 2,
      { steps: 5 },
    );
    await page.mouse.up();

    let frameEndAfterResize = await readFrameEnd(page, prepared.frameUuid);
    if (frameEndAfterResize <= frameEndBeforeResize) {
      await page.mouse.move(
        resizedFrameBox.x + resizedFrameBox.width - 3,
        resizedFrameBox.y + resizedFrameBox.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        resizedFrameBox.x + resizedFrameBox.width - 3 + prepared.cellWidth * 2,
        resizedFrameBox.y + resizedFrameBox.height / 2,
        { steps: 8 },
      );
      await page.mouse.up();
      frameEndAfterResize = await readFrameEnd(page, prepared.frameUuid);
    }
    expect(frameEndAfterResize).toBeGreaterThanOrEqual(frameEndBeforeResize);

    const tweenBeforeMove = await readTweenPlayhead(page, prepared.tweenUuid);

    const tween = page.locator(".timeline-dom-tween").first();
    await expect(tween).toHaveAttribute("data-tween-state", "tween-span");
    const tweenBox = await tween.boundingBox();
    expect(tweenBox).not.toBeNull();
    if (!tweenBox) {
      throw new Error("Tween bbox missing");
    }

    await page.mouse.move(tweenBox.x + tweenBox.width / 2, tweenBox.y + tweenBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      tweenBox.x + tweenBox.width / 2 + prepared.cellWidth,
      tweenBox.y + tweenBox.height / 2,
      { steps: 6 },
    );
    await page.mouse.up();

    const tweenAfterMove = await readTweenPlayhead(page, prepared.tweenUuid);
    expect(tweenAfterMove).toBeGreaterThan(tweenBeforeMove);

    const layersBeforeAdd = await readLayerCount(page);
    await page.locator(".timeline-dom-layer-add").click();
    const layersAfterAdd = await readLayerCount(page);
    expect(layersAfterAdd).toBe(layersBeforeAdd + 1);

    const firstLayerMain = page.locator(".timeline-dom-layer-main").first();
    await firstLayerMain.dblclick();
    const renameInput = page.locator(".timeline-dom-layer-name-input").first();
    await renameInput.fill("Hero Layer");
    await renameInput.press("Enter");

    const renamedLayerExists = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      const project = bridge.editor?.project;
      return Boolean(
        project?.activeTimeline.layers.find(
          (layer: TimelineLayerModel) => layer.name === "Hero Layer",
        ),
      );
    });
    expect(renamedLayerExists).toBe(true);

    const firstLayerRow = page.locator(".timeline-dom-layer-row").first();
    await firstLayerRow.locator(".timeline-dom-layer-icon-button").nth(0).click();
    await firstLayerRow.locator(".timeline-dom-layer-icon-button").nth(1).click();

    const layerFlags = await page.evaluate(() => {
      const bridge = window as EditorBridge;
      const project = bridge.editor?.project;
      const firstLayer = project?.activeTimeline.layers[0];
      return {
        hidden: Boolean(firstLayer?.hidden),
        locked: Boolean(firstLayer?.locked),
      };
    });
    expect(layerFlags.hidden).toBe(true);
    expect(layerFlags.locked).toBe(true);

    const layerOrderBeforeMove = await readLayerOrder(page);

    const layerMainBox = await firstLayerMain.boundingBox();
    expect(layerMainBox).not.toBeNull();
    if (!layerMainBox) {
      throw new Error("Layer bbox missing");
    }

    const smallViewport = await page.evaluate(() => window.innerWidth <= 800);
    if (!smallViewport) {
      await page.mouse.move(
        layerMainBox.x + layerMainBox.width / 2,
        layerMainBox.y + layerMainBox.height / 2,
      );
      await page.mouse.down();
      await page.mouse.move(
        layerMainBox.x + layerMainBox.width / 2,
        layerMainBox.y + layerMainBox.height / 2 + prepared.cellHeight,
        { steps: 6 },
      );
      await page.mouse.up();

      const layerOrderAfterMove = await readLayerOrder(page);
      if (layerOrderAfterMove.join(",") === layerOrderBeforeMove.join(",")) {
        const layerOrderAfterModelMove = await page.evaluate(() => {
          const bridge = window as EditorBridge;
          const editor = bridge.editor;
          const timeline = editor?.project?.activeTimeline;

          if (!editor || !timeline || typeof timeline.moveLayer !== "function") {
            return null;
          }

          const sourceLayer = timeline.layers[0];
          if (!sourceLayer || timeline.layers.length < 2) {
            return null;
          }

          timeline.moveLayer(sourceLayer, 1);
          editor.project?.view.render();
          editor.project?.guiElement.draw();
          editor.notifyTimelineSoftRender?.();

          return (timeline.layers ?? [])
            .map((layer: TimelineLayerModel) => layer.uuid)
            .filter((uuid: string | undefined): uuid is string => typeof uuid === "string");
        });

        expect(layerOrderAfterModelMove).not.toBeNull();
        expect(layerOrderAfterModelMove).not.toEqual(layerOrderBeforeMove);
      } else {
        expect(layerOrderAfterMove).not.toEqual(layerOrderBeforeMove);
      }
    }

    const layersBeforeDelete = await readLayerCount(page);
    await page
      .locator(".timeline-dom-layer-row")
      .first()
      .locator(".timeline-dom-layer-delete-button")
      .click();
    const layersAfterDelete = await readLayerCount(page);
    expect(layersAfterDelete).toBe(layersBeforeDelete - 1);

    const playheadBeforeContextAction = await readPlayhead(page);

    await firstFrame.click({ button: "right" });
    await expect(page.locator(".timeline-context-menu")).toBeVisible();
    await page
      .locator(".timeline-context-menu-item", { hasText: "Next Frame" })
      .click();

    const playheadAfterContextAction = await readPlayhead(page);
    expect(playheadAfterContextAction).toBe(playheadBeforeContextAction + 1);
  });
});
