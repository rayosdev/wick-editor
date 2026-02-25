import { expect, test } from "@playwright/test";

test.describe("Export Runtime Player", () => {
  test("loads wickplayer.js and reports missing project.wick gracefully", async ({
    page,
  }) => {
    const playerResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/corelibs/wick-engine/wickplayer.js"),
    );
    const projectResponsePromise = page.waitForResponse((response) =>
      response.url().includes("/corelibs/wick-engine/project.wick"),
    );

    await page.goto("/corelibs/wick-engine/index.html");

    const playerResponse = await playerResponsePromise;
    const projectResponse = await projectResponsePromise;

    expect(playerResponse.status()).toBe(200);
    expect([200, 404]).toContain(projectResponse.status());
    await expect(page.locator("#loading-bar")).toHaveText(
      "Could not load project.wick.",
    );
  });

  test("supports wickfile base64/dataurl roundtrip in player runtime", async ({
    page,
  }) => {
    await page.goto("/corelibs/wick-engine/index.html");

    await page.waitForFunction(
      () => Boolean(window.Wick?.WickFile && window.Wick?.Project),
      undefined,
      { timeout: 10000 },
    );

    const roundtrip = await page.evaluate(async () => {
      const project = new window.Wick.Project();

      const toBase64 = () =>
        new Promise<string>((resolve) => {
          window.Wick.WickFile.toWickFile(
            project,
            (result: unknown) => resolve(String(result ?? "")),
            "base64",
          );
        });

      const fromInput = (input: string, format?: string) =>
        new Promise<{ isProject: boolean; hasRoot: boolean }>((resolve) => {
          window.Wick.WickFile.fromWickFile(
            input,
            (loaded: unknown) => {
              const loadedProject = loaded as { root?: unknown } | null;
              const ProjectClass = window.Wick.Project as new (
                ...args: never[]
              ) => unknown;
              resolve({
                isProject:
                  !!loaded && loaded instanceof ProjectClass,
                hasRoot: !!(loadedProject && loadedProject.root),
              });
            },
            format,
          );
        });

      const base64 = await toBase64();
      const dataUrl = `data:application/json;base64,${base64}`;

      const fromRaw = await fromInput(base64, "base64");
      const fromRawNoHint = await fromInput(base64);
      const fromDataUrl = await fromInput(dataUrl);

      return {
        base64Length: base64.length,
        fromRaw,
        fromRawNoHint,
        fromDataUrl,
      };
    });

    expect(roundtrip.base64Length).toBeGreaterThan(0);
    expect(roundtrip.fromRaw.isProject).toBe(true);
    expect(roundtrip.fromRaw.hasRoot).toBe(true);
    expect(roundtrip.fromRawNoHint.isProject).toBe(true);
    expect(roundtrip.fromRawNoHint.hasRoot).toBe(true);
    expect(roundtrip.fromDataUrl.isProject).toBe(true);
    expect(roundtrip.fromDataUrl.hasRoot).toBe(true);
  });
});
