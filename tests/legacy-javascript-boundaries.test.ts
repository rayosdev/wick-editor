import path from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const repoRoot = process.cwd();
const allowedPrefixes = [
  path.normalize("engine/lib/"),
  path.normalize("engine/dist/"),
  path.normalize("engine/tests/"),
  path.normalize("engine/src/export/zip/"),
  path.normalize("public/"),
];

function listTrackedFiles(): string[] {
  const output = execSync("git ls-files", {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return output
    .split("\n")
    .map((line: string) => line.trim())
    .filter(Boolean)
    .map((repoRelative: string) => path.normalize(repoRelative))
    .filter((repoRelative: string) => fs.existsSync(path.join(repoRoot, repoRelative)));
}

describe("Legacy JavaScript boundaries", () => {
  it("keeps remaining .js/.jsx files inside explicitly approved paths", () => {
    const jsFiles = listTrackedFiles()
      .filter((repoRelative) => [".js", ".jsx"].includes(path.extname(repoRelative)))
      .sort();

    const outOfBounds = jsFiles.filter(
      (repoRelative) =>
        !allowedPrefixes.some((allowedPrefix) => repoRelative.startsWith(allowedPrefix))
    );

    expect(outOfBounds).toEqual([]);
  });
});
