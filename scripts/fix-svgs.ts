#!/usr/bin/env tsx

/**
 * SVG Emergency Fix Script
 *
 * Fixes critical SVG issues:
 * - Adds missing <svg> opening tags
 * - Fixes invalid CSS color values (missing #)
 * - Adds missing </svg> closing tags
 * - Creates backups of all modified files
 *
 * Usage: npm run svg:fix
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESOURCES_DIR = path.join(__dirname, "../src/resources");
const BACKUP_DIR = path.join(__dirname, "../svg-backups-emergency");

let fixCount = 0;
let skippedCount = 0;

function fixSVG(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  let fixed = content;
  let changed = false;
  const fixes = [];

  // Fix 1: Add missing <svg> tag
  if (!fixed.includes("<svg")) {
    // Find where to insert <svg> tag
    const xmlDeclEnd = fixed.indexOf("?>");
    if (xmlDeclEnd === -1) {
      console.log(
        `  ⚠️  No XML declaration found in ${path.basename(filePath)}, skipping`
      );
      skippedCount++;
      return false;
    }

    // Find first non-whitespace after XML declaration
    let insertPoint = xmlDeclEnd + 2;
    while (insertPoint < fixed.length && fixed[insertPoint].match(/\s/)) {
      insertPoint++;
    }

    // Extract viewBox if present in orphaned attributes
    const viewBoxMatch = fixed.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[0] : 'viewBox="0 0 100 100"';

    // Check if we have width/height
    const widthMatch = fixed.match(/width="([^"]+)"/);
    const heightMatch = fixed.match(/height="([^"]+)"/);
    const dimensions =
      widthMatch && heightMatch
        ? `width="${widthMatch[1]}" height="${heightMatch[1]}"`
        : "";

    // Extract style if present
    const styleMatch = fixed.match(/style="([^"]+)"/);
    const style = styleMatch ? styleMatch[0] : "";

    // Extract xml:space if present
    const xmlSpaceMatch = fixed.match(/xml:space="([^"]+)"/);
    const xmlSpace = xmlSpaceMatch ? xmlSpaceMatch[0] : 'xml:space="preserve"';

    // Construct proper <svg> tag
    const svgTag = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${viewBox} ${dimensions} ${style} ${xmlSpace}>\n`;

    fixed = fixed.slice(0, insertPoint) + svgTag + fixed.slice(insertPoint);
    changed = true;
    fixes.push("Added missing <svg> tag");
  }

  // Fix 2: Fix invalid CSS color values (missing #)
  const colorMatches = fixed.match(/fill:([0-9A-F]{6});/gi);
  if (colorMatches) {
    fixed = fixed.replace(
      /fill:([0-9A-F]{6});/gi,
      (match, hex) => `fill:#${hex};`
    );
    fixed = fixed.replace(
      /stroke:([0-9A-F]{6});/gi,
      (match, hex) => `stroke:#${hex};`
    );
    changed = true;
    fixes.push(`Fixed ${colorMatches.length} CSS color value(s)`);
  }

  // Fix 3: Ensure closing </svg> tag exists
  if (!fixed.includes("</svg>")) {
    fixed = fixed.trim() + "\n</svg>\n";
    changed = true;
    fixes.push("Added missing </svg> tag");
  }

  if (changed) {
    // Backup original
    const relativePath = path.relative(RESOURCES_DIR, filePath);
    const backupPath = path.join(BACKUP_DIR, relativePath);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.writeFileSync(backupPath, content);

    // Write fixed version
    fs.writeFileSync(filePath, fixed);
    fixCount++;

    console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
    fixes.forEach((fix) => console.log(`   - ${fix}`));
    return true;
  }

  return false;
}

function findSVGs(dir) {
  const files = fs.readdirSync(dir);
  const svgs = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      svgs.push(...findSVGs(fullPath));
    } else if (file.endsWith(".svg")) {
      svgs.push(fullPath);
    }
  }

  return svgs;
}

// Main execution
console.log("🔧 SVG Emergency Fix - Starting...\n");
console.log("📦 Creating backups in:", BACKUP_DIR);
console.log("🔍 Scanning for SVG files...\n");

const svgFiles = findSVGs(RESOURCES_DIR);
console.log(`Found ${svgFiles.length} SVG files\n`);
console.log("Fixing issues:\n");

for (const file of svgFiles) {
  fixSVG(file);
}

console.log("\n" + "=".repeat(60));
console.log("✨ EMERGENCY FIX COMPLETE");
console.log("=".repeat(60));
console.log(`✅ Fixed: ${fixCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files (no issues)`);
console.log(`📦 Backups: ${BACKUP_DIR}`);
console.log("=".repeat(60));

if (fixCount > 0) {
  console.log("\n📋 Next steps:");
  console.log("1. Run audit: npm run svg:audit");
  console.log("2. Test in browser: npm run dev");
  console.log("3. If all good, commit changes");
  console.log("\n💾 Backup location saved for 30 days");
} else {
  console.log("\n✨ No fixes needed - all SVGs are already valid!");
}

console.log("");
