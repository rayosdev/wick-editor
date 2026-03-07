import { expect, test } from "@playwright/test";

import {
  assertNoCriticalTimelineErrors,
  assertNoTimelineFallback,
  bootTimelineEditor,
  ensureTimelineOptionsOpen,
  prepareTimelineFixture,
  readPlayhead,
  togglePreviewPlayback,
} from "./qa/helpers/timeline.helpers";

test.describe("Timeline DOM playback sync", () => {
  test("playback advances the playhead and the first scrub does not fallback to Classic", async ({
    page,
  }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "playback-follow");

    const playheadBefore = await readPlayhead(page);
    await togglePreviewPlayback(page);

    await page.waitForFunction(
      (initialPlayhead) => {
        const bridge = window as Window & {
          editor?: {
            project?: {
              activeTimeline?: {
                playheadPosition?: number;
              };
            };
            state?: {
              previewPlaying?: boolean;
            };
          };
        };

        const current = Number(bridge.editor?.project?.activeTimeline?.playheadPosition ?? 0);
        return current !== Number(initialPlayhead);
      },
      playheadBefore,
      { timeout: 15000 },
    );

    const playheadAfterTick = await readPlayhead(page);
    expect(playheadAfterTick).not.toBe(playheadBefore);
    await expect(page.locator(".timeline-dom-playhead")).toBeVisible();

    await togglePreviewPlayback(page);
    await page.waitForFunction(() => {
      const bridge = window as Window & {
        editor?: {
          state?: {
            previewPlaying?: boolean;
          };
        };
      };

      return !bridge.editor?.state?.previewPlaying;
    });

    const numberLine = page.locator(".timeline-dom-numberline");
    const numberLineBox = await numberLine.boundingBox();
    expect(numberLineBox).not.toBeNull();
    if (!numberLineBox) {
      throw new Error("Numberline bounds unavailable");
    }

    await page.mouse.move(numberLineBox.x + 40, numberLineBox.y + numberLineBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(numberLineBox.x + 260, numberLineBox.y + numberLineBox.height / 2, {
      steps: 10,
    });
    await page.mouse.up();

    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });

  test("follow/free controls stay reachable through the options panel and update state", async ({
    page,
  }) => {
    await bootTimelineEditor(page);
    await prepareTimelineFixture(page, "playback-follow");
    const root = page.locator("#animation-timeline-container");

    await ensureTimelineOptionsOpen(page);
    await expect(root).toHaveAttribute("data-timeline-options-open", "true");

    const followGroup = page.getByTestId("timeline-follow-mode-group");
    const followOff = followGroup.getByRole("button", { name: "Free" });
    const followOn = followGroup.getByRole("button", { name: "Follow" });

    await followOff.click();
    await expect(followOff).toHaveAttribute("aria-pressed", "true");
    await expect(root).toHaveAttribute("data-timeline-follow-mode", "off");

    await followOn.click();
    await expect(followOn).toHaveAttribute("aria-pressed", "true");
    await expect(root).toHaveAttribute("data-timeline-follow-mode", "follow-playhead");
    await assertNoTimelineFallback(page);
    await assertNoCriticalTimelineErrors(page);
  });
});
