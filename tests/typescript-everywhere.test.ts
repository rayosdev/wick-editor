import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();

const authoredRoots = ["src", "scripts", "tests", "engine/src"] as const;
const authoredAllowlist = new Set([
  path.normalize("engine/src/export/zip/preloadjs.min.js"),
  path.normalize("engine/src/export/zip/wickengine.js"),
]);

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
});
