import { expect, test } from "@playwright/test";

test.describe("Active Tool Regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.setItem("skipWelcomeMessage", "true");
      } catch {}
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1500);
  });

  test("selecting Brush updates active tool and exposes settings", async ({
    page,
  }) => {
    const getActiveTool = () =>
      page.evaluate(() => (window as any).editor?.getActiveTool?.());

    await expect
      .poll(getActiveTool, {
        message: "Editor should initialize with the cursor tool active",
      })
      .toBe("cursor");

    const brushButton = page.locator(
      "#action-button-tooltip-tool-button-brush button"
    );
    await expect(brushButton).toBeVisible();
    await brushButton.click();

    await expect
      .poll(getActiveTool, {
        message: "Brush should become active after selecting it from Toolbox",
      })
      .toBe("brush");

    const sizeInput = page
      .locator("#settings-panel-container input.settings-numeric-input")
      .first();
    await expect(sizeInput).toBeVisible();
    await sizeInput.fill("25");
    await page.keyboard.press("Enter");
    await expect(sizeInput).toHaveValue("25");

    const pencilButton = page.locator(
      "#action-button-tooltip-tool-button-pencil button"
    );
    await expect(pencilButton).toBeVisible();
    await pencilButton.click();

    await expect
      .poll(getActiveTool, {
        message: "Pencil should become active after selecting it from Toolbox",
      })
      .toBe("pencil");
  });
});
