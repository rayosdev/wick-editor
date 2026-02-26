import { expect, test, type Page } from "@playwright/test";

type EditorBridge = Window & {
  editor?: {
    state?: {
      previewPlaying?: boolean;
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

const readPreviewPlaying = async (page: Page): Promise<boolean> => {
  return page.evaluate(() => {
    const bridge = window as EditorBridge;
    return Boolean(bridge.editor?.state?.previewPlaying);
  });
};

const dispatchTouchEvent = async (
  page: Page,
  input: {
    selector: string;
    type: "touchstart" | "touchmove" | "touchend" | "touchcancel";
    x: number;
    y: number;
  },
): Promise<void> => {
  await page.evaluate((payload) => {
    const target = document.querySelector(payload.selector);
    if (!target) {
      return;
    }

    const touchPoint = {
      identifier: 1,
      target,
      clientX: payload.x,
      clientY: payload.y,
      pageX: payload.x + window.scrollX,
      pageY: payload.y + window.scrollY,
      screenX: payload.x,
      screenY: payload.y,
      radiusX: 1,
      radiusY: 1,
      rotationAngle: 0,
      force: 0.5,
    };
    const activeTouches =
      payload.type === "touchend" || payload.type === "touchcancel"
        ? []
        : [touchPoint];

    const touchEvent = new Event(payload.type, {
      bubbles: true,
      cancelable: true,
    });

    Object.defineProperty(touchEvent, "touches", {
      value: activeTouches,
      configurable: true,
    });
    Object.defineProperty(touchEvent, "targetTouches", {
      value: activeTouches,
      configurable: true,
    });
    Object.defineProperty(touchEvent, "changedTouches", {
      value: [touchPoint],
      configurable: true,
    });

    target.dispatchEvent(touchEvent);
  }, input);
};

const centerOf = async (
  page: Page,
  selector: string,
): Promise<{ x: number; y: number }> => {
  const box = await page.locator(selector).boundingBox();
  if (!box) {
    throw new Error(`Missing bounds for ${selector}`);
  }

  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
};

test.describe("Tooltip mobile long-press", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
  });

  test("eligible long press shows tooltip, consumes action, quick tap still runs action", async (
    { page },
    testInfo,
  ) => {
    test.skip(
      !testInfo.project.name.includes("mobile"),
      "Mobile long-press behavior only",
    );

    await bootEditor(page);

    const playSelector = "#play-button-object";
    const playCenter = await centerOf(page, playSelector);
    const playTooltip = page.locator(".wick-tooltip", { hasText: "Preview Play" });

    expect(await readPreviewPlaying(page)).toBe(false);

    await dispatchTouchEvent(page, {
      selector: playSelector,
      type: "touchstart",
      x: playCenter.x,
      y: playCenter.y,
    });
    await page.waitForTimeout(700);
    await expect(playTooltip).toBeVisible();
    await dispatchTouchEvent(page, {
      selector: playSelector,
      type: "touchend",
      x: playCenter.x,
      y: playCenter.y,
    });
    await page.waitForTimeout(150);

    expect(await readPreviewPlaying(page)).toBe(false);

    const noTooltipLongPressSelector =
      "#action-button-tooltip-timeline-step-forward-anchor button";
    const noTooltipControl = page.locator(noTooltipLongPressSelector);
    if ((await noTooltipControl.count()) > 0) {
      const noTooltipCenter = await centerOf(page, noTooltipLongPressSelector);
      const nextFrameTooltip = page.locator(".wick-tooltip", { hasText: "Next Frame" });

      await dispatchTouchEvent(page, {
        selector: noTooltipLongPressSelector,
        type: "touchstart",
        x: noTooltipCenter.x,
        y: noTooltipCenter.y,
      });
      await page.waitForTimeout(700);
      await expect(nextFrameTooltip).toBeHidden();
      await dispatchTouchEvent(page, {
        selector: noTooltipLongPressSelector,
        type: "touchend",
        x: noTooltipCenter.x,
        y: noTooltipCenter.y,
      });
    }

    await dispatchTouchEvent(page, {
      selector: playSelector,
      type: "touchstart",
      x: playCenter.x,
      y: playCenter.y,
    });
    await page.waitForTimeout(80);
    await dispatchTouchEvent(page, {
      selector: playSelector,
      type: "touchend",
      x: playCenter.x,
      y: playCenter.y,
    });

    await page.waitForFunction(() => {
      const bridge = window as EditorBridge;
      return Boolean(bridge.editor?.state?.previewPlaying);
    });
  });
});
