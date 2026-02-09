#!/usr/bin/env tsx

/**
 * SVG Emergency Fix Script
 *
 * Usage: npm run svg:fix
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export interface SVGFixResult {
  changed: boolean;
  skipped: boolean;
  fixedContent: string;
  fixes: string[];
  skipReason?: string;
}

export interface SVGFixRunSummary {
  fixedCount: number;
  skippedCount: number;
  scannedCount: number;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_RESOURCES_DIR = path.join(__dirname, "../src/resources");
const DEFAULT_BACKUP_DIR = path.join(__dirname, "../svg-backups-emergency");

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

export function fixSVGContent(content: string): SVGFixResult {
  let fixed = content;
  let changed = false;
  const fixes: string[] = [];

  if (!fixed.includes("<svg")) {
    const xmlDeclEnd = fixed.indexOf("?>");
    if (xmlDeclEnd === -1) {
      return {
        changed: false,
        skipped: true,
        fixedContent: content,
        fixes,
        skipReason: "No XML declaration found",
      };
    }

    let insertPoint = xmlDeclEnd + 2;
    while (insertPoint < fixed.length && /\s/.test(fixed[insertPoint] ?? "")) {
      insertPoint++;
    }

    const viewBoxMatch = fixed.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[0] : 'viewBox="0 0 100 100"';

    const widthMatch = fixed.match(/width="([^"]+)"/);
    const heightMatch = fixed.match(/height="([^"]+)"/);
    const dimensions =
      widthMatch && heightMatch
        ? `width="${widthMatch[1]}" height="${heightMatch[1]}"`
        : "";

    const styleMatch = fixed.match(/style="([^"]+)"/);
    const style = styleMatch ? styleMatch[0] : "";

    const xmlSpaceMatch = fixed.match(/xml:space="([^"]+)"/);
    const xmlSpace = xmlSpaceMatch ? xmlSpaceMatch[0] : 'xml:space="preserve"';

    const svgTag = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${viewBox} ${dimensions} ${style} ${xmlSpace}>\n`;
    fixed = fixed.slice(0, insertPoint) + svgTag + fixed.slice(insertPoint);
    changed = true;
    fixes.push("Added missing <svg> tag");
  }

  const colorMatches = fixed.match(/fill:([0-9A-F]{6});/gi);
  if (colorMatches) {
    fixed = fixed.replace(/fill:([0-9A-F]{6});/gi, (_match, hex: string) => {
      return `fill:#${hex};`;
    });
    fixed = fixed.replace(/stroke:([0-9A-F]{6});/gi, (_match, hex: string) => {
      return `stroke:#${hex};`;
    });
    changed = true;
    fixes.push(`Fixed ${colorMatches.length} CSS color value(s)`);
  }

  if (!fixed.includes("</svg>")) {
    fixed = `${fixed.trim()}\n</svg>\n`;
    changed = true;
    fixes.push("Added missing </svg> tag");
  }

  return {
    changed,
    skipped: false,
    fixedContent: fixed,
    fixes,
  };
}

function fixSVGFile(
  filePath: string,
  resourcesDir: string,
  backupDir: string
): SVGFixResult {
  const originalContent = fs.readFileSync(filePath, "utf8");
  const result = fixSVGContent(originalContent);

  if (result.skipped || !result.changed) {
    return result;
  }

  const relativePath = path.relative(resourcesDir, filePath);
  const backupPath = path.join(backupDir, relativePath);
  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.writeFileSync(backupPath, originalContent);
  fs.writeFileSync(filePath, result.fixedContent);

  return result;
}

export function runFix(
  resourcesDir = DEFAULT_RESOURCES_DIR,
  backupDir = DEFAULT_BACKUP_DIR
): SVGFixRunSummary {
  const svgFiles = findSVGs(resourcesDir);
  let fixedCount = 0;
  let skippedCount = 0;

  console.log("🔧 SVG Emergency Fix - Starting...\n");
  console.log("📦 Creating backups in:", backupDir);
  console.log("🔍 Scanning for SVG files...\n");
  console.log(`Found ${svgFiles.length} SVG files\n`);
  console.log("Fixing issues:\n");

  for (const filePath of svgFiles) {
    const result = fixSVGFile(filePath, resourcesDir, backupDir);
    if (result.skipped) {
      skippedCount++;
      console.log(
        `  ⚠️  ${path.relative(process.cwd(), filePath)} - ${result.skipReason ?? "Skipped"}`
      );
      continue;
    }

    if (!result.changed) {
      continue;
    }

    fixedCount++;
    console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
    for (const fix of result.fixes) {
      console.log(`   - ${fix}`);
    }
  }

  return {
    fixedCount,
    skippedCount,
    scannedCount: svgFiles.length,
  };
}

export function main(): number {
  const summary = runFix();

  console.log(`\n${"=".repeat(60)}`);
  console.log("✨ EMERGENCY FIX COMPLETE");
  console.log("=".repeat(60));
  console.log(`✅ Fixed: ${summary.fixedCount} files`);
  console.log(`⏭️  Skipped: ${summary.skippedCount} files`);
  console.log(`📦 Backups: ${DEFAULT_BACKUP_DIR}`);
  console.log("=".repeat(60));

  if (summary.fixedCount > 0) {
    console.log("\n📋 Next steps:");
    console.log("1. Run audit: npm run svg:audit");
    console.log("2. Test in browser: npm run dev");
    console.log("3. If all good, commit changes");
    console.log("\n💾 Backup location saved for 30 days");
  } else {
    console.log("\n✨ No fixes needed - all SVGs are already valid!");
  }

  console.log("");
  return 0;
}

const entryPath = process.argv[1];
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  process.exit(main());
}
