import { expect, test } from "@playwright/test";

test.describe("Creative workflow automation subset", () => {
  test("rename, draw, cache save/load roundtrip", async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {
        // Ignore localStorage access issues in constrained environments.
      }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);

    const projectName = "Animated Guessing Game";
    const temporaryName = "Temp Workflow Name";

    // 1) Rename project to target mission name.
    await page.locator(".menu-bar-project-name").click();
    await expect(page.getByText("Project Settings")).toBeVisible();

    const nameInput = page.locator(
      ".simple-settings-modal-container input[name='name']"
    );
    await expect(nameInput).toBeVisible();
    await nameInput.fill(projectName);
    await page.getByRole("button", { name: "Apply" }).click();

    await expect(page.locator(".menu-bar-project-name")).toHaveText(projectName);

    // 2) Select brush and change brush size.
    const brushButton = page.locator(
      "#action-button-tooltip-tool-button-brush button"
    );
    await expect(brushButton).toBeVisible();
    await brushButton.click();

    const brushSize = await page.evaluate(() => {
      const editor = (window as any).editor;
      if (!editor) return null;
      editor.setToolSetting?.("brushSize", 18);
      return Number(editor.getToolSetting?.("brushSize") ?? NaN);
    });
    expect(brushSize).toBe(18);

    // 3) Draw one stroke on canvas.
    const canvasWrapper = page.locator("#canvas-container-wrapper");
    await expect(canvasWrapper).toBeVisible();
    const canvasBox = await canvasWrapper.boundingBox();
    expect(canvasBox).not.toBeNull();

    if (canvasBox) {
      const startX = canvasBox.x + canvasBox.width * 0.4;
      const startY = canvasBox.y + canvasBox.height * 0.45;
      const endX = canvasBox.x + canvasBox.width * 0.65;
      const endY = canvasBox.y + canvasBox.height * 0.58;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, endY, { steps: 14 });
      await page.mouse.up();
    }

    await page.waitForTimeout(600);

    // 4) Cache save current state.
    await page.getByRole("button", { name: /^cache save$/i }).first().click();
    await page.waitForTimeout(700);

    // 5) Rename again to prove cache load restores prior state.
    await page.locator(".menu-bar-project-name").click();
    await expect(page.getByText("Project Settings")).toBeVisible();
    await nameInput.fill(temporaryName);
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(page.locator(".menu-bar-project-name")).toHaveText(temporaryName);

    // 6) Cache load and confirm target name is restored.
    await page.getByRole("button", { name: /^cache load$/i }).first().click();
    await expect(page.locator(".menu-bar-project-name")).toHaveText(projectName, {
      timeout: 8000,
    });
  });
});
