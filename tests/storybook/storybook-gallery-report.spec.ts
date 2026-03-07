import {
  expect,
  test,
  type APIRequestContext,
  type ConsoleMessage,
  type Page,
} from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { spawn, type ChildProcess } from "node:child_process";

type StoryEntry = {
  id: string;
  title: string;
  name: string;
  type: string;
};

type StoryIndexPayload = {
  entries?: Record<string, StoryEntry>;
  stories?: Record<string, StoryEntry>;
};

type InteractionResult = {
  action: string;
  status: "PASS" | "SKIP" | "FAIL";
  detail: string;
};

const REPORT_ROOT = path.resolve(process.cwd(), "_report/storybook");
const STORY_REPORT_DIR = path.join(REPORT_ROOT, "stories");
const SCREENSHOT_DIR = path.join(REPORT_ROOT, "screenshots");
const FAILURE_REPORT_PATH = path.join(REPORT_ROOT, "FAILURES.md");
const storybookHost = process.env.PW_STORYBOOK_HOST || "127.0.0.1";
const storybookPort = Number(process.env.PW_STORYBOOK_PORT ?? "6006");
const staticModeEnabled = process.env.PW_STORYBOOK_STATIC === "1";

let fallbackStaticServer: ChildProcess | null = null;

async function isStorybookReachable(request: APIRequestContext): Promise<boolean> {
  try {
    const response = await request.get("/index.json", { timeout: 2500 });
    return response.ok();
  } catch {
    return false;
  }
}

async function waitForStorybookReachable(
  request: APIRequestContext,
  timeoutMs = 12000
): Promise<boolean> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isStorybookReachable(request)) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  return false;
}

async function recoverStorybookServerIfNeeded(
  request: APIRequestContext,
  notes: string[]
): Promise<void> {
  if (await isStorybookReachable(request)) {
    return;
  }

  if (!staticModeEnabled) {
    notes.push("Storybook server is unreachable and static fallback is disabled.");
    return;
  }

  if (!fallbackStaticServer || fallbackStaticServer.exitCode !== null) {
    fallbackStaticServer = spawn(
      "python3",
      [
        "-m",
        "http.server",
        `${storybookPort}`,
        "--bind",
        storybookHost,
        "--directory",
        "storybook-static",
      ],
      { stdio: "ignore" }
    );
    notes.push("Started fallback static Storybook server after connection drop.");
  }

  const reachable = await waitForStorybookReachable(request);
  if (!reachable) {
    throw new Error("Storybook server remained unreachable after fallback startup.");
  }
}

function sanitizeFilePart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
}

function compactText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function uniqueTop(values: string[], limit = 4): string[] {
  const seen = new Set<string>();
  const list: string[] = [];

  for (const value of values) {
    if (!value || seen.has(value)) continue;
    seen.add(value);
    list.push(value);
    if (list.length >= limit) break;
  }

  return list;
}

function formatList(items: string[]): string {
  return items.length > 0 ? items.map((item) => `- ${item}`).join("\n") : "- None";
}

function isTransientNavigationError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("net::ERR_ABORTED") ||
    message.includes("net::ERR_CONNECTION_REFUSED") ||
    message.includes("net::ERR_FAILED")
  );
}

async function gotoStoryFrameWithRetry(
  page: Page,
  request: APIRequestContext,
  storyUrlPath: string,
  notes: string[]
): Promise<void> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await recoverStorybookServerIfNeeded(request, notes);
      await page.goto(storyUrlPath, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
        notes.push("Timed out waiting for full network idle; captured current state.");
      });
      await page.waitForTimeout(350);
      return;
    } catch (error) {
      if (!isTransientNavigationError(error) || attempt === maxAttempts) {
        throw error;
      }

      notes.push(
        `Retrying story navigation after transient error (attempt ${attempt}/${maxAttempts}).`
      );
      if (
        (error instanceof Error && error.message.includes("net::ERR_CONNECTION_REFUSED")) ||
        String(error).includes("net::ERR_CONNECTION_REFUSED")
      ) {
        await recoverStorybookServerIfNeeded(request, notes).catch(
          (recoveryError: unknown) => {
            const message =
              recoveryError instanceof Error
                ? recoveryError.message
                : String(recoveryError);
            notes.push(`Server recovery attempt failed: ${truncate(message, 180)}`);
          }
        );
      }
      await page.waitForTimeout(400 * attempt);
    }
  }
}

async function runInteractionSmokeChecks(page: Page) {
  const results: InteractionResult[] = [];

  const firstButton = page.locator("button:visible, [role='button']:visible").first();
  if ((await firstButton.count()) > 0) {
    try {
      await firstButton.click({ timeout: 1500 });
      results.push({
        action: "Click first button",
        status: "PASS",
        detail: "Clicked a visible button-like element.",
      });
    } catch (error) {
      results.push({
        action: "Click first button",
        status: "FAIL",
        detail: truncate(
          error instanceof Error ? error.message : String(error),
          180
        ),
      });
    }
  } else {
    results.push({
      action: "Click first button",
      status: "SKIP",
      detail: "No visible button found.",
    });
  }

  const firstTextField = page
    .locator(
      "input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([type='file']):not([type='image']):not([type='button']):not([type='submit']):not([type='reset']):not([type='color']):not([type='range']):not([readonly]):not([disabled]), textarea:not([readonly]):not([disabled])"
    )
    .first();

  if ((await firstTextField.count()) > 0) {
    try {
      const descriptor = await firstTextField.evaluate((el) => {
        const input = el as HTMLInputElement | HTMLTextAreaElement;
        const tag = input.tagName.toLowerCase();
        const type = (input as HTMLInputElement).type || "text";
        return `${tag}:${type}`;
      });
      const smokeValue = descriptor.endsWith(":number") ? "7" : "qa-smoke";
      await firstTextField.fill(smokeValue, { timeout: 1500 });
      results.push({
        action: "Type into first text field",
        status: "PASS",
        detail: `Filled ${descriptor} with "${smokeValue}".`,
      });
    } catch (error) {
      results.push({
        action: "Type into first text field",
        status: "FAIL",
        detail: truncate(
          error instanceof Error ? error.message : String(error),
          180
        ),
      });
    }
  } else {
    results.push({
      action: "Type into first text field",
      status: "SKIP",
      detail: "No editable text field found.",
    });
  }

  const firstCheckbox = page.locator("input[type='checkbox']:not([disabled])").first();
  if ((await firstCheckbox.count()) > 0) {
    try {
      const before = await firstCheckbox.isChecked();
      await firstCheckbox.click({ timeout: 1500, force: true });
      const after = await firstCheckbox.isChecked().catch(() => before);
      results.push({
        action: "Toggle first checkbox",
        status: after !== before ? "PASS" : "SKIP",
        detail:
          after !== before
            ? `Checkbox changed from ${before} to ${after}.`
            : "Checkbox state did not change after click (likely controlled by story state).",
      });
    } catch (error) {
      results.push({
        action: "Toggle first checkbox",
        status: "FAIL",
        detail: truncate(
          error instanceof Error ? error.message : String(error),
          180
        ),
      });
    }
  } else {
    results.push({
      action: "Toggle first checkbox",
      status: "SKIP",
      detail: "No enabled checkbox found.",
    });
  }

  const firstSelect = page.locator("select:not([disabled])").first();
  if ((await firstSelect.count()) > 0) {
    try {
      const optionValues = await firstSelect
        .locator("option")
        .evaluateAll((options) =>
          options
            .map((option) => ({
              value: (option as HTMLOptionElement).value,
              disabled: (option as HTMLOptionElement).disabled,
            }))
            .filter((option) => !option.disabled)
            .map((option) => option.value)
        );

      if (optionValues.length < 2) {
        results.push({
          action: "Select alternate option",
          status: "SKIP",
          detail: "Select has fewer than two enabled options.",
        });
      } else {
        const selectedValue = optionValues[1] ?? optionValues[0];
        if (selectedValue === undefined) {
          results.push({
            action: "Select alternate option",
            status: "SKIP",
            detail: "No selectable value resolved.",
          });
        } else {
          await firstSelect.selectOption(selectedValue, { timeout: 1500 });
          results.push({
            action: "Select alternate option",
            status: "PASS",
            detail: `Selected option value "${selectedValue}".`,
          });
        }
      }
    } catch (error) {
      results.push({
        action: "Select alternate option",
        status: "FAIL",
        detail: truncate(
          error instanceof Error ? error.message : String(error),
          180
        ),
      });
    }
  } else {
    results.push({
      action: "Select alternate option",
      status: "SKIP",
      detail: "No enabled select element found.",
    });
  }

  return results;
}

async function fetchStoryEntries(
  request: APIRequestContext
): Promise<{ source: string; stories: StoryEntry[] }> {
  const candidates = ["/index.json", "/stories.json"];
  let lastError = "No index endpoint attempted.";

  for (const endpoint of candidates) {
    const response = await request.get(endpoint);
    if (!response.ok()) {
      lastError = `${endpoint} -> HTTP ${response.status()}`;
      continue;
    }

    const payload = (await response.json()) as StoryIndexPayload;
    const rawEntries = payload.entries ?? payload.stories ?? {};
    const stories = Object.values(rawEntries)
      .filter((entry) => entry.type === "story")
      .sort((a, b) => {
        const titleCmp = a.title.localeCompare(b.title);
        if (titleCmp !== 0) return titleCmp;
        return a.name.localeCompare(b.name);
      });

    if (stories.length === 0) {
      lastError = `${endpoint} -> found no story entries`;
      continue;
    }

    return { source: endpoint, stories };
  }

  throw new Error(`Unable to load Storybook story index. Last error: ${lastError}`);
}

test.describe.configure({ mode: "serial" });

test.afterAll(async () => {
  if (fallbackStaticServer && fallbackStaticServer.exitCode === null) {
    fallbackStaticServer.kill("SIGTERM");
  }
  fallbackStaticServer = null;
});

test("capture all Storybook stories with screenshots and markdown reports", async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(15 * 60 * 1000);

  await fs.mkdir(REPORT_ROOT, { recursive: true });
  await Promise.all([
    fs.rm(STORY_REPORT_DIR, { recursive: true, force: true }),
    fs.rm(SCREENSHOT_DIR, { recursive: true, force: true }),
    fs.rm(FAILURE_REPORT_PATH, { force: true }),
    fs.rm(path.join(REPORT_ROOT, "README.md"), { force: true }),
  ]);
  await fs.mkdir(STORY_REPORT_DIR, { recursive: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  const { source, stories: allStories } = await fetchStoryEntries(request);
  const filterPattern = process.env.STORYBOOK_REPORT_FILTER?.trim();
  const limit = Number(process.env.STORYBOOK_REPORT_LIMIT ?? "0");
  let filterRegex: RegExp | null = null;
  if (filterPattern && filterPattern.length > 0) {
    filterRegex = new RegExp(filterPattern, "i");
  }
  const filteredStories =
    filterRegex
      ? allStories.filter((story) => {
          return (
            filterRegex!.test(story.id) ||
            filterRegex!.test(story.title) ||
            filterRegex!.test(story.name)
          );
        })
      : allStories;
  const stories =
    Number.isFinite(limit) && limit > 0
      ? filteredStories.slice(0, limit)
      : filteredStories;
  const summaryRows: string[] = [];
  const failures: Array<{
    id: string;
    title: string;
    name: string;
    notes: string[];
    reportFile: string;
    screenshotFile: string;
  }> = [];

  for (const [index, story] of stories.entries()) {
    const storyHash = createHash("sha1")
      .update(`${story.title}|${story.name}|${story.id}`)
      .digest("hex")
      .slice(0, 10);
    const shortId = sanitizeFilePart(story.id).slice(0, 70) || "story";
    const fileStem = `${shortId}-${storyHash}`;
    const screenshotFile = `${fileStem}.png`;
    const storyMdFile = `${fileStem}.md`;
    const screenshotAbsPath = path.join(SCREENSHOT_DIR, screenshotFile);
    const storyMdAbsPath = path.join(STORY_REPORT_DIR, storyMdFile);

    const storyUrlPath = `/iframe.html?id=${story.id}&viewMode=story`;
    const storyUrl = `${baseURL ?? ""}${storyUrlPath}`;

    let status = "PASS";
    const notes: string[] = [];
    const consoleMessages: string[] = [];
    const pageErrors: string[] = [];
    let interactionResults: InteractionResult[] = [];

    const onConsole = (message: ConsoleMessage) => {
      const kind = message.type();
      if (kind !== "error" && kind !== "warning") return;
      const text = compactText(message.text());
      if (!text) return;
      consoleMessages.push(`[${kind}] ${truncate(text, 240)}`);
    };

    const onPageError = (error: Error) => {
      const message = compactText(error.message ?? String(error));
      if (!message) return;
      pageErrors.push(truncate(message, 240));
    };

    try {
      page.on("console", onConsole);
      page.on("pageerror", onPageError);

      await gotoStoryFrameWithRetry(page, request, storyUrlPath, notes);

      let renderErrorVisible = await page
        .getByText(/failed to (render|import)\./i)
        .first()
        .isVisible()
        .catch(() => false);
      let previewErrorText = compactText(
        (await page.locator("body").innerText().catch(() => "")) ?? ""
      );

      const hasTransientImportError =
        previewErrorText.includes("Failed to fetch dynamically imported module") ||
        previewErrorText.includes("Loading chunk") ||
        previewErrorText.includes("Could not fetch dynamically imported module");

      if (renderErrorVisible && hasTransientImportError) {
        notes.push("Retrying story once after transient dynamic-import error.");
        consoleMessages.length = 0;
        pageErrors.length = 0;
        await gotoStoryFrameWithRetry(page, request, storyUrlPath, notes);

        renderErrorVisible = await page
          .getByText(/failed to (render|import)\./i)
          .first()
          .isVisible()
          .catch(() => false);
        previewErrorText = compactText(
          (await page.locator("body").innerText().catch(() => "")) ?? ""
        );
      }

      if (renderErrorVisible) {
        status = "FAIL";
        notes.push("Storybook reported a render/import failure in the preview.");
        if (previewErrorText) {
          notes.push(`Preview excerpt: ${truncate(previewErrorText, 320)}`);
        }
      }

      const rootVisible = await page
        .locator("#storybook-root, #root, body")
        .first()
        .isVisible()
        .catch(() => false);

      if (!rootVisible) {
        notes.push("Could not confirm a visible root container.");
      }

      interactionResults = await runInteractionSmokeChecks(page);
      const interactionFailures = interactionResults.filter(
        (result) => result.status === "FAIL"
      );
      if (interactionFailures.length > 0) {
        notes.push(
          `Interaction checks reported ${interactionFailures.length} failure(s); see interaction section.`
        );
      }

      const topPageErrors = uniqueTop(pageErrors);
      if (topPageErrors.length > 0) {
        status = "FAIL";
        notes.push(
          `Page errors detected (${pageErrors.length}): ${topPageErrors.join(" | ")}`
        );
      }

      const topConsole = uniqueTop(consoleMessages);
      if (topConsole.length > 0) {
        notes.push(
          `Console warnings/errors (${consoleMessages.length}): ${topConsole.join(" | ")}`
        );
      }

      await page.screenshot({ path: screenshotAbsPath, fullPage: true });
    } catch (error) {
      status = "FAIL";
      notes.push(
        `Unhandled exception: ${truncate(
          error instanceof Error ? error.message : String(error),
          220
        )}`
      );

      await page.screenshot({ path: screenshotAbsPath, fullPage: true }).catch(() => {
        notes.push("Screenshot capture failed after exception.");
      });
    } finally {
      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    }

    const storyReport = `# ${story.title} / ${story.name}

- Story ID: \`${story.id}\`
- URL: \`${storyUrl}\`
- Status: ${status === "PASS" ? "✅ PASS" : "❌ FAIL"}
- Captured At (UTC): \`${new Date().toISOString()}\`

## Screenshot
![${story.name}](../screenshots/${screenshotFile})

## Interaction Smoke Checks
${
  interactionResults.length > 0
    ? interactionResults
        .map(
          (result) => `- ${result.status} | ${result.action}: ${result.detail}`
        )
        .join("\n")
    : "- No interaction checks executed."
}

## Page Errors
${formatList(uniqueTop(pageErrors, 8))}

## Console Warnings/Errors
${formatList(uniqueTop(consoleMessages, 8))}

## Notes
${notes.length > 0 ? notes.map((note) => `- ${note}`).join("\n") : "- No issues detected."}
`;

    await fs.writeFile(storyMdAbsPath, storyReport, "utf8");

    summaryRows.push(
      `| ${index + 1} | ${story.title} | ${story.name} | \`${story.id}\` | ${status} | ${interactionResults.filter((result) => result.status === "PASS").length}/${interactionResults.length} | [Report](stories/${storyMdFile}) | [PNG](screenshots/${screenshotFile}) |`
    );

    if (status !== "PASS") {
      failures.push({
        id: story.id,
        title: story.title,
        name: story.name,
        notes: notes.length > 0 ? notes : ["No notes captured."],
        reportFile: storyMdFile,
        screenshotFile,
      });
    }
  }

  const failureReport = `# Storybook Failures

- Generated At (UTC): \`${new Date().toISOString()}\`
- Failed Stories: **${failures.length}**

${failures.length === 0
    ? "No failing stories detected."
    : failures
        .map(
          (failure, idx) => `## ${idx + 1}. ${failure.title} / ${failure.name}

- Story ID: \`${failure.id}\`
- Notes:
${failure.notes.map((note) => `  - ${note}`).join("\n")}
- Report: [stories/${failure.reportFile}](stories/${failure.reportFile})
- Screenshot: [screenshots/${failure.screenshotFile}](screenshots/${failure.screenshotFile})
`
        )
        .join("\n")}
`;

  const summary = `# Storybook QA Report

- Generated At (UTC): \`${new Date().toISOString()}\`
- Story Index Source: \`${source}\`
- Total Stories: **${stories.length}**
- Passed: **${stories.length - failures.length}**
- Failed: **${failures.length}**
- Failure Details: [FAILURES.md](FAILURES.md)

| # | Title | Story | Story ID | Status | Interactions | Report | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
${summaryRows.join("\n")}
`;

  await fs.writeFile(FAILURE_REPORT_PATH, failureReport, "utf8");
  await fs.writeFile(path.join(REPORT_ROOT, "README.md"), summary, "utf8");

  expect(stories.length).toBeGreaterThan(0);
  if (process.env.STORYBOOK_REPORT_STRICT === "1") {
    expect(
      failures,
      `Storybook failures:\n${failures
        .map((failure) => `${failure.id}: ${failure.notes.join(" ")}`)
        .join("\n")}`
    ).toEqual([]);
  }
});
