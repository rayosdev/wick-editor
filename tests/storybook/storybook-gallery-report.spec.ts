import { expect, test, type APIRequestContext } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

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

const REPORT_ROOT = path.resolve(process.cwd(), "_report/storybook");
const STORY_REPORT_DIR = path.join(REPORT_ROOT, "stories");
const SCREENSHOT_DIR = path.join(REPORT_ROOT, "screenshots");

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

test("capture all Storybook stories with screenshots and markdown reports", async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(15 * 60 * 1000);

  await fs.rm(REPORT_ROOT, { recursive: true, force: true });
  await fs.mkdir(STORY_REPORT_DIR, { recursive: true });
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });

  const { source, stories } = await fetchStoryEntries(request);
  const summaryRows: string[] = [];
  const failures: string[] = [];

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

    try {
      await page.goto(storyUrlPath, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {
        notes.push("Timed out waiting for full network idle; captured current state.");
      });
      await page.waitForTimeout(350);

      const renderErrorVisible = await page
        .getByText(/failed to (render|import)\./i)
        .first()
        .isVisible()
        .catch(() => false);

      if (renderErrorVisible) {
        status = "FAIL";
        notes.push("Storybook reported a render/import failure in the preview.");
      }

      const rootVisible = await page
        .locator("#storybook-root, #root, body")
        .first()
        .isVisible()
        .catch(() => false);

      if (!rootVisible) {
        notes.push("Could not confirm a visible root container.");
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
    }

    const storyReport = `# ${story.title} / ${story.name}

- Story ID: \`${story.id}\`
- URL: \`${storyUrl}\`
- Status: ${status === "PASS" ? "✅ PASS" : "❌ FAIL"}
- Captured At (UTC): \`${new Date().toISOString()}\`

## Screenshot
![${story.name}](../screenshots/${screenshotFile})

## Notes
${notes.length > 0 ? notes.map((note) => `- ${note}`).join("\n") : "- No issues detected."}
`;

    await fs.writeFile(storyMdAbsPath, storyReport, "utf8");

    summaryRows.push(
      `| ${index + 1} | ${story.title} | ${story.name} | \`${story.id}\` | ${status} | [Report](stories/${storyMdFile}) | [PNG](screenshots/${screenshotFile}) |`
    );

    if (status !== "PASS") {
      failures.push(`${story.id}: ${notes.join(" ")}`);
    }
  }

  const summary = `# Storybook QA Report

- Generated At (UTC): \`${new Date().toISOString()}\`
- Story Index Source: \`${source}\`
- Total Stories: **${stories.length}**
- Passed: **${stories.length - failures.length}**
- Failed: **${failures.length}**

| # | Title | Story | Story ID | Status | Report | Screenshot |
| --- | --- | --- | --- | --- | --- | --- |
${summaryRows.join("\n")}
`;

  await fs.writeFile(path.join(REPORT_ROOT, "README.md"), summary, "utf8");

  expect(stories.length).toBeGreaterThan(0);
  if (process.env.STORYBOOK_REPORT_STRICT === "1") {
    expect(failures, `Storybook failures:\n${failures.join("\n")}`).toEqual([]);
  }
});
