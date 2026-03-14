import { expect, test, type Locator, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

function isTransientNavigationError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("net::ERR_ABORTED") ||
    message.includes("net::ERR_CONNECTION_REFUSED") ||
    message.includes("net::ERR_FAILED") ||
    message.includes("rendered no children")
  );
}

async function waitForStoryRoot(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("#storybook-root, #root")
    .first()
    .waitFor({ state: "attached", timeout: 15000 });
}

async function gotoStory(page: Page, storyId: string) {
  const storyUrlPath = `/iframe.html?id=${storyId}&viewMode=story`;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await page.goto(storyUrlPath, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => undefined);
      await waitForStoryRoot(page);
      const rootChildCount = await page.locator("#storybook-root > *, #root > *").count();
      if (rootChildCount === 0) {
        throw new Error("Storybook root rendered no children");
      }
      await dismissWelcomeModalIfPresent(page);
      await expect(page.locator("body")).not.toContainText(/failed to (render|import)\./i);
      return;
    } catch (error) {
      if (!isTransientNavigationError(error) || attempt === 3) {
        throw error;
      }
      await page.waitForTimeout(500 * attempt);
    }
  }
}

async function dismissWelcomeModalIfPresent(page: Page): Promise<void> {
  const acceptButton = page
    .locator(
      "#welcome-modal-accept button, #welcome-modal-mobile-accept button, button:has-text('Try it')"
    )
    .first();
  if ((await acceptButton.count()) === 0) {
    return;
  }

  const visible = await acceptButton.isVisible().catch(() => false);
  if (!visible) {
    return;
  }

  await acceptButton.click({ force: true });
  await page.waitForTimeout(150);
}

async function clickIfVisible(locator: ReturnType<Page["locator"]>): Promise<boolean> {
  const first = locator.first();
  if ((await first.count()) === 0) {
    return false;
  }

  const visible = await first.isVisible().catch(() => false);
  if (!visible) {
    return false;
  }

  try {
    await first.click({ force: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("outside of the viewport")) {
      return false;
    }
    throw error;
  }
  return true;
}

async function firstVisibleLocator(candidates: Locator[]): Promise<Locator | null> {
  for (const candidate of candidates) {
    const first = candidate.first();
    if ((await first.count()) === 0) {
      continue;
    }
    const visible = await first.isVisible().catch(() => false);
    if (visible) {
      return first;
    }
  }

  return null;
}

type ColorSnapshot = {
  normalized: string;
  computed: string;
  r: number;
  g: number;
  b: number;
};

async function getActiveToolName(page: Page): Promise<string> {
  return page.evaluate(() => {
    const editor = (
      window as Window & { editor?: { getActiveTool?: () => unknown } }
    ).editor;
    const activeTool = editor?.getActiveTool?.();
    return typeof activeTool === "string" ? activeTool : "";
  });
}

function isRedLikeColor(color: ColorSnapshot): boolean {
  return color.r > 140 && color.r > color.g && color.r > color.b;
}

async function selectGroupedToolOption(
  page: Page,
  groupKey: "cursors" | "shapes",
  optionName: string,
  optionLabel: string
): Promise<void> {
  if ((await getActiveToolName(page)) === optionName) {
    return;
  }

  const groupAnchor = page.locator(`#desktop-more-${groupKey}-popover-button`).first();
  await expect(groupAnchor).toBeVisible();

  const groupButton = groupAnchor.locator("button").first();
  const menuItem = page
    .locator(".tool-selector-menu-item")
    .filter({ hasText: optionLabel })
    .first();

  await groupButton.click({ force: true });
  if (!(await menuItem.isVisible().catch(() => false))) {
    await page.waitForTimeout(120);
    await groupButton.click({ force: true });
  }

  await expect(menuItem).toBeVisible({ timeout: 3000 });
  await menuItem.click({ force: true });
  await page.waitForTimeout(150);
}

async function readSelectionFillColor(page: Page): Promise<ColorSnapshot> {
  return page.evaluate(() => {
    const editor = (
      window as Window & {
        editor?: { getSelectionAttribute?: (name: string) => unknown };
      }
    ).editor;

    const normalize = (value: unknown, fallback = "#000000"): string => {
      if (typeof value === "string" && value.trim().length > 0) {
        return value;
      }

      if (value && typeof value === "object") {
        const maybeColor = value as {
          toCSS?: (() => string | null | undefined) | undefined;
          rgba?: string | null | undefined;
          hex?: string | null | undefined;
        };

        if (typeof maybeColor.toCSS === "function") {
          const css = maybeColor.toCSS();
          if (typeof css === "string" && css.trim().length > 0) {
            return css;
          }
        }

        if (typeof maybeColor.rgba === "string" && maybeColor.rgba.trim().length > 0) {
          return maybeColor.rgba;
        }

        if (typeof maybeColor.hex === "string" && maybeColor.hex.trim().length > 0) {
          return maybeColor.hex;
        }
      }

      return fallback;
    };

    const toRgbChannels = (cssColor: string) => {
      const probe = document.createElement("div");
      probe.style.color = cssColor;
      document.body.appendChild(probe);
      const computed = getComputedStyle(probe).color;
      probe.remove();

      const match = computed.match(
        /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)/
      );

      return {
        computed,
        r: Number(match?.[1] ?? 0),
        g: Number(match?.[2] ?? 0),
        b: Number(match?.[3] ?? 0),
      };
    };

    const selectionFill = editor?.getSelectionAttribute?.("fillColor");
    const normalized = normalize(selectionFill);
    return {
      normalized,
      ...toRgbChannels(normalized),
    };
  });
}

function trackRuntimeErrors(page: Page) {
  const pageErrors: string[] = [];
  const onPageError = (error: Error) => {
    pageErrors.push(error.message);
  };

  page.on("pageerror", onPageError);

  return {
    assertNone: async () => {
      page.off("pageerror", onPageError);
      expect(pageErrors, `page errors: ${pageErrors.join(" | ")}`).toEqual([]);
    },
  };
}

test.describe("Critical Storybook UI regressions", () => {
  test("Canvas story mounts render surface without runtime errors", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-panels-canvas-canvas--default");

    await expect(page.locator("#canvas-container-wrapper")).toHaveCount(1);
    await expect(page.locator("#canvas-container-wrapper")).toHaveAttribute(
      "aria-label",
      "Canvas"
    );
    await expect(page.locator("#wick-canvas-container")).toHaveCount(1);

    await runtime.assertNone();
  });

  test("Timeline story exposes navigation controls and accepts clicks", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-panels-timeline-timeline--default");

    const timelineContainerCount = await page
      .locator("#animation-timeline-container, #animation-timeline")
      .count();
    const stepForward = page.locator("#timeline-step-forward");
    const stepBackward = page.locator("#timeline-step-backward");
    const timelineControlCount =
      (await stepForward.count()) + (await stepBackward.count());

    expect(timelineContainerCount + timelineControlCount).toBeGreaterThan(0);

    await clickIfVisible(stepForward);
    await clickIfVisible(stepBackward);

    await runtime.assertNone();
  });

  test("Inspector story renders editable fields", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-panels-inspector-inspector--default");

    await expect(page.getByLabel("Inspector Panel")).toBeVisible();
    await expect(page.locator(".inspector-body")).toHaveCount(1);
    await clickIfVisible(page.locator(".inspector-body button, .inspector-body input"));

    await runtime.assertNone();
  });

  test("Toolbox story renders actions menu and tool controls", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-panels-toolbox-toolbox--default");

    const toolboxCount = await page.locator(".tool-box-container").count();
    expect(toolboxCount).toBeGreaterThan(0);
    expect(await page.locator("#more-canvas-actions-popover-button").count()).toBeGreaterThan(0);
    const canvasActionItems = page.locator(".canvas-actions-menu-item");
    expect(await canvasActionItems.count()).toBeGreaterThan(0);
    await clickIfVisible(canvasActionItems);
    const toolboxButtons = page.locator(".toolbox-item button, .toolbox-item [role='button']");
    expect(await toolboxButtons.count()).toBeGreaterThan(0);
    await clickIfVisible(toolboxButtons);

    await runtime.assertNone();
  });

  test("Outliner story supports selecting the first row", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-panels-outliner-outliner--default");

    await expect(page.locator(".outliner")).toHaveCount(1);
    const rowSelectors = page.locator(".outliner-object-selector");
    expect(await rowSelectors.count()).toBeGreaterThan(0);
    await clickIfVisible(rowSelectors);

    await runtime.assertNone();
  });

  test("MobileContainer story switches between key tabs", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-panels-mobilecontainer-mobilecontainer--default");

    await expect(page.locator(".mobile-tabbed-interface.mobile-container")).toHaveCount(1);
    expect(await page.locator("button.mobile-timeline-tab").count()).toBeGreaterThan(0);
    expect(await page.locator("button.mobile-inspector-tab").count()).toBeGreaterThan(0);
    expect(await page.locator("button.mobile-code-tab").count()).toBeGreaterThan(0);
    expect(await page.locator("button.mobile-asset-tab").count()).toBeGreaterThan(0);

    await page.locator("button.mobile-inspector-tab").click();
    await expect(page.getByLabel("Inspector Panel")).toHaveCount(1);

    await page.locator("button.mobile-code-tab").click();
    await expect(page.getByText("No Scriptable")).toHaveCount(1);

    await page.locator("button.mobile-asset-tab").click();
    await expect(page.getByLabel("Asset Library")).toHaveCount(1);

    await runtime.assertNone();
  });

  test("Editor toolbox settings keep legacy compact visuals", async ({ page }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-editor--default");

    const toolboxItems = page.locator(".tool-box .toolbox-item");
    await expect(toolboxItems.first()).toBeVisible();

    const candidateToolIndexes = [3, 4, 5];
    let foundSettingsState = false;

    for (const index of candidateToolIndexes) {
      const count = await toolboxItems.count();
      if (count <= index) {
        continue;
      }

      await toolboxItems.nth(index).click({ force: true });
      await page.waitForTimeout(250);

      const numericCount = await page
        .locator(".tool-box input.settings-numeric-input, .tool-box .settings-numeric-input")
        .count();
      if (numericCount > 0) {
        foundSettingsState = true;
        break;
      }
    }

    expect(foundSettingsState).toBeTruthy();

    await expect(page.locator(".tool-box .wick-input-v2-field")).toHaveCount(0);
    await expect(page.locator(".tool-box #tool-box-fill-color:visible").first()).toBeVisible();
    await expect(
      page.locator(".tool-box #tool-box-stroke-color:visible").first()
    ).toBeVisible();

    await runtime.assertNone();
  });

  test("Editor inspector fill swatch updates selection color without black fallback", async ({
    page,
  }) => {
    const runtime = trackRuntimeErrors(page);
    await page.setViewportSize({ width: 1600, height: 900 });
    await gotoStory(page, "editor-editor--default");

    await page.waitForFunction(
      () => Boolean((window as Window & { editor?: unknown }).editor)
    );

    const canvasWrapper = page.locator("#canvas-container-wrapper");
    await expect(canvasWrapper).toBeVisible();
    const canvasBox = await canvasWrapper.boundingBox();
    expect(canvasBox).not.toBeNull();

    const fillColorCandidates = [
      page.locator("#inspector-selection-fill-color"),
      page.locator("#mobile-inspector-selection-fill-color"),
      page
        .getByLabel("Inspector Panel")
        .getByRole("button", { name: /color picker button/i }),
    ];

    let fillColorButton: Locator | null = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await selectGroupedToolOption(page, "shapes", "rectangle", "Rectangle");

      if (canvasBox) {
        const startX = canvasBox.x + canvasBox.width * (0.32 + attempt * 0.05);
        const startY = canvasBox.y + canvasBox.height * (0.32 + attempt * 0.05);
        const endX = canvasBox.x + canvasBox.width * (0.52 + attempt * 0.04);
        const endY = canvasBox.y + canvasBox.height * (0.52 + attempt * 0.04);

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(endX, endY, { steps: 12 });
        await page.mouse.up();
      }
      await page.waitForTimeout(220);

      await selectGroupedToolOption(page, "cursors", "cursor", "Cursor");
      await page.evaluate(() => {
        const editor = (window as Window & { editor?: { selectAll?: () => void } })
          .editor;
        editor?.selectAll?.();
      });

      fillColorButton = await firstVisibleLocator(fillColorCandidates);
      if (fillColorButton) {
        break;
      }

      await page.waitForTimeout(180);
    }

    expect(fillColorButton).not.toBeNull();
    let pickedColor: ColorSnapshot | null = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      await fillColorButton?.click({ force: true });

      const redSwatch = page.locator('.wick-color-picker-popover [data-color-hex="#ff0000"]:visible').first();
      await expect(redSwatch).toBeVisible({ timeout: 5000 });
      await redSwatch.evaluate((node) => (node as HTMLButtonElement).click());
      await page.waitForTimeout(180);

      pickedColor = await readSelectionFillColor(page);
      if (isRedLikeColor(pickedColor)) {
        break;
      }
    }

	    expect(pickedColor).not.toBeNull();
	    expect(isRedLikeColor(pickedColor!)).toBeTruthy();
	    expect(pickedColor?.computed).not.toBe("rgb(0, 0, 0)");

    await runtime.assertNone();
  });

  test("Editor canvas actions menu keeps full boolean actions visible", async ({
    page,
  }) => {
    const runtime = trackRuntimeErrors(page);
    await gotoStory(page, "editor-editor--default");

    await page
      .locator("#more-canvas-actions-popover-button button")
      .first()
      .click({ force: true });

    await expect(page.getByText("Boolean", { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Unite" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Subtract" }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Intersect" }).first()).toBeVisible();

    await runtime.assertNone();
  });
});
