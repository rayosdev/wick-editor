import { expect, test } from "@playwright/test";
import {
  attachCriticalErrorCollector,
  bootEditor,
  readEditorState,
} from "./helpers/editor-regression.helpers";

test.describe.configure({ mode: "serial", timeout: 90000 });

test.describe("QA regression: UI workflows", () => {
  test("project settings modal persists project name updates", async ({
    page,
  }) => {
    const criticalErrors = attachCriticalErrorCollector(page);
    await bootEditor(page);

    const nextProjectName = `QA Regression ${Date.now()}`;
    const settingsModal = page.locator(".simple-settings-modal-container");

    await page.locator(".menu-bar-project-name").click();
    await expect(settingsModal).toBeVisible();

    await settingsModal.locator("input[name='name']").fill(nextProjectName);

    await settingsModal.getByRole("button", { name: "Apply" }).click();

    await expect(page.locator(".menu-bar-project-name")).toHaveText(nextProjectName);

    await expect
      .poll(async () => (await readEditorState(page)).projectName, {
        timeout: 8000,
        message: "Project name should propagate to the editor model after Apply",
      })
      .toBe(nextProjectName);

    criticalErrors.expectNoCriticalErrors();
  });

  test("timeline renderer toggle and step controls stay synchronized with model", async ({
    page,
  }) => {
    const criticalErrors = attachCriticalErrorCollector(page);
    await bootEditor(page);

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    const initialState = await readEditorState(page);

    await page.locator("#action-button-tooltip-timeline-step-forward button").click();
    await expect
      .poll(async () => (await readEditorState(page)).playheadPosition, {
        timeout: 8000,
        message: "Step forward should increment playhead by one frame",
      })
      .toBe(initialState.playheadPosition + 1);

    await page.locator("#action-button-tooltip-timeline-step-backward button").click();
    await expect
      .poll(async () => (await readEditorState(page)).playheadPosition, {
        timeout: 8000,
        message: "Step backward should return to initial playhead position",
      })
      .toBe(initialState.playheadPosition);

    await page.locator(".timeline-renderer-toggle-button", { hasText: "Classic" }).click();
    await expect(page.locator('[data-timeline-renderer-mode="classic"]')).toBeVisible();

    await page.locator(".timeline-renderer-toggle-button", { hasText: "DOM" }).click();
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    criticalErrors.expectNoCriticalErrors();
  });

  test("timeline layer add/delete controls mutate timeline model", async ({ page }) => {
    const criticalErrors = attachCriticalErrorCollector(page);
    await bootEditor(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    const beforeAddLayer = await readEditorState(page);
    await page.locator(".timeline-dom-layer-add").click();

    await expect
      .poll(async () => (await readEditorState(page)).layerCount, {
        timeout: 8000,
        message: "Add Layer should increase timeline layer count",
      })
      .toBe(beforeAddLayer.layerCount + 1);

    await page.locator(".timeline-dom-layer-delete-button").last().click();
    await expect
      .poll(async () => (await readEditorState(page)).layerCount, {
        timeout: 8000,
        message: "Delete Layer should restore original timeline layer count",
      })
      .toBe(beforeAddLayer.layerCount);

    criticalErrors.expectNoCriticalErrors();
  });
});
