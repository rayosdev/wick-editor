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
    const shortcutPresetToggle = page.getByRole("group", { name: "Timeline shortcut preset" });

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(page.locator("#animation-timeline-container")).toBeVisible();
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Follow" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator(".timeline-shortcut-toggle-button", { hasText: "Frames" }).first(),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(shortcutPresetToggle.getByRole("button", { name: "Wick" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  test("switches renderer mode, shortcut preset, and timeline prefs then persists", async ({ page }) => {
    await bootEditor(page);
    const shortcutPresetToggle = page.getByRole("group", { name: "Timeline shortcut preset" });

    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    await page.evaluate(() => {
      const bridge = window as { editor?: { setTimelineRendererMode?: (mode: string) => void } };
      bridge.editor?.setTimelineRendererMode?.("classic");
    });
    await expect(page.locator('[data-timeline-renderer-mode="classic"]')).toBeVisible();

    await reloadAndWaitForTimeline(page);
    await expect(page.locator('[data-timeline-renderer-mode="classic"]')).toBeVisible();
    await expect(shortcutPresetToggle.getByRole("button", { name: "Wick" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await shortcutPresetToggle
      .getByRole("button", { name: "Flash" })
      .evaluate((button) => (button as HTMLButtonElement).click());
    await expect(shortcutPresetToggle.getByRole("button", { name: "Flash" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await page.evaluate(() => {
      const bridge = window as { editor?: { setTimelineRendererMode?: (mode: string) => void } };
      bridge.editor?.setTimelineRendererMode?.("dom");
    });
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();

    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Free" })
      .first()
      .evaluate((button) => (button as HTMLButtonElement).click());
    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Markers" })
      .first()
      .evaluate((button) => (button as HTMLButtonElement).click());
    await page
      .locator(".timeline-shortcut-toggle-button", { hasText: "Standard" })
      .first()
      .evaluate((button) => (button as HTMLButtonElement).click());

    await reloadAndWaitForTimeline(page);
    await expect(page.locator('[data-timeline-renderer-mode="dom"]')).toBeVisible();
    await expect(shortcutPresetToggle.getByRole("button", { name: "Flash" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
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
