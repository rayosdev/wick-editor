import { test, expect, type Page } from "@playwright/test";

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

const reloadAndWaitForTimeline = async (page: Page): Promise<void> => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#animation-timeline-container").waitFor({
    state: "visible",
    timeout: 30000,
  });
};

test.describe("Timeline renderer switch", () => {
  test("default renderer is DOM and shortcut preset is Wick", async ({ page }) => {
    await bootEditor(page);

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(page.locator("#animation-timeline-container")).toBeVisible();
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Wick" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("switches renderer mode and preset, then persists across reload", async ({ page }) => {
    await bootEditor(page);

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    await page
      .locator(".timeline-renderer-toggle-button", { hasText: "Classic" })
      .click();
    await expect(page.locator('[data-timeline-renderer-mode="classic"]')).toBeVisible();

    await reloadAndWaitForTimeline(page);
    await expect(page.locator('[data-timeline-renderer-mode="classic"]')).toBeVisible();
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Wick" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Flash" })
      .click();
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Flash" }),
    ).toHaveAttribute("aria-pressed", "true");

    await page
      .locator(".timeline-renderer-toggle-button", { hasText: "DOM" })
      .click();
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    await reloadAndWaitForTimeline(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Flash" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
