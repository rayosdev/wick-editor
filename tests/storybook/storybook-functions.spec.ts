import { expect, test, type Page } from "@playwright/test";

async function gotoStory(page: Page, storyId: string) {
  await page.goto(`/iframe.html?id=${storyId}&viewMode=story`);
  await expect(page.getByText(/failed to (render|import)\./i)).toHaveCount(0);
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
