import { expect, test, type Page } from "@playwright/test";

const bootEditor = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem("skipWelcomeMessage", "true");
    } catch {}
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("#animation-timeline-container").waitFor({
    state: "visible",
    timeout: 30000,
  });
};

test.describe("Tooltip hover delay", () => {
  test("desktop tooltip only appears after 650ms hover", async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name.includes("mobile") ||
        testInfo.project.name.includes("tablet") ||
        testInfo.project.name === "webkit",
      "Desktop hover behavior only",
    );

    await bootEditor(page);

    const anchor = page.locator("#action-button-tooltip-canvas-transform-button-zoomout-anchor");
    await anchor.waitFor({ state: "visible", timeout: 30000 });

    const tooltip = page.locator(".wick-tooltip", { hasText: "Zoom Out" });
    const box = await anchor.boundingBox();
    if (!box) {
      throw new Error("Missing zoom out anchor bounds");
    }

    await page.mouse.move(1, 1);
    await expect(tooltip).toBeHidden();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

    await page.waitForTimeout(120);
    await expect(tooltip).toBeHidden();

    await page.waitForTimeout(700);
    await expect(tooltip).toBeVisible();
  });
});
