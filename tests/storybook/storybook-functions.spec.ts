import { expect, test, type Page } from "@playwright/test";

test.describe.configure({ mode: "serial" });

async function waitForStorybookCanvas(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page
    .locator("#storybook-root, #root")
    .first()
    .waitFor({ state: "visible", timeout: 15000 });
  await page.waitForTimeout(150);
}

async function gotoStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`, {
    waitUntil: "domcontentloaded",
  });
  await waitForStorybookCanvas(page);
  await expect(page.locator("#storybook-root, #root").first()).toBeVisible({
    timeout: 15000,
  });
  await expect(page.locator("body")).not.toContainText(
    /failed to (render|import)\./i
  );
}

test.describe("Storybook functional checks", () => {
  test("can search and open a component story from the sidebar", async ({ page }) => {
    await page.goto("/");

    const search = page.getByRole("searchbox", {
      name: /search for components/i,
    });
    await expect(search).toBeVisible();

    await search.fill("WickTextInput");
    const storyOption = page.getByRole("option", {
      name: /WickTextInput/,
    });
    await expect(storyOption).toBeVisible();

    await storyOption.click();
    await expect(page).toHaveURL(/wicktextinput--default/);
  });

  test("WickTextInput updates state and validates numeric-only mode", async ({
    page,
  }) => {
    await gotoStory(
      page,
      "editor-util-wickinput-wicktextinput-wicktextinput--default"
    );

    const standardInput = page.getByLabel("Wick text input");
    await standardInput.fill("Story test value");
    await expect(page.getByTestId("wick-text-input-value")).toContainText(
      "Story test value"
    );

    await gotoStory(
      page,
      "editor-util-wickinput-wicktextinput-wicktextinput--digits-only"
    );

    const numericInput = page.getByLabel("Digits only input");
    await numericInput.fill("42a");
    await expect(page.getByTestId("wick-text-input-digits-value")).toContainText(
      "Current: 42"
    );
    await expect(numericInput).toHaveClass(/invalid/);

    await numericInput.fill("420");
    await expect(page.getByTestId("wick-text-input-digits-value")).toContainText(
      "Current: 420"
    );
    await expect(numericInput).toHaveClass(/valid/);
  });

  test("WickInputV2 composite form updates field state", async ({ page }) => {
    await gotoStory(page, "editor-util-wickinputv2-wickinputv2--composite-form");

    await page.getByLabel("Project Name").fill("Storyboard QA");
    await page.getByLabel("Frame Rate").fill("30");
    await page.getByLabel("Renderer").selectOption("gpu");
    await page.getByLabel("Lock Camera In Preview").check();
    await page.getByLabel("Accent Color").fill("#ff3366");
    await page.getByRole("button", { name: "Apply Preset" }).click();

    const summary = page.getByTestId("wick-input-v2-summary");
    await expect(summary).toContainText("Project: Storyboard QA");
    await expect(summary).toContainText("FPS: 30");
    await expect(summary).toContainText("Renderer: gpu");
    await expect(summary).toContainText("Locked: yes");
    await expect(summary).toContainText("Accent: #ff3366");
    await expect(summary).toContainText("Applied: 1");
  });

  test("WickInputV2 legacy adapter preserves WickInput-style behavior", async ({
    page,
  }) => {
    await gotoStory(
      page,
      "editor-util-wickinputv2-wickinputv2legacyadapter--legacy-parity-form"
    );

    await page.getByLabel("Project Name").fill("Legacy QA");
    await page.getByLabel("Frame Rate").fill("30");
    await page.getByLabel("Renderer").selectOption({ label: "WebGL" });
    await page.getByLabel("Loop Playback").check();
    await page.getByLabel("Accent").fill("#ff7711");
    await page.getByRole("button", { name: "Apply Legacy Preset" }).click();

    const summary = page.getByTestId("wick-input-v2-legacy-summary");
    await expect(summary).toContainText("Name: Legacy QA");
    await expect(summary).toContainText("FPS: 30");
    await expect(summary).toContainText("Renderer: gpu");
    await expect(summary).toContainText("Loop: yes");
    await expect(summary).toContainText("Accent: #ff7711");
    await expect(summary).toContainText("Applied: 1");
  });

  test("TabbedInterface switches tabs and updates selected state", async ({
    page,
  }) => {
    await gotoStory(page, "editor-util-tabbedinterface-tabbedinterface--default");

    await expect(page.getByTestId("selected-tab")).toContainText(
      "Selected: Draw"
    );
    await page.getByRole("button", { name: "Animate" }).click();
    await expect(page.getByTestId("selected-tab")).toContainText(
      "Selected: Animate"
    );
    await expect(page.getByTestId("tab-panel-animate")).toContainText(
      "Animate panel content"
    );
  });

  test("WickButton supports single and double click actions", async ({
    page,
  }) => {
    await gotoStory(page, "editor-util-wickinput-wickbutton-wickbutton--default");

    const primaryCount = page.getByTestId("wick-button-primary");
    const secondaryCount = page.getByTestId("wick-button-secondary");
    const button = page.getByRole("button", { name: "Trigger" });

    await button.click();
    await expect(primaryCount).toHaveText("Primary: 1");
    await expect(secondaryCount).toHaveText("Secondary: 0");

    await page.waitForTimeout(600);
    await button.dblclick();
    await expect(primaryCount).toHaveText("Primary: 2");
    await expect(secondaryCount).toHaveText("Secondary: 1");
  });
});

test.describe("Storybook matrix checks (Modals, Panels, PopOuts)", () => {
  test("WickModal opens and closes", async ({ page }) => {
    await gotoStory(page, "editor-modals-wickmodal-wickmodal--default");

    const modalState = page.getByTestId("wick-modal-state");
    await expect(modalState).toContainText("State: Closed");

    await page.getByRole("button", { name: "Open Modal" }).click();
    await expect(modalState).toContainText("State: Open");
    await expect(page.getByTestId("wick-modal-content")).toBeVisible();

    await page.getByRole("button", { name: "Close Modal" }).click();
    await expect(modalState).toContainText("State: Closed");
    await expect(page.getByTestId("wick-modal-content")).toHaveCount(0);
  });

  test("OutlinerExpandButton toggles collapsed state", async ({ page }) => {
    await gotoStory(
      page,
      "editor-panels-outlinerexpandbutton-outlinerexpandbutton--default"
    );

    const state = page.getByTestId("outliner-expanded-state");
    await expect(state).toContainText("State: Expanded");

    await page.locator("button.outliner-expand-button").click();
    await expect(state).toContainText("State: Collapsed");
  });

  test("MenuBarButton triggers click action", async ({ page }) => {
    await gotoStory(
      page,
      "editor-panels-menubar-menubarbutton-menubarbutton--default"
    );

    const clickCount = page.getByTestId("menu-bar-button-count");
    await expect(clickCount).toContainText("Clicks: 0");

    await page.getByRole("button", { name: "File" }).click();
    await page.getByRole("button", { name: "File" }).click();
    await expect(clickCount).toContainText("Clicks: 2");
  });

  test("AddScriptPanel switches tabs and tracks selected script", async ({
    page,
  }) => {
    await gotoStory(
      page,
      "editor-popouts-wickcodeeditor-addscriptpanel-addscriptpanel--default"
    );

    await expect(page.getByTestId("add-script-active-tab")).toContainText(
      "Tab: Mouse"
    );

    await page.getByRole("button", { name: "Keyboard" }).click();
    await expect(page.getByTestId("add-script-active-tab")).toContainText(
      "Tab: Keyboard"
    );

    await page.getByRole("button", { name: "Keydown" }).click();
    await expect(page.getByTestId("add-script-last-script")).toContainText(
      "Last Script: keydown"
    );
  });

  test("ConsolePanel adds and clears logs", async ({ page }) => {
    await gotoStory(page, "editor-popouts-wickcodeeditor-consolepanel--default");

    const count = page.getByTestId("console-log-count");
    await expect(count).toContainText("Count: 0");
    await expect(page.getByText("Console output will appear here")).toBeVisible();

    await page.getByRole("button", { name: "Add Log" }).click();
    await page.getByRole("button", { name: "Add Log" }).click();
    await expect(count).toContainText("Count: 2");

    await page.getByRole("button", { name: "Clear Logs" }).click();
    await expect(count).toContainText("Count: 0");
    await expect(page.getByText("Console output will appear here")).toBeVisible();
  });
});
