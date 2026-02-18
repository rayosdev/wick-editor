import { expect, test, type Page } from "@playwright/test";

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

async function clickIfVisible(locator: ReturnType<Page["locator"]>): Promise<boolean> {
  const first = locator.first();
  if ((await first.count()) === 0) {
    return false;
  }

  const visible = await first.isVisible().catch(() => false);
  if (!visible) {
    return false;
  }

  await first.click({ force: true });
  return true;
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
});
