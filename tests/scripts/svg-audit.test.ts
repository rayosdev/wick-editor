import { describe, expect, it } from "vitest";

import {
  auditSVGContent,
  createStats,
} from "../../scripts/audit-svgs";

describe("SVG audit script", () => {
  it("passes valid SVG content with no issues", () => {
    const stats = createStats();
    const validSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
  <title>Valid Icon</title>
  <rect width="10" height="10" />
</svg>`;

    const issue = auditSVGContent(validSvg, "icons/valid.svg", stats);
    expect(issue).toBeNull();
    expect(stats.critical).toBe(0);
    expect(stats.accessibility).toBe(0);
    expect(stats.optimization).toBe(0);
  });

  it("detects structural and style issues", () => {
    const stats = createStats();
    const brokenSvg = `<?xml version="1.0" encoding="utf-8"?>
<g style="fill:ABCDEF; stroke:111111;"></g>`;

    const issue = auditSVGContent(brokenSvg, "icons/broken.svg", stats);
    expect(issue).not.toBeNull();
    expect(issue?.problems.some((problem) => problem.type === "critical")).toBe(
      true
    );
    expect(issue?.problems.some((problem) => problem.type === "warning")).toBe(
      true
    );
    expect(issue?.problems.some((problem) => problem.type === "accessibility")).toBe(
      true
    );

    expect(stats.critical).toBe(3);
    expect(stats.accessibility).toBe(1);
  });
});
