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
const tsHygieneSelfFile = path.normalize("tests/typescript-everywhere.test.ts");
const tsSuppressionAllowlist = new Set([
  path.normalize("src/Editor/Editor.tsx"),
]);
const tsExpectErrorAllowlist = new Set<string>([]);

const explicitAnyPattern = /(:\s*any\b|<any\b|as any\b|\bany\[\])/;
const tsIgnorePattern = /@ts-ignore\b/;
const tsNocheckPattern = /@ts-nocheck\b/;
const tsExpectErrorPattern = /@ts-expect-error\b/;
const doubleUnknownCastPattern = /\bas unknown as\b/;

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

describe("TypeScript everywhere guards", () => {
  it("has no authored JavaScript sources left", () => {
    const jsFiles = authoredRoots
      .flatMap((root) => collectFiles(path.join(repoRoot, root)))
      .filter((absolutePath) => [".js", ".jsx"].includes(path.extname(absolutePath)))
      .map(toRepoRelative)
      .filter((repoRelative) => !authoredAllowlist.has(repoRelative))
      .sort();

    expect(jsFiles).toEqual([]);
  });

  it("has no JavaScript unit tests left in Vitest suite", () => {
    const legacyVitestTests = collectFiles(path.join(repoRoot, "tests"))
      .map(toRepoRelative)
      .filter((repoRelative) =>
        /\.(test|spec)\.(js|jsx)$/.test(repoRelative)
      )
      .sort();

    expect(legacyVitestTests).toEqual([]);
  });

  it("has no explicit any in authored TypeScript", () => {
    const offending = collectTypeScriptFiles(tsHygieneRoots).flatMap(
      (repoRelative) => {
        const absolutePath = path.join(repoRoot, repoRelative);
        const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(({ line }: { line: string }) => explicitAnyPattern.test(line))
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  });

  it("does not use @ts-ignore or @ts-nocheck outside allowlist", () => {
    const offending = collectTypeScriptFiles(tsHygieneRoots).flatMap(
      (repoRelative) => {
        if (tsSuppressionAllowlist.has(repoRelative)) {
          return [];
        }

        const absolutePath = path.join(repoRoot, repoRelative);
        const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) => tsIgnorePattern.test(line) || tsNocheckPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  });

  it("does not use @ts-expect-error outside allowlist", () => {
    const offending = collectTypeScriptFiles(tsHygieneRoots).flatMap(
      (repoRelative) => {
        if (tsExpectErrorAllowlist.has(repoRelative)) {
          return [];
        }

        const absolutePath = path.join(repoRoot, repoRelative);
        const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(({ line }: { line: string }) => tsExpectErrorPattern.test(line))
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  });

  it("does not use double unknown casts in app source", () => {
    const offending = collectTypeScriptFiles(tsAppHygieneRoots).flatMap(
      (repoRelative) => {
        const absolutePath = path.join(repoRoot, repoRelative);
        const lines = fs.readFileSync(absolutePath, "utf8").split(/\r?\n/);
        return lines
          .map((line: string, index: number) => ({ line, index: index + 1 }))
          .filter(
            ({ line }: { line: string }) => doubleUnknownCastPattern.test(line),
          )
          .map(({ index }: { index: number }) => `${repoRelative}:${index}`);
      },
    );

    expect(offending).toEqual([]);
  });
});
