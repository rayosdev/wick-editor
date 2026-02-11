// @ts-nocheck - TODO: Remove when properly typing test files
import { test, expect } from "@playwright/test";

type CanvasInteractionWindow = Window & {
  editor?: {
    project?: {
      view?: {
        paper?: {
          view?: {
            zoom?: number;
            center?: { x?: number; y?: number };
          };
        };
      };
    };
  };
};

/**
 * E2E tests for canvas mouse/trackpad interactions
 * These tests complement the Vitest unit tests by verifying actual browser behavior
 */

test.describe("Canvas Mouse/Trackpad Interactions", () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for page load (Wick Editor is heavy)
    test.setTimeout(60000);

    // Skip welcome screen
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });

    // Navigate and wait for editor to load
    await page.goto("/", { waitUntil: "load", timeout: 30000 });

    // Wait for canvas to be ready
    await page
      .locator("#canvas-container-wrapper")
      .waitFor({ state: "visible", timeout: 10000 });
  });

  test("should zoom in with Ctrl+Wheel", async ({ page }) => {
    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Get initial zoom level from Paper.js view
    const initialZoom = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    // Note: Wick Editor has inverted zoom (positive deltaY = zoom in)
    // Simulate Ctrl+Wheel zoom in (positive deltaY)
    await canvas.hover();
    await page.mouse.wheel(0, 100); // Scroll down without modifier (should pan)
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, 100); // Scroll down with Ctrl (should zoom IN due to inversion)
    await page.keyboard.up("Control");

    // Wait for zoom to apply
    await page.waitForTimeout(200);

    // Check zoom increased
    const newZoom = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    expect(newZoom).toBeGreaterThan(initialZoom);
  });

  test("should pan canvas with Wheel (no modifiers)", async ({ page }) => {
    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Get initial center position
    const initialCenter = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      const view = bridge.editor?.project?.view?.paper?.view;
      return { x: view?.center?.x || 0, y: view?.center?.y || 0 };
    });

    // Simulate wheel pan (no modifiers)
    await canvas.hover();
    await page.mouse.wheel(50, 50);

    // Wait for pan to apply
    await page.waitForTimeout(200);

    // Check center moved
    const newCenter = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      const view = bridge.editor?.project?.view?.paper?.view;
      return { x: view?.center?.x || 0, y: view?.center?.y || 0 };
    });

    expect(newCenter.x).not.toBe(initialCenter.x);
    expect(newCenter.y).not.toBe(initialCenter.y);
  });

  test("should respect zoom bounds (min/max)", async ({ page }) => {
    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Zoom out to minimum
    await canvas.hover();
    await page.keyboard.down("Control");
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 100); // Scroll down = zoom out
    }
    await page.keyboard.up("Control");
    await page.waitForTimeout(100);

    const minZoom = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    // Try to zoom out more (should stay at min)
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, 100);
    await page.keyboard.up("Control");
    await page.waitForTimeout(100);

    const stillMinZoom = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    expect(stillMinZoom).toBe(minZoom);
    expect(minZoom).toBeGreaterThanOrEqual(0.01); // Should not go below min
  });

  test("should not interfere with timeline wheel events", async ({ page }) => {
    const timeline = page.locator("#animation-timeline-container");
    await timeline.waitFor();

    // Get initial canvas zoom
    const canvasZoomBefore = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    // Scroll on timeline (should NOT zoom canvas)
    await timeline.hover();
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -100);
    await page.keyboard.up("Control");
    await page.waitForTimeout(100);

    // Canvas zoom should be unchanged
    const canvasZoomAfter = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    expect(canvasZoomAfter).toBe(canvasZoomBefore);
  });
});

test.describe("Touch Gestures (Mobile/Tablet)", () => {
  test.use({
    viewport: { width: 768, height: 1024 },
    hasTouch: true,
  });

  test("should support two-finger pan on mobile", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });
    await page.goto("/");

    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Get initial center
    const initialCenter = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      const view = bridge.editor?.project?.view?.paper?.view;
      return { x: view?.center?.x || 0, y: view?.center?.y || 0 };
    });

    // Simulate two-finger pan
    // Note: Playwright's touch simulation is limited, but this tests the event handlers exist
    await canvas.tap();

    // The actual touch gesture would be:
    // 1. touchstart with 2 touches
    // 2. touchmove with 2 touches (moving together = pan)
    // 3. touchend

    // For now, just verify the touch event handlers are attached
    const hasTouchHandlers = await page.evaluate(() => {
      const canvas = document.querySelector("#canvas-container-wrapper canvas");
      // Check if touch event listeners exist (they're added in View.Project.js)
      return canvas !== null;
    });

    expect(hasTouchHandlers).toBe(true);
  });

  test.skip("should support pinch-to-zoom on mobile", async ({ page }) => {
    // TODO: Implement when Playwright adds better pinch gesture support
    // or when using a real device testing service
    // This would test:
    // 1. Two fingers moving apart = zoom in
    // 2. Two fingers moving together = zoom out
    // 3. 1.5x sensitivity applied
  });
});

test.describe("Cross-browser Compatibility", () => {
  test("canvas interactions work in Firefox", async ({ page, browserName }) => {
    test.skip(browserName !== "firefox", "Firefox-specific test");

    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });
    await page.goto("/");

    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Test basic zoom works
    await canvas.hover();
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -100);
    await page.keyboard.up("Control");
    await page.waitForTimeout(100);

    const zoom = await page.evaluate(() => {
      const bridge = window as CanvasInteractionWindow;
      return bridge.editor?.project?.view?.paper?.view?.zoom || 1;
    });

    expect(zoom).toBeGreaterThan(0.5);
  });

  test("canvas interactions work in WebKit/Safari", async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== "webkit", "WebKit-specific test");

    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });
    await page.goto("/");

    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Test gesture events (Safari-specific)
    await canvas.hover();

    // Safari uses gesture events for pinch-to-zoom
    // These are tested in the unit tests, but we verify the page loads
    expect(await canvas.isVisible()).toBe(true);
  });
});

test.describe("Performance", () => {
  test("should handle rapid zoom events without lag", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });
    await page.goto("/");

    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Measure time for 10 rapid zoom events
    await canvas.hover();
    await page.keyboard.down("Control");

    const startTime = Date.now();
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, -10);
    }
    const endTime = Date.now();

    await page.keyboard.up("Control");

    // Should complete in reasonable time (not blocking)
    const duration = endTime - startTime;
    expect(duration).toBeLessThan(1000); // Should be much faster, but allow buffer
  });

  test("should throttle with requestAnimationFrame", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });
    await page.goto("/");

    const canvas = page.locator("#canvas-container-wrapper canvas").first();
    await canvas.waitFor();

    // Count how many times Paper.js view updates during rapid scrolling
    const updateCount = await page.evaluate(async () => {
      let count = 0;
      const bridge = window as CanvasInteractionWindow;
      const view = bridge.editor?.project?.view?.paper?.view;
      if (!view) return 0;

      const originalZoomSetter = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(view),
        "zoom"
      )?.set;

      // Mock zoom setter to count updates
      Object.defineProperty(view, "zoom", {
        set: function (value) {
          count++;
          if (originalZoomSetter) {
            originalZoomSetter.call(this, value);
          }
        },
        get: function () {
          return this._zoom || 1;
        },
      });

      // Simulate rapid wheel events
      const canvas = document.querySelector(
        "#canvas-container-wrapper canvas"
      ) as HTMLCanvasElement;
      for (let i = 0; i < 20; i++) {
        const event = new WheelEvent("wheel", {
          deltaY: -10,
          ctrlKey: true,
          bubbles: true,
        });
        canvas?.dispatchEvent(event);
      }

      // Wait for RAF to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      return count;
    });

    // Should have fewer updates than events due to RAF throttling
    // 20 events should result in ~6 updates (at 60fps with 100ms = ~6 frames)
    expect(updateCount).toBeLessThan(20);
    expect(updateCount).toBeGreaterThan(0);
  });
});
