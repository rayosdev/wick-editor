import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

const authoredRoots = ["src", "scripts", "tests", "engine/src"] as const;
const authoredAllowlist = new Set([
  path.normalize("engine/src/export/zip/preloadjs.min.js"),
  path.normalize("engine/src/export/zip/wickengine.js"),
]);

const tsHygieneRoots = ["src", "tests", "types"] as const;
const tsAppHygieneRoots = ["src"] as const;
const tsTestsHygieneRoots = ["tests"] as const;
const tsHygieneSelfFile = path.normalize("tests/typescript-everywhere.test.ts");
const tsSuppressionAllowlist = new Set([
  path.normalize("src/Editor/Editor.tsx"),
]);
const doubleUnknownCastAllowlist = new Set<string>([]);
const tsExpectErrorAllowlist = new Set<string>([]);
const jsonParseReturnTypeAllowlist = new Set([
  path.normalize("types/globals.d.ts"),
]);
const singleUnknownCastAllowlist = new Set<string>([]);

const explicitAnyPattern = /(:\s*any\b|<any\b|as any\b|\bany\[\])/;
const tsIgnorePattern = /@ts-ignore\b/;
const tsNocheckPattern = /@ts-nocheck\b/;
const tsExpectErrorPattern = /@ts-expect-error\b/;
const doubleUnknownCastPattern = /\bas unknown as\b/;
const singleUnknownCastPattern = /\bas unknown\b/;
const jsonParseReturnTypePattern = /\bReturnType<typeof JSON\.parse>\b/;
const directWindowEditorAccessPattern = /\bwindow\.editor\.[A-Za-z_$]/;
const windowEditorReferencePattern = /\bwindow\.editor\b/;
const directWindowWickAccessPattern = /\bwindow\.Wick\.[A-Za-z_$]/;
const windowWickReferencePattern = /\bwindow\.Wick\b/;
const windowProjectReferencePattern = /\bwindow\.project\b/;
const windowPaperReferencePattern = /\bwindow\.paper\b/;
const adhocWindowWickCastPattern = /\bwindow\.Wick\s+as\s+\{/;
const windowWickCastPattern = /\bwindow\.Wick\s+as\b/;
const unknownStringIndexSignaturePattern =
  /\[\s*key\s*:\s*string\s*\]\s*:\s*unknown\s*;/;
const FILE_SCAN_TEST_TIMEOUT_MS = 20_000;

function collectFiles(rootDir: string): string[] {
  if (!fs.existsSync(rootDir)) return [];

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolute = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(absolute));
      continue;
    }
    files.push(absolute);
  }

  return files;
}

function toRepoRelative(absolutePath: string): string {
  return path.normalize(path.relative(repoRoot, absolutePath));
}

function collectTypeScriptFiles(roots: readonly string[]): string[] {
  return roots
    .flatMap((root) => collectFiles(path.join(repoRoot, root)))
    .filter((absolutePath) => /\.(ts|tsx)$/.test(absolutePath))
    .map(toRepoRelative)
    .filter((repoRelative) => repoRelative !== tsHygieneSelfFile)
    .sort();
}

const typeScriptFilesCache = new Map<string, string[]>();
const fileLinesCache = new Map<string, string[]>();

function getTypeScriptFiles(roots: readonly string[]): string[] {
  const cacheKey = roots.join("|");
  const cached = typeScriptFilesCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const files = collectTypeScriptFiles(roots);
  typeScriptFilesCache.set(cacheKey, files);
  return files;
}

function getFileLines(repoRelative: string): string[] {
  const cached = fileLinesCache.get(repoRelative);
  if (cached) {
    return cached;
  }

  const absolutePath = path.join(repoRoot, repoRelative);
  const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
  fileLinesCache.set(repoRelative, lines);
  return lines;
}

const tsHygieneFiles = getTypeScriptFiles(tsHygieneRoots);
const tsAppHygieneFiles = getTypeScriptFiles(tsAppHygieneRoots);
const tsAppRuntimeHygieneFiles = tsAppHygieneFiles.filter(
  (repoRelative) =>
    !repoRelative.startsWith(path.normalize("src/Editor/types/")),
);
const tsTestsHygieneFiles = getTypeScriptFiles(tsTestsHygieneRoots);

describe("TypeScript everywhere guards", () => {
  it("has no authored JavaScript sources left", () => {
    const jsFiles = authoredRoots
      .flatMap((root) => collectFiles(path.join(repoRoot, root)))
      .filter((absolutePath) => [".js", ".jsx"].includes(path.extname(absolutePath)))
      .map(toRepoRelative)
      .filter((repoRelative) => !authoredAllowlist.has(repoRelative))
      .sort();

    expect(jsFiles).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("has no JavaScript unit tests left in Vitest suite", () => {
    const legacyVitestTests = collectFiles(path.join(repoRoot, "tests"))
      .map(toRepoRelative)
      .filter((repoRelative) =>
        /\.(test|spec)\.(js|jsx)$/.test(repoRelative)
      )
      .sort();

    expect(legacyVitestTests).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("has no explicit any in authored TypeScript", () => {
    const offending = tsHygieneFiles.flatMap(
      (repoRelative) => {
        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(({ line }: { line: string }) => explicitAnyPattern.test(line))
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not use @ts-ignore or @ts-nocheck outside allowlist", () => {
    const offending = tsHygieneFiles.flatMap(
      (repoRelative) => {
        if (tsSuppressionAllowlist.has(repoRelative)) {
          return [];
        }

        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) => tsIgnorePattern.test(line) || tsNocheckPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not use @ts-expect-error outside allowlist", () => {
    const offending = tsHygieneFiles.flatMap(
      (repoRelative) => {
        if (tsExpectErrorAllowlist.has(repoRelative)) {
          return [];
        }

        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(({ line }: { line: string }) => tsExpectErrorPattern.test(line))
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not use double unknown casts in app source", () => {
    const offending = tsAppHygieneFiles.flatMap(
      (repoRelative) => {
        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) => doubleUnknownCastPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not use double unknown casts in tests outside allowlist", () => {
    const offending = tsTestsHygieneFiles.flatMap(
      (repoRelative) => {
        if (doubleUnknownCastAllowlist.has(repoRelative)) {
          return [];
        }

        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) => doubleUnknownCastPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not add new JSON.parse ReturnType bridges outside allowlist", () => {
    const offending = tsHygieneFiles.flatMap(
      (repoRelative) => {
        if (jsonParseReturnTypeAllowlist.has(repoRelative)) {
          return [];
        }

        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) =>
              jsonParseReturnTypePattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not add new single unknown casts outside allowlist", () => {
    const offending = tsHygieneFiles.flatMap(
      (repoRelative) => {
        if (singleUnknownCastAllowlist.has(repoRelative)) {
          return [];
        }

        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) =>
              singleUnknownCastPattern.test(line) &&
              !doubleUnknownCastPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not directly access window.editor members in app source", () => {
    const offending = tsAppHygieneFiles.flatMap(
      (repoRelative) => {
        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) =>
              directWindowEditorAccessPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("uses window.editor references only in shared runtime helper", () => {
    const allowlist = new Set([
      path.normalize("src/Editor/Util/editorRuntime.ts"),
    ]);

    const offending = tsAppHygieneFiles.flatMap((repoRelative) => {
      if (allowlist.has(repoRelative)) {
        return [];
      }

      const lines = getFileLines(repoRelative);
      return lines
        .map((line: string, index: number) => ({ line, index: index + 1 }))
        .filter(
          ({ line }: { line: string }) =>
            windowEditorReferencePattern.test(line),
        )
        .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
    });

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("uses window.project and window.paper references only in shared app runtime helper", () => {
    const allowlist = new Set([
      path.normalize("src/Editor/Util/appRuntime.ts"),
    ]);

    const offending = tsAppHygieneFiles.flatMap((repoRelative) => {
      if (allowlist.has(repoRelative)) {
        return [];
      }

      const lines = getFileLines(repoRelative);
      return lines
        .map((line: string, index: number) => ({ line, index: index + 1 }))
        .filter(
          ({ line }: { line: string }) =>
            windowProjectReferencePattern.test(line) ||
            windowPaperReferencePattern.test(line),
        )
        .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
    });

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not directly access window.Wick members in EditorCore", () => {
    const repoRelative = path.normalize("src/Editor/EditorCore.ts");
    const lines = getFileLines(repoRelative);

    const offending = lines
      .map((line: string, index: number) => ({ line, index: index + 1 }))
      .filter(
        ({ line }: { line: string }) =>
          directWindowWickAccessPattern.test(line),
      )
      .map(({ index }: { index: number }) => `${repoRelative}:${index}`);

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not directly access window.Wick members in app source", () => {
    const offending = tsAppHygieneFiles.flatMap(
      (repoRelative) => {
        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) =>
              directWindowWickAccessPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not use ad-hoc window.Wick casts in migrated UI files", () => {
    const files = [
      path.normalize("src/Editor/Util/ColorPicker/ColorPicker.tsx"),
      path.normalize("src/Editor/Panels/Inspector/Inspector.tsx"),
      path.normalize("src/Editor/Panels/MobileContainer/MobileInspector/MobileInspector.tsx"),
      path.normalize("src/Editor/Panels/Toolbox/Toolbox.tsx"),
      path.normalize("src/Editor/Modals/SettingsModal/EditorSettings/EditorSettings.tsx"),
      path.normalize("src/Editor/Modals/SettingsModal/ProjectSettings/ProjectSettings.tsx"),
    ];

    const offending = files.flatMap((repoRelative) => {
      const lines = getFileLines(repoRelative);
      return lines
        .map((line: string, index: number) => ({ line, index: index + 1 }))
        .filter(
          ({ line }: { line: string }) =>
            adhocWindowWickCastPattern.test(line),
        )
        .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
    });

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("uses window.Wick casts only in shared runtime helper", () => {
    const allowlist = new Set([
      path.normalize("src/Editor/Util/wickRuntime.ts"),
    ]);

    const offending = tsAppHygieneFiles.flatMap((repoRelative) => {
      if (allowlist.has(repoRelative)) {
        return [];
      }

      const lines = getFileLines(repoRelative);
      return lines
        .map((line: string, index: number) => ({ line, index: index + 1 }))
        .filter(
          ({ line }: { line: string }) => windowWickCastPattern.test(line),
        )
        .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
    });

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("uses window.Wick references only in shared runtime helper", () => {
    const allowlist = new Set([
      path.normalize("src/Editor/Util/wickRuntime.ts"),
    ]);

    const offending = tsAppHygieneFiles.flatMap((repoRelative) => {
      if (allowlist.has(repoRelative)) {
        return [];
      }

      const lines = getFileLines(repoRelative);
      return lines
        .map((line: string, index: number) => ({ line, index: index + 1 }))
        .filter(
          ({ line }: { line: string }) =>
            windowWickReferencePattern.test(line),
        )
        .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
    });

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);

  it("does not add [key: string]: unknown index signatures in app runtime source", () => {
    const offending = tsAppRuntimeHygieneFiles.flatMap(
      (repoRelative) => {
        const lines = getFileLines(repoRelative);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) =>
              unknownStringIndexSignaturePattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  }, FILE_SCAN_TEST_TIMEOUT_MS);
});
