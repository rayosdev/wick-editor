#!/usr/bin/env node

/**
 * SVG Audit Script
 * 
 * Validates all SVG files in src/resources/ for:
 * - Well-formed XML
 * - Required <svg> root element
 * - Proper namespace declarations
 * - Valid viewBox attributes
 * - Accessibility (title/desc)
 * - Optimization opportunities
 * 
 * Usage: node scripts/audit-svgs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RESOURCES_DIR = path.join(__dirname, '../src/resources');
const issues = [];
const stats = {
  total: 0,
  withIssues: 0,
  critical: 0,
  accessibility: 0,
  optimization: 0,
};

function auditSVG(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(process.cwd(), filePath);
  const issue = { file: relativePath, problems: [] };

  // Check 1: Has XML declaration
  if (!content.startsWith('<?xml')) {
    issue.problems.push({ type: 'warning', msg: 'Missing XML declaration' });
  }

  // Check 2: Has opening <svg> tag (CRITICAL)
  if (!content.includes('<svg')) {
    issue.problems.push({ type: 'critical', msg: 'Missing <svg> opening tag - FILE WILL NOT RENDER' });
    stats.critical++;
  }

  // Check 3: Has namespace
  if (!content.includes('xmlns="http://www.w3.org/2000/svg"')) {
    issue.problems.push({ type: 'warning', msg: 'Missing xmlns namespace declaration' });
  }

  // Check 4: Has viewBox or width/height
  if (!content.includes('viewBox') && !content.includes('width="')) {
    issue.problems.push({ type: 'warning', msg: 'Missing viewBox or dimensions' });
  }

  // Check 5: Has closing </svg> tag (CRITICAL)
  if (!content.includes('</svg>')) {
    issue.problems.push({ type: 'critical', msg: 'Missing </svg> closing tag' });
    stats.critical++;
  }

  // Check 6: Accessibility - title
  if (!content.includes('<title>')) {
    issue.problems.push({ type: 'accessibility', msg: 'Missing <title> tag for accessibility' });
    stats.accessibility++;
  }

  // Check 7: Accessibility - desc for complex icons
  if (content.length > 1000 && !content.includes('<desc>')) {
    issue.problems.push({ type: 'accessibility', msg: 'Complex icon missing <desc> tag' });
  }

  // Check 8: Optimization - Adobe metadata
  if (content.includes('Generator: Adobe Illustrator')) {
    issue.problems.push({ type: 'optimization', msg: 'Contains Adobe Illustrator metadata' });
    stats.optimization++;
  }

  // Check 9: Optimization - CSS classes
  if (content.match(/class="st\d+"/)) {
    issue.problems.push({ type: 'optimization', msg: 'Uses CSS classes (.st0, .st1, etc.) - should use inline styles' });
    stats.optimization++;
  }

  // Check 10: Optimization - commented out gradients
  if (content.includes('<!--') && content.includes('SVGID')) {
    issue.problems.push({ type: 'optimization', msg: 'Contains commented-out gradient definitions' });
  }

  // Check 11: Invalid CSS color values
  const invalidColors = content.match(/fill:([0-9A-F]{6});/gi);
  if (invalidColors) {
    issue.problems.push({ 
      type: 'critical', 
      msg: `Invalid CSS colors missing # symbol: ${invalidColors.join(', ')}` 
    });
    stats.critical++;
  }

  // Check 12: File size
  const sizeKB = Buffer.byteLength(content, 'utf8') / 1024;
  if (sizeKB > 10) {
    issue.problems.push({ type: 'optimization', msg: `Large file size: ${sizeKB.toFixed(2)}KB (recommend < 5KB)` });
  }

  if (issue.problems.length > 0) {
    issues.push(issue);
    stats.withIssues++;
  }
}

// Recursively find all SVG files
function findSVGs(dir) {
  const files = fs.readdirSync(dir);
  const svgs = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      svgs.push(...findSVGs(fullPath));
    } else if (file.endsWith('.svg')) {
      svgs.push(fullPath);
    }
  }

  return svgs;
}

// Generate Markdown report
function generateMarkdownReport() {
  const critical = issues.filter(i => 
    i.problems.some(p => p.type === 'critical')
  );

  const accessibility = issues.filter(i =>
    i.problems.some(p => p.type === 'accessibility')
  );

  const optimization = issues.filter(i =>
    i.problems.some(p => p.type === 'optimization')
  );

  let report = `# SVG Audit Report

**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}  
**Total SVGs:** ${stats.total}  
**Files with Issues:** ${stats.withIssues} (${((stats.withIssues / stats.total) * 100).toFixed(1)}%)

---

## 🚨 Summary

| Category | Count | Priority |
|----------|-------|----------|
| **Critical Issues** | ${critical.length} | 🔴 **IMMEDIATE** |
| **Accessibility Issues** | ${accessibility.length} | 🟡 High |
| **Optimization Opportunities** | ${optimization.length} | 🟢 Medium |

---

## 🔴 Critical Issues (${critical.length} files)

${critical.length > 0 ? 'These files have structural problems and may not render correctly:\n' : 'No critical issues found! ✅\n'}

${critical.map((item, idx) => `
### ${idx + 1}. \`${item.file}\`

${item.problems.filter(p => p.type === 'critical').map(p => `- ❌ ${p.msg}`).join('\n')}
`).join('\n')}

---

## 🟡 Accessibility Issues (${accessibility.length} files)

${accessibility.length > 0 ? 'These files lack accessibility attributes:\n' : 'All files have accessibility attributes! ✅\n'}

${accessibility.length > 0 ? `
<details>
<summary>Click to expand (${accessibility.length} files)</summary>

${accessibility.map((item, idx) => `
#### ${idx + 1}. \`${item.file}\`

${item.problems.filter(p => p.type === 'accessibility').map(p => `- ⚠️ ${p.msg}`).join('\n')}
`).join('\n')}

</details>
` : ''}

---

## 🟢 Optimization Opportunities (${optimization.length} files)

${optimization.length > 0 ? 'These files can be optimized:\n' : 'All files are optimized! ✅\n'}

${optimization.length > 0 ? `
<details>
<summary>Click to expand (${optimization.length} files)</summary>

${optimization.map((item, idx) => `
#### ${idx + 1}. \`${item.file}\`

${item.problems.filter(p => p.type === 'optimization').map(p => `- 📦 ${p.msg}`).join('\n')}
`).join('\n')}

</details>
` : ''}

---

## 📋 Detailed File List

${issues.length > 0 ? `
<details>
<summary>All files with issues (${issues.length} total)</summary>

${issues.map((item, idx) => `
### ${idx + 1}. \`${item.file}\`

${item.problems.map(p => {
  const emoji = p.type === 'critical' ? '❌' : p.type === 'accessibility' ? '⚠️' : '📦';
  return `${emoji} **[${p.type.toUpperCase()}]** ${p.msg}`;
}).join('\n')}

---
`).join('\n')}

</details>
` : 'No issues found! All SVG files are in good condition. ✅'}

---

## 🔧 Recommended Actions

### Immediate (Critical Issues)
${critical.length > 0 ? `
1. Run the fix script: \`node scripts/fix-svgs.js\`
2. Manually review files with critical issues
3. Test all icons in the browser
4. Commit fixes with descriptive message
` : '✅ No immediate action required'}

### Short Term (Accessibility)
${accessibility.length > 0 ? `
1. Add \`<title>\` tags to all SVGs
2. Add \`<desc>\` tags for complex icons
3. Add \`role="img"\` to root \`<svg>\` elements
4. Add \`aria-labelledby\` attributes
` : '✅ Accessibility is good'}

### Long Term (Optimization)
${optimization.length > 0 ? `
1. Run SVGO optimization: \`npm run optimize-svgs\`
2. Remove Adobe Illustrator metadata
3. Inline CSS styles (replace classes with inline)
4. Compress files to < 5KB each
` : '✅ Files are well optimized'}

---

## 📊 Statistics by Directory

${generateDirectoryStats()}

---

**Report Generated:** ${new Date().toISOString()}  
**Script:** \`scripts/audit-svgs.js\`
`;

  return report;
}

function generateDirectoryStats() {
  const dirStats = {};

  issues.forEach(item => {
    const dir = path.dirname(item.file);
    if (!dirStats[dir]) {
      dirStats[dir] = { total: 0, critical: 0, accessibility: 0, optimization: 0 };
    }
    dirStats[dir].total++;
    item.problems.forEach(p => {
      if (p.type === 'critical') dirStats[dir].critical++;
      if (p.type === 'accessibility') dirStats[dir].accessibility++;
      if (p.type === 'optimization') dirStats[dir].optimization++;
    });
  });

  return Object.entries(dirStats)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([dir, stats]) => 
      `- **${dir}**: ${stats.total} issues (🔴 ${stats.critical} critical, 🟡 ${stats.accessibility} accessibility, 🟢 ${stats.optimization} optimization)`
    )
    .join('\n');
}

// Main execution
console.log('🔍 Starting SVG audit...\n');

const svgFiles = findSVGs(RESOURCES_DIR);
stats.total = svgFiles.length;

console.log(`Found ${svgFiles.length} SVG files in ${RESOURCES_DIR}\n`);
console.log('Analyzing...\n');

for (const file of svgFiles) {
  auditSVG(file);
}

// Console output
console.log('='.repeat(60));
console.log('📊 AUDIT RESULTS');
console.log('='.repeat(60));
console.log(`Total SVGs:              ${stats.total}`);
console.log(`Files with issues:       ${stats.withIssues} (${((stats.withIssues / stats.total) * 100).toFixed(1)}%)`);
console.log(`\n🔴 Critical issues:      ${stats.critical} files`);
console.log(`🟡 Accessibility issues: ${stats.accessibility} files`);
console.log(`🟢 Optimization needed:  ${stats.optimization} files`);
console.log('='.repeat(60));

// Write detailed report
const reportPath = path.join(process.cwd(), 'SVG_AUDIT_REPORT.md');
fs.writeFileSync(reportPath, generateMarkdownReport());

console.log(`\n✅ Detailed report written to: SVG_AUDIT_REPORT.md`);

// Exit code
if (stats.critical > 0) {
  console.log('\n⚠️  WARNING: Critical issues found! Run fix script immediately.');
  process.exit(1);
} else {
  console.log('\n✨ All SVGs are structurally sound!');
  process.exit(0);
}
