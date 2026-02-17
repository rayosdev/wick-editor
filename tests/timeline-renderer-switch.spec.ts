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
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Follow" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Frames" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Wick" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("switches renderer mode, shortcut preset, and timeline prefs then persists", async ({ page }) => {
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

    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Free" })
      .first()
      .click();
    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Markers" })
      .first()
      .click();
    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Standard" })
      .first()
      .click();

    await reloadAndWaitForTimeline(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Flash" }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Free" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Markers" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Standard" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
