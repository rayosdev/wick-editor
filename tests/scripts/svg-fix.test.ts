import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  fixSVGContent,
  runFix,
} from "../../scripts/fix-svgs";

describe("SVG fix script", () => {
  it("adds missing tags and fixes colors", () => {
    const brokenSvg = `<?xml version="1.0" encoding="utf-8"?>
<g style="fill:ABCDEF; stroke:111111;"></g>`;

    const result = fixSVGContent(brokenSvg);

    expect(result.skipped).toBe(false);
    expect(result.changed).toBe(true);
    expect(result.fixes.length).toBeGreaterThanOrEqual(2);
    expect(result.fixedContent).toContain("<svg version=\"1.1\"");
    expect(result.fixedContent).toContain("fill:#ABCDEF;");
    expect(result.fixedContent).toContain("stroke:#111111;");
    expect(result.fixedContent).toContain("</svg>");
  });

  it("skips malformed files without xml declaration", () => {
    const malformedSvg = `<g style="fill:ABCDEF;"></g>`;
    const result = fixSVGContent(malformedSvg);

    expect(result.skipped).toBe(true);
    expect(result.changed).toBe(false);
    expect(result.skipReason).toContain("No XML declaration");
  });

  it("backs up and rewrites files during run", () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wick-svg-fix-"));
    const resourcesDir = path.join(tempRoot, "resources");
    const backupDir = path.join(tempRoot, "backups");
    fs.mkdirSync(resourcesDir, { recursive: true });

    const filePath = path.join(resourcesDir, "icon.svg");
    fs.writeFileSync(
      filePath,
      `<?xml version="1.0" encoding="utf-8"?>\n<g style="fill:ABCDEF;"></g>`
    );

    const summary = runFix(resourcesDir, backupDir);
    const rewritten = fs.readFileSync(filePath, "utf8");
    const backup = fs.readFileSync(path.join(backupDir, "icon.svg"), "utf8");

    expect(summary.scannedCount).toBe(1);
    expect(summary.fixedCount).toBe(1);
    expect(summary.skippedCount).toBe(0);
    expect(rewritten).toContain("fill:#ABCDEF;");
    expect(rewritten).toContain("</svg>");
    expect(backup).toContain("fill:ABCDEF;");

    fs.rmSync(tempRoot, { recursive: true, force: true });
  });
});
