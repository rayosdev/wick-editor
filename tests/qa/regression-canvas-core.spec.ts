import { expect, test } from "@playwright/test";
import {
  attachCriticalErrorCollector,
  bootEditor,
  clickToolButton,
  drawRectangleOnCanvas,
  drawStrokeOnCanvas,
  getActiveTool,
  readEditorState,
  setBrushSizeFromUi,
} from "./helpers/editor-regression.helpers";

type UndoRedoBridge = Window & {
  editor?: {
    undoAction?: () => void;
    redoAction?: () => void;
  };
};

test.describe("QA regression: canvas workflows", () => {
  test("brush drawing mutates frame paths and undo/redo roundtrip is stable", async ({
    page,
  }) => {
    const criticalErrors = attachCriticalErrorCollector(page);
    await bootEditor(page);

    await expect
      .poll(() => getActiveTool(page), {
        message: "Editor should start with cursor as active tool",
      })
      .toBe("cursor");

    await clickToolButton(page, "brush");

    await expect
      .poll(() => getActiveTool(page), {
        message: "Brush should be active after selecting it from the toolbox",
      })
      .toBe("brush");

    await setBrushSizeFromUi(page, 22);

    const beforeDraw = await readEditorState(page);
    await drawStrokeOnCanvas(page);

    await expect
      .poll(async () => (await readEditorState(page)).pathCount, {
        timeout: 10000,
        message: "Drawing should add at least one path to the active frame",
      })
      .toBeGreaterThan(beforeDraw.pathCount);

    const afterDraw = await readEditorState(page);

    await page.evaluate(() => {
      const bridge = window as UndoRedoBridge;
      bridge.editor?.undoAction?.();
    });

    await expect
      .poll(async () => (await readEditorState(page)).pathCount, {
        timeout: 10000,
        message: "Undo should return path count to its prior value",
      })
      .toBe(beforeDraw.pathCount);

    await page.evaluate(() => {
      const bridge = window as UndoRedoBridge;
      bridge.editor?.redoAction?.();
    });

    await expect
      .poll(async () => (await readEditorState(page)).pathCount, {
        timeout: 10000,
        message: "Redo should re-apply the path mutation",
      })
      .toBe(afterDraw.pathCount);

    criticalErrors.expectNoCriticalErrors();
  });

  test("shape selection and delete removes canvas objects without residual selection", async ({
    page,
  }) => {
    const criticalErrors = attachCriticalErrorCollector(page);
    await bootEditor(page);

    const beforeDraw = await readEditorState(page);

    await clickToolButton(page, "rectangle");
    const rectangle = await drawRectangleOnCanvas(page);

    await expect
      .poll(async () => (await readEditorState(page)).frameObjectCount, {
        timeout: 10000,
        message: "Creating a rectangle should increase active-frame object count",
      })
      .toBeGreaterThan(beforeDraw.frameObjectCount);

    await clickToolButton(page, "cursor");
    await page.mouse.click(rectangle.centerX, rectangle.centerY);

    await expect
      .poll(async () => (await readEditorState(page)).selectionCount, {
        timeout: 6000,
        message: "Clicking the rectangle should select at least one object",
      })
      .toBeGreaterThan(0);

    await page.keyboard.press("Delete");
    await page.keyboard.press("Backspace");

    await expect
      .poll(async () => (await readEditorState(page)).frameObjectCount, {
        timeout: 10000,
        message: "Deleting selection should restore frame object count",
      })
      .toBe(beforeDraw.frameObjectCount);

    await expect
      .poll(async () => (await readEditorState(page)).selectionCount, {
        timeout: 6000,
        message: "Deleting selected shape should clear the selection",
      })
      .toBe(0);

    criticalErrors.expectNoCriticalErrors();
  });
});
