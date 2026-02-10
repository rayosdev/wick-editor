import { expect, test } from "@playwright/test";

test.describe("Creative workflow: animation and color", () => {
  test("change colors and create tween motion", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {
        // Ignore localStorage access issues.
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    // Draw one rectangle on stage.
    const rectangleTool = page.locator(
      "#action-button-tooltip-tool-button-rectangle button"
    );
    await expect(rectangleTool).toBeVisible();
    await rectangleTool.click();

    const canvasWrapper = page.locator("#canvas-container-wrapper");
    await expect(canvasWrapper).toBeVisible();
    const canvasBox = await canvasWrapper.boundingBox();
    expect(canvasBox).not.toBeNull();

    if (canvasBox) {
      const startX = canvasBox.x + canvasBox.width * 0.35;
      const startY = canvasBox.y + canvasBox.height * 0.35;
      const endX = canvasBox.x + canvasBox.width * 0.52;
      const endY = canvasBox.y + canvasBox.height * 0.52;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, { steps: 12 });
      await page.mouse.up();
    }

    await page.waitForTimeout(500);

    // Select the object.
    const cursorTool = page.locator("#action-button-tooltip-tool-button-cursor button");
    await expect(cursorTool).toBeVisible();
    await cursorTool.click();

    // Ensure selection exists.
    const selectedCount = await page.evaluate(() => {
      const editor = (window as any).editor;
      editor?.selectAll?.();
      return editor?.project?.selection?.numObjects ?? 0;
    });
    expect(selectedCount).toBeGreaterThan(0);

    // Apply fill/stroke color and stroke width changes.
    const colorResult = await page.evaluate(() => {
      const editor = (window as any).editor;
      const Wick = (window as any).Wick;

      if (!editor || !Wick) {
        return { ok: false };
      }

      editor.setSelectionAttribute("fillColor", new Wick.Color("#ff7f50"));
      editor.setSelectionAttribute("strokeColor", new Wick.Color("#0055ff"));
      editor.setSelectionAttribute("strokeWidth", 10);

      const fillColor = editor.getSelectionAttribute("fillColor");
      const strokeColor = editor.getSelectionAttribute("strokeColor");
      const strokeWidth = Number(editor.getSelectionAttribute("strokeWidth"));

      return {
        ok: true,
        fillColor:
          fillColor && typeof fillColor.toCSS === "function"
            ? fillColor.toCSS()
            : String(fillColor),
        strokeColor:
          strokeColor && typeof strokeColor.toCSS === "function"
            ? strokeColor.toCSS()
            : String(strokeColor),
        strokeWidth,
      };
    });

    expect(colorResult.ok).toBe(true);
    expect(colorResult.strokeWidth).toBe(10);

    // Create tween motion between frame 1 and frame 12.
    const tweenResult = await page.evaluate(() => {
      const editor = (window as any).editor;
      const project = editor?.project;
      if (!editor || !project) {
        return { ok: false };
      }

      editor.selectAll();

      const initialX = Number(editor.getSelectionAttribute("x") ?? 0);
      project.playheadPosition = 1;
      editor.addTweenKeyframe();

      project.playheadPosition = 12;
      editor.setSelectionAttribute("x", initialX + 120);
      editor.addTweenKeyframe();

      const tweenCount = project.activeFrame?.tweens?.length ?? 0;
      return {
        ok: true,
        tweenCount,
        initialX,
        finalX: Number(editor.getSelectionAttribute("x") ?? 0),
      };
    });

    expect(tweenResult.ok).toBe(true);
    expect(tweenResult.tweenCount).toBeGreaterThan(0);
    expect(tweenResult.finalX).toBeGreaterThan(tweenResult.initialX);

    // Confirm preview can play with tweened content.
    const playButton = page.locator('input[type="image"][id="play-button-object"]');
    await expect(playButton).toBeVisible();
    await playButton.click();
    await page.waitForTimeout(800);

    const isPlaying = await page.evaluate(() => {
      const editor = (window as any).editor;
      const project = editor?.project || (window as any).project;
      return Boolean(project?.playing || project?.isPlaying);
    });
    expect(isPlaying).toBe(true);
  });
});
