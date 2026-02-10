import { test, expect } from "@playwright/test";

test.describe("Drawing and Selection Test", () => {
  test("draws lines and tests selection functionality", async ({ page }) => {
    // Track errors
    const errors: string[] = [];
    page.on("console", (msg) => {
      const text = msg.text();
      if (
        msg.type() === "error" &&
        !text.includes("DevTools") &&
        !text.includes("Ignoring Event")
      ) {
        errors.push(text);
      }
    });

    page.on("pageerror", (error) => {
      errors.push(`PAGE ERROR: ${error.message}`);
    });

    // Navigate using Playwright baseURL from config.
    await page.goto("/");

    // Wait for the editor to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(2000);

    // Wait for canvas to be ready
    await expect(page.locator("#canvas-container-wrapper")).toBeVisible();

    // Check that Wick engine is loaded
    const wickLoaded = await page.evaluate(() => {
      return typeof window.Wick !== "undefined";
    });
    expect(wickLoaded).toBe(true);

    // Select the brush tool
    const brushButton = page.locator(
      "#action-button-tooltip-tool-button-brush button",
    );
    await expect(brushButton).toBeVisible();
    await brushButton.click();
    await page.waitForTimeout(500);

    // Set brush size to 10
    const brushSizeInput = page.locator("input.settings-numeric-input").first();
    await brushSizeInput.clear();
    await brushSizeInput.fill("10");
    await page.waitForTimeout(500);

    // Draw first line
    const canvas = page.locator("#canvas-container-wrapper");
    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) throw new Error("Canvas not found");

    const startX = canvasBox.x + canvasBox.width / 2 - 100;
    const startY = canvasBox.y + canvasBox.height / 2;
    const endX = canvasBox.x + canvasBox.width / 2 + 100;
    const endY = canvasBox.y + canvasBox.height / 2;

    // Draw first line (horizontal)
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    // Draw second line (vertical)
    const midX = canvasBox.x + canvasBox.width / 2;
    const midY = canvasBox.y + canvasBox.height / 2;
    const topY = midY - 100;
    const bottomY = midY + 100;

    await page.mouse.move(midX, topY);
    await page.mouse.down();
    await page.mouse.move(midX, bottomY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    // Draw third line (diagonal)
    const diagStartX = canvasBox.x + canvasBox.width / 2 - 50;
    const diagStartY = canvasBox.y + canvasBox.height / 2 - 50;
    const diagEndX = canvasBox.x + canvasBox.width / 2 + 50;
    const diagEndY = canvasBox.y + canvasBox.height / 2 + 50;

    await page.mouse.move(diagStartX, diagStartY);
    await page.mouse.down();
    await page.mouse.move(diagEndX, diagEndY, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    // Switch to cursor tool for selection
    const cursorButton = page.locator(
      "#action-button-tooltip-tool-button-cursor button",
    );
    await expect(cursorButton).toBeVisible();
    await cursorButton.click();
    await page.waitForTimeout(500);

    // Test single line selection
    console.log("Testing single line selection...");
    await page.mouse.click(startX + 50, startY);
    await page.waitForTimeout(500);

    // Check if selection worked (look for selection indicators)
    const selectionBox = page.locator(".selection-box");
    const hasSelection = (await selectionBox.count()) > 0;
    console.log("Selection box found:", hasSelection);

    // Debug: Check what objects are in the project
    const projectInfo = await page.evaluate(() => {
      if (window.project) {
        const project = window.project;
        return {
          hasProject: true,
          activeTimeline: !!project.activeTimeline,
          activeFrame: !!project.activeFrame,
          selectionCount: project.selection ? project.selection.numObjects : 0,
          selectedObjects: project.selection
            ? project.selection.getSelectedObjects()
            : [],
        };
      }
      return { hasProject: false };
    });
    console.log("Project info:", projectInfo);

    // Test box selection
    console.log("Testing box selection...");
    const boxStartX = canvasBox.x + canvasBox.width / 2 - 150;
    const boxStartY = canvasBox.y + canvasBox.height / 2 - 150;
    const boxEndX = canvasBox.x + canvasBox.width / 2 + 150;
    const boxEndY = canvasBox.y + canvasBox.height / 2 + 150;

    await page.mouse.move(boxStartX, boxStartY);
    await page.mouse.down();
    await page.mouse.move(boxEndX, boxEndY, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(1000);

    // Check for multiple selections
    const selectionBoxes = page.locator(".selection-box");
    const selectionCount = await selectionBoxes.count();
    console.log("Number of selection boxes:", selectionCount);

    // Test grouping selected objects
    console.log("Testing grouping...");
    if (selectionCount > 1) {
      // Try to group the selected objects (Ctrl+G or Cmd+G)
      await page.keyboard.press("Control+g");
      await page.waitForTimeout(1000);
      console.log("Group command executed");
    }

    // Test moving selected objects
    console.log("Testing object movement...");
    if (selectionCount > 0) {
      // Try to move the selected objects by dragging
      const moveStartX = canvasBox.x + canvasBox.width / 2;
      const moveStartY = canvasBox.y + canvasBox.height / 2;
      const moveEndX = moveStartX + 100;
      const moveEndY = moveStartY + 50;

      await page.mouse.move(moveStartX, moveStartY);
      await page.mouse.down();
      await page.mouse.move(moveEndX, moveEndY, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(1000);
      console.log("Object movement attempted");
    }

    // Test rotation of selected objects
    console.log("Testing object rotation...");
    if (selectionCount > 0) {
      // Try to rotate the selected objects (R key)
      await page.keyboard.press("KeyR");
      await page.waitForTimeout(500);
      console.log("Rotation mode activated");

      // Try to rotate by dragging
      const rotateStartX = canvasBox.x + canvasBox.width / 2 + 50;
      const rotateStartY = canvasBox.y + canvasBox.height / 2 - 50;
      const rotateEndX = rotateStartX + 30;
      const rotateEndY = rotateStartY + 30;

      await page.mouse.move(rotateStartX, rotateStartY);
      await page.mouse.down();
      await page.mouse.move(rotateEndX, rotateEndY, { steps: 3 });
      await page.mouse.up();
      await page.waitForTimeout(1000);
      console.log("Object rotation attempted");
    }

    // Test scaling of selected objects
    console.log("Testing object scaling...");
    if (selectionCount > 0) {
      // Try to scale the selected objects (S key)
      await page.keyboard.press("KeyS");
      await page.waitForTimeout(500);
      console.log("Scaling mode activated");

      // Try to scale by dragging
      const scaleStartX = canvasBox.x + canvasBox.width / 2 + 100;
      const scaleStartY = canvasBox.y + canvasBox.height / 2;
      const scaleEndX = scaleStartX + 20;
      const scaleEndY = scaleStartY + 20;

      await page.mouse.move(scaleStartX, scaleStartY);
      await page.mouse.down();
      await page.mouse.move(scaleEndX, scaleEndY, { steps: 3 });
      await page.mouse.up();
      await page.waitForTimeout(1000);
      console.log("Object scaling attempted");
    }

    // Test deselection
    console.log("Testing deselection...");
    await page.mouse.click(canvasBox.x + 50, canvasBox.y + 50); // Click empty area
    await page.waitForTimeout(500);

    // Check if selection was cleared
    const finalSelectionCount = await selectionBoxes.count();
    console.log("Final selection count:", finalSelectionCount);

    // Test keyboard shortcuts
    console.log("Testing keyboard shortcuts...");
    await page.keyboard.press("Control+a"); // Select all
    await page.waitForTimeout(500);
    const selectAllCount = await selectionBoxes.count();
    console.log("Select all count:", selectAllCount);

    await page.keyboard.press("Escape"); // Deselect all
    await page.waitForTimeout(500);
    const escapeCount = await selectionBoxes.count();
    console.log("Escape deselect count:", escapeCount);

    // Take a screenshot for visual verification
    await page.screenshot({
      path: "test-results/drawing-selection-test.png",
      fullPage: true,
    });

    // Check for any console errors
    if (errors.length > 0) {
      console.log("Console errors found:", errors);
    }

    // Verify no critical errors occurred
    expect(
      errors.filter(
        (error) =>
          error.includes("isSelected") ||
          error.includes("Cannot read properties of null"),
      ),
    ).toHaveLength(0);
  });
});
