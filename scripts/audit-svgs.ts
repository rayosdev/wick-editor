#!/usr/bin/env tsx

/**
 * SVG Audit Script
 *
 * Usage: npm run svg:audit
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export type SVGProblemType =
  | "warning"
  | "critical"
  | "accessibility"
  | "optimization";

export interface SVGProblem {
  type: SVGProblemType;
  msg: string;
}

export interface SVGIssue {
  file: string;
  problems: SVGProblem[];
}

export interface SVGStats {
  total: number;
  withIssues: number;
  critical: number;
  accessibility: number;
  optimization: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_RESOURCES_DIR = path.join(__dirname, "../src/resources");
const DEFAULT_REPORT_PATH = path.join(process.cwd(), "SVG_AUDIT_REPORT.md");

export function createStats(): SVGStats {
  return {
    total: 0,
    withIssues: 0,
    critical: 0,
    accessibility: 0,
    optimization: 0,
  };
}

export function auditSVGContent(
  content: string,
  relativePath: string,
  stats: SVGStats
): SVGIssue | null {
  const issue: SVGIssue = { file: relativePath, problems: [] };

  if (!content.startsWith("<?xml")) {
    issue.problems.push({ type: "warning", msg: "Missing XML declaration" });
  }

  if (!content.includes("<svg")) {
    issue.problems.push({
      type: "critical",
      msg: "Missing <svg> opening tag - FILE WILL NOT RENDER",
    });
    stats.critical++;
  }

  if (!content.includes('xmlns="http://www.w3.org/2000/svg"')) {
    issue.problems.push({
      type: "warning",
      msg: "Missing xmlns namespace declaration",
    });
  }

  if (!content.includes("viewBox") && !content.includes('width="')) {
    issue.problems.push({
      type: "warning",
      msg: "Missing viewBox or dimensions",
    });
  }

  if (!content.includes("</svg>")) {
    issue.problems.push({
      type: "critical",
      msg: "Missing </svg> closing tag",
    });
    stats.critical++;
  }

  if (!content.includes("<title>")) {
    issue.problems.push({
      type: "accessibility",
      msg: "Missing <title> tag for accessibility",
    });
    stats.accessibility++;
  }

  if (content.length > 1000 && !content.includes("<desc>")) {
    issue.problems.push({
      type: "accessibility",
      msg: "Complex icon missing <desc> tag",
    });
  }

  if (content.includes("Generator: Adobe Illustrator")) {
    issue.problems.push({
      type: "optimization",
      msg: "Contains Adobe Illustrator metadata",
    });
    stats.optimization++;
  }

  if (/class="st\d+"/.test(content)) {
    issue.problems.push({
      type: "optimization",
      msg: "Uses CSS classes (.st0, .st1, etc.) - should use inline styles",
    });
    stats.optimization++;
  }

  if (content.includes("<!--") && content.includes("SVGID")) {
    issue.problems.push({
      type: "optimization",
      msg: "Contains commented-out gradient definitions",
    });
  }

  const invalidColors = content.match(/fill:([0-9A-F]{6});/gi);
  if (invalidColors) {
    issue.problems.push({
      type: "critical",
      msg: `Invalid CSS colors missing # symbol: ${invalidColors.join(", ")}`,
    });
    stats.critical++;
  }

  const sizeKB = Buffer.byteLength(content, "utf8") / 1024;
  if (sizeKB > 10) {
    issue.problems.push({
      type: "optimization",
      msg: `Large file size: ${sizeKB.toFixed(2)}KB (recommend < 5KB)`,
    });
  }

  return issue.problems.length > 0 ? issue : null;
}

export function findSVGs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const svgFiles: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      svgFiles.push(...findSVGs(absolutePath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".svg")) {
      svgFiles.push(absolutePath);
    }
  }

  return svgFiles;
}

function generateDirectoryStats(issues: SVGIssue[]): string {
  const dirStats: Record<
    string,
    {
      total: number;
      critical: number;
      accessibility: number;
      optimization: number;
    }
  > = {};

  for (const issue of issues) {
    const dir = path.dirname(issue.file);
    if (!dirStats[dir]) {
      dirStats[dir] = {
        total: 0,
        critical: 0,
        accessibility: 0,
        optimization: 0,
      };
    }
    dirStats[dir].total++;
    for (const problem of issue.problems) {
      if (problem.type === "critical") dirStats[dir].critical++;
      if (problem.type === "accessibility") dirStats[dir].accessibility++;
      if (problem.type === "optimization") dirStats[dir].optimization++;
    }
  }

  return Object.entries(dirStats)
    .sort(([, a], [, b]) => b.total - a.total)
    .map(
      ([dir, stat]) =>
        `- **${dir}**: ${stat.total} issues (🔴 ${stat.critical} critical, 🟡 ${stat.accessibility} accessibility, 🟢 ${stat.optimization} optimization)`
    )
    .join("\n");
}

export function generateMarkdownReport(
  issues: SVGIssue[],
  stats: SVGStats,
  now = new Date()
): string {
  const critical = issues.filter((issue) =>
    issue.problems.some((problem) => problem.type === "critical")
  );

  const accessibility = issues.filter((issue) =>
    issue.problems.some((problem) => problem.type === "accessibility")
  );

  const optimization = issues.filter((issue) =>
    issue.problems.some((problem) => problem.type === "optimization")
  );

  const withIssuePercent =
    stats.total > 0 ? ((stats.withIssues / stats.total) * 100).toFixed(1) : "0.0";

  return `# SVG Audit Report

**Date:** ${now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}  
**Total SVGs:** ${stats.total}  
**Files with Issues:** ${stats.withIssues} (${withIssuePercent}%)

---

## Summary

- Critical files: ${critical.length}
- Accessibility files: ${accessibility.length}
- Optimization files: ${optimization.length}

---

## Critical Issues

${
  critical.length === 0
    ? "No critical issues found."
    : critical
        .map(
          (issue) =>
            `- \`${issue.file}\`: ${issue.problems
              .filter((problem) => problem.type === "critical")
              .map((problem) => problem.msg)
              .join("; ")}`
        )
        .join("\n")
}

---

## Directory Stats

${issues.length > 0 ? generateDirectoryStats(issues) : "No issues found."}

---

**Report Generated:** ${now.toISOString()}  
**Script:** \`scripts/audit-svgs.ts\`
`;
}

export function runAudit(resourcesDir = DEFAULT_RESOURCES_DIR): {
  issues: SVGIssue[];
  stats: SVGStats;
  reportPath: string;
} {
  const stats = createStats();
  const issues: SVGIssue[] = [];
  const svgFiles = findSVGs(resourcesDir);
  stats.total = svgFiles.length;

  for (const filePath of svgFiles) {
    const content = fs.readFileSync(filePath, "utf8");
    const relativePath = path.relative(process.cwd(), filePath);
    const issue = auditSVGContent(content, relativePath, stats);
    if (issue) {
      issues.push(issue);
      stats.withIssues++;
    }
  }

  const markdown = generateMarkdownReport(issues, stats);
  fs.writeFileSync(DEFAULT_REPORT_PATH, markdown);

  return {
    issues,
    stats,
    reportPath: DEFAULT_REPORT_PATH,
  };
}

export function main(): number {
  console.log("🔍 Starting SVG audit...\n");
  const { stats, reportPath } = runAudit();

  console.log("=".repeat(60));
  console.log("📊 AUDIT RESULTS");
  console.log("=".repeat(60));
  console.log(`Total SVGs:              ${stats.total}`);
  const withIssuePercent =
    stats.total > 0 ? ((stats.withIssues / stats.total) * 100).toFixed(1) : "0.0";
  console.log(
    `Files with issues:       ${stats.withIssues} (${withIssuePercent}%)`
  );
  console.log(`\n🔴 Critical issues:      ${stats.critical} files`);
  console.log(`🟡 Accessibility issues: ${stats.accessibility} files`);
  console.log(`🟢 Optimization needed:  ${stats.optimization} files`);
  console.log("=".repeat(60));
  console.log(`\n✅ Detailed report written to: ${path.basename(reportPath)}`);

  if (stats.critical > 0) {
    console.log("\n⚠️  WARNING: Critical issues found! Run fix script immediately.");
    return 1;
  }

  console.log("\n✨ All SVGs are structurally sound!");
  return 0;
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  process.exit(main());
}
