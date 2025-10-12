# SVG Modernization Plan

**Date:** October 13, 2025  
**Status:** 📋 Planning Phase  
**Priority:** Medium-High (Quality & Maintenance)

---

## 🎯 Objectives

1. **Audit all SVG files** for structural issues (malformed XML, missing tags)
2. **Standardize SVG format** across the entire project
3. **Modernize import patterns** to use React-friendly methods
4. **Optimize file sizes** and remove unnecessary metadata
5. **Improve maintainability** with consistent naming and organization

---

## 📊 Current State Analysis

### SVG File Inventory

**Total SVG Files:** 191 files in `/src/resources/`

| Directory                 | Count | Purpose                                          |
| ------------------------- | ----- | ------------------------------------------------ |
| `tool-icons/`             | 53    | Editor action icons (timeline, breakApart, etc.) |
| `inspector-icons/`        | 21    | Property inspector icons                         |
| `mobile-inspector-icons/` | 20    | Mobile-specific inspector icons                  |
| `toolbar-icons/`          | 19    | Main toolbar tool icons (brush, cursor, etc.)    |
| `interface/`              | 13    | General UI elements                              |
| `interface-images/`       | 9     | Modal/dialog graphics                            |
| `support-us-icons/`       | 9     | Social media icons                               |
| `code-icons/`             | 9     | Code editor icons                                |
| `object-icons/`           | 9     | Object type icons (layer, frame, etc.)           |
| `asset-library-icons/`    | 8     | Asset library UI icons                           |
| `mobile-container-icons/` | 8     | Mobile navigation icons                          |
| `outliner-icons/`         | 7     | Outliner panel icons                             |
| `logo-icons/`             | 4     | Wick Editor branding                             |
| `timeline-icons/`         | 2     | Timeline controls                                |

### Current Import Patterns

**Pattern 1: Default Import (most common)**

```typescript
import iconBrush from "resources/toolbar-icons/brush.svg";
// Used as: <img src={iconBrush} />
```

**Pattern 2: Relative Paths**

```typescript
import patreonLogoWhite from "../../../resources/support-us-icons/patreon-logo-white.svg";
```

**Pattern 3: Commented React Component Pattern (not used)**

```typescript
// import { ReactComponent as Logo } from './logo.svg';
```

### Known Issues

1. ✅ **FIXED:** `breakApart-dark.svg` and `timeline-dark.svg` - Missing `<svg>` opening tags
2. ⚠️ **Potential:** Other SVG files may have similar corruption (not yet audited)
3. ⚠️ **Inconsistency:** Mixed Adobe Illustrator exports with different metadata
4. ⚠️ **File Size:** Many SVGs contain unnecessary metadata and comments
5. ⚠️ **CSS in SVGs:** Embedded styles use class names (`.st0`, `.st1`) instead of inline styles
6. ⚠️ **Accessibility:** Most SVGs lack `<title>` and `<desc>` tags for screen readers

### Current Vite Configuration

```javascript
// vite.config.js handles SVGs as static assets
resolve: {
  alias: {
    resources: "/src/resources",
  }
}
```

SVGs are imported as URL strings and used with `<img>` tags.

---

## 🔍 Audit Strategy

### Phase 1: Automated Validation (Week 1)

**Goal:** Identify all SVG files with structural issues

**Tools:**

- `xmllint` - XML validation
- Custom Node.js script - Bulk validation
- SVGO - SVG optimization and validation

**Script: `scripts/audit-svgs.js`**

```javascript
// Validate all SVG files for:
// 1. Well-formed XML
// 2. Required <svg> root element
// 3. Proper namespace declarations
// 4. Valid viewBox attributes
// 5. Accessibility (title/desc)
```

**Deliverable:**

- `SVG_AUDIT_REPORT.md` - Complete list of issues
- `svg-issues.json` - Machine-readable issue list

### Phase 2: Manual Review (Week 1-2)

**Goal:** Categorize and prioritize fixes

**Review Criteria:**

1. **Critical:** Files that won't render (missing tags)
2. **High:** Files with accessibility issues
3. **Medium:** Files with optimization opportunities
4. **Low:** Files with metadata cleanup needs

**Deliverable:**

- Prioritized issue list
- Decision on modernization approach

---

## 🛠️ Modernization Approaches

### Option A: Fix-in-Place (Conservative) ⭐ **RECOMMENDED**

**Approach:**

- Keep current import pattern (`import icon from "file.svg"`)
- Fix structural issues in SVG files themselves
- Optimize and standardize SVG format
- Add accessibility attributes
- Keep using `<img src={icon} />` pattern

**Pros:**

- ✅ No code changes required
- ✅ Works with current Vite setup
- ✅ Maintains backward compatibility
- ✅ Simpler testing (visual only)

**Cons:**

- ❌ Can't style SVG internals with CSS
- ❌ Can't animate SVG paths individually
- ❌ No programmatic control of colors

**Best For:**

- Static icons that don't need dynamic styling
- Quick wins with minimal risk

---

### Option B: React Component Pattern (Modern)

**Approach:**

- Convert SVG imports to inline React components
- Use `vite-plugin-svgr` or similar
- Enable CSS styling and animation
- Programmatic control of fill/stroke colors

**Example:**

```typescript
// Before
import iconBrush from "resources/toolbar-icons/brush.svg";
<img src={iconBrush} alt="Brush" />;

// After
import { ReactComponent as IconBrush } from "resources/toolbar-icons/brush.svg";
<IconBrush className="tool-icon" />;
```

**Pros:**

- ✅ Dynamic CSS styling
- ✅ Animations and transitions
- ✅ Programmatic color control
- ✅ Better tree-shaking (unused paths removed)
- ✅ TypeScript integration

**Cons:**

- ❌ Requires code changes in ~50+ files
- ❌ Needs Vite plugin configuration
- ❌ Larger initial bundle (inline SVGs)
- ❌ More complex testing

**Best For:**

- Icons that need theming (dark mode)
- Interactive icons with hover states
- Animated icons

---

### Option C: SVG Sprite Sheet (Advanced)

**Approach:**

- Combine all SVGs into sprite sheet(s)
- Use `<use>` tags to reference sprites
- Single HTTP request for all icons
- CSS-based styling

**Example:**

```typescript
<svg className="icon">
  <use xlinkHref="#icon-brush" />
</svg>
```

**Pros:**

- ✅ Minimal HTTP requests
- ✅ Cacheable sprite sheet
- ✅ CSS styling support
- ✅ Smaller total file size

**Cons:**

- ❌ Complex build process
- ❌ Requires significant refactoring
- ❌ Limited IDE preview support
- ❌ Browser compatibility considerations

**Best For:**

- Performance-critical applications
- Large icon libraries
- Production optimization

---

## 📋 Recommended Approach: **Hybrid Strategy**

### Phase 1: Fix Critical Issues (Week 1) ⚡ **IMMEDIATE**

**Scope:** Fix all malformed SVGs
**Approach:** Option A (Fix-in-Place)
**Risk:** Low
**Impact:** High (prevents rendering bugs)

**Tasks:**

1. Run automated XML validation script
2. Identify all files with missing/malformed tags
3. Fix structural issues (add `<svg>` tags, fix CSS)
4. Validate fixes with `xmllint`
5. Test rendering in browser

**Deliverable:**

- All SVGs are valid XML
- All SVGs render correctly
- `SVG_FIXES.md` documenting changes

---

### Phase 2: Standardize & Optimize (Week 2-3) 🎨

**Scope:** Clean up and optimize all SVGs
**Approach:** Option A + SVGO automation
**Risk:** Low
**Impact:** Medium (file size, consistency)

**Tasks:**

1. Run SVGO on all SVG files
2. Remove unnecessary metadata
3. Standardize `viewBox` attributes
4. Inline CSS styles (remove `.st0` classes)
5. Add accessibility attributes (`<title>`, `<desc>`)
6. Establish naming conventions
7. Create SVG style guide

**Configuration: `.svgorc.js`**

```javascript
module.exports = {
  plugins: [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeEditorsNSData",
    "cleanupAttrs",
    "inlineStyles",
    "removeUselessDefs",
    "cleanupNumericValues",
    "convertColors",
    "removeViewBox", // false if we want to keep viewBox
    {
      name: "addAttributesToSVGElement",
      params: {
        attributes: [{ role: "img" }, { focusable: "false" }],
      },
    },
  ],
};
```

**Deliverable:**

- Optimized SVG files (30-50% size reduction)
- Consistent format across all files
- `SVG_STYLE_GUIDE.md`

---

### Phase 3: Selective Modernization (Week 4-6) 🚀 **OPTIONAL**

**Scope:** Convert specific icons to React components
**Approach:** Option B for targeted icons
**Risk:** Medium
**Impact:** High (enables features)

**Candidates for Conversion:**

1. **Theme-aware icons** (need dark mode support)
   - Tool icons with `-dark` variants
   - Interface elements
2. **Interactive icons** (hover states, animations)
   - Toolbar icons
   - Action buttons
3. **Frequently changed colors** (dynamic styling)
   - Status indicators
   - Object type icons

**Tasks:**

1. Install `vite-plugin-svgr`
2. Configure Vite for dual import patterns
3. Create icon wrapper component
4. Convert priority icons
5. Update TypeScript types
6. Test theme switching
7. Document new pattern

**Vite Configuration:**

```javascript
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      // Enable both import patterns
      include: "**/*.svg",
      svgrOptions: {
        exportType: "named",
        ref: true,
        svgo: false, // We'll handle optimization separately
        titleProp: true,
        descProp: true,
      },
    }),
  ],
});
```

**Usage Pattern:**

```typescript
// URL import (existing)
import iconBrushUrl from "resources/toolbar-icons/brush.svg";

// Component import (new)
import { ReactComponent as IconBrush } from "resources/toolbar-icons/brush.svg?react";

// Wrapper component
const Icon = ({ name, className, ...props }) => {
  const SvgComponent = iconComponents[name];
  return <SvgComponent className={className} {...props} />;
};
```

**Deliverable:**

- 20-30 icons converted to React components
- Type-safe icon component system
- Theme support for key icons
- `REACT_ICONS_GUIDE.md`

---

## 🔧 Implementation Scripts

### Script 1: Audit All SVGs

**File:** `scripts/audit-svgs.js`

```javascript
import fs from "fs";
import path from "path";
import { parseStringPromise } from "xml2js";

const RESOURCES_DIR = "./src/resources";
const issues = [];

async function auditSVG(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const issue = { file: filePath, problems: [] };

  // Check 1: Has XML declaration
  if (!content.startsWith("<?xml")) {
    issue.problems.push("Missing XML declaration");
  }

  // Check 2: Has opening <svg> tag
  if (!content.includes("<svg")) {
    issue.problems.push("CRITICAL: Missing <svg> opening tag");
  }

  // Check 3: Has namespace
  if (!content.includes("xmlns=")) {
    issue.problems.push("Missing xmlns namespace");
  }

  // Check 4: Parse as valid XML
  try {
    await parseStringPromise(content);
  } catch (err) {
    issue.problems.push(`CRITICAL: Invalid XML - ${err.message}`);
  }

  // Check 5: Has viewBox or width/height
  if (!content.includes("viewBox") && !content.includes("width=")) {
    issue.problems.push("Missing viewBox or dimensions");
  }

  // Check 6: Accessibility
  if (!content.includes("<title>")) {
    issue.problems.push("Accessibility: Missing <title>");
  }

  // Check 7: Optimization opportunities
  if (content.includes("Generator: Adobe Illustrator")) {
    issue.problems.push("Optimization: Contains Adobe metadata");
  }

  if (content.match(/class="st\d+"/)) {
    issue.problems.push(
      "Optimization: Uses CSS classes instead of inline styles"
    );
  }

  if (issue.problems.length > 0) {
    issues.push(issue);
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
    } else if (file.endsWith(".svg")) {
      svgs.push(fullPath);
    }
  }

  return svgs;
}

// Run audit
const svgFiles = findSVGs(RESOURCES_DIR);
console.log(`Found ${svgFiles.length} SVG files\n`);

for (const file of svgFiles) {
  await auditSVG(file);
}

// Generate report
const critical = issues.filter((i) =>
  i.problems.some((p) => p.includes("CRITICAL"))
);

console.log(`\n=== AUDIT RESULTS ===`);
console.log(`Total SVGs: ${svgFiles.length}`);
console.log(`Files with issues: ${issues.length}`);
console.log(`Critical issues: ${critical.length}`);

// Write detailed report
fs.writeFileSync(
  "SVG_AUDIT_REPORT.md",
  generateMarkdownReport(issues, svgFiles.length)
);

console.log("\nDetailed report written to SVG_AUDIT_REPORT.md");
```

---

### Script 2: Fix SVG Structure

**File:** `scripts/fix-svgs.js`

```javascript
import fs from "fs";
import path from "path";

const BACKUP_DIR = "./svg-backups";

function fixSVG(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  let fixed = content;
  let changed = false;

  // Fix 1: Add missing <svg> tag
  if (!fixed.includes("<svg")) {
    // Find where to insert <svg> tag
    const xmlDeclEnd = fixed.indexOf("?>");
    const firstTag = fixed.indexOf("<", xmlDeclEnd + 2);

    // Extract viewBox if present
    const viewBoxMatch = fixed.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[0] : 'viewBox="0 0 100 100"';

    const svgTag = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${viewBox} xml:space="preserve">\n`;

    fixed = fixed.slice(0, firstTag) + svgTag + fixed.slice(firstTag);
    changed = true;
  }

  // Fix 2: Fix CSS color values (missing #)
  fixed = fixed.replace(/fill:([0-9A-F]{6});/gi, (match, hex) => {
    changed = true;
    return `fill:#${hex};`;
  });

  // Fix 3: Add closing </svg> if missing
  if (!fixed.includes("</svg>")) {
    fixed += "\n</svg>";
    changed = true;
  }

  if (changed) {
    // Backup original
    const backupPath = path.join(BACKUP_DIR, path.basename(filePath));
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    fs.writeFileSync(backupPath, content);

    // Write fixed version
    fs.writeFileSync(filePath, fixed);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }

  return false;
}

// Usage: node scripts/fix-svgs.js <file-or-directory>
```

---

### Script 3: Optimize with SVGO

**File:** `scripts/optimize-svgs.sh`

```bash
#!/bin/bash

# Install SVGO if not present
if ! command -v svgo &> /dev/null; then
  echo "Installing SVGO..."
  npm install -g svgo
fi

# Create backup
BACKUP_DIR="./svg-backups-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
cp -r ./src/resources/*-icons "$BACKUP_DIR/"

# Optimize all SVGs
echo "Optimizing SVGs..."
svgo -f ./src/resources --recursive \
  --config=.svgorc.js \
  --pretty \
  --indent=2

echo "✅ Optimization complete"
echo "📦 Backups saved to $BACKUP_DIR"

# Report size savings
du -sh "$BACKUP_DIR"
du -sh ./src/resources
```

---

## 📝 SVG Style Guide

**To be created after Phase 2**

### Required Structure

```xml
<?xml version="1.0" encoding="utf-8"?>
<svg
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 100 100"
  role="img"
  aria-labelledby="title-id"
>
  <title id="title-id">Icon Name</title>
  <desc>Brief description for accessibility</desc>
  <!-- Icon content -->
</svg>
```

### Naming Conventions

- `kebab-case` for all filenames
- Descriptive names (e.g., `brush.svg` not `icon1.svg`)
- Variants suffixed: `icon-dark.svg`, `icon-hover.svg`
- Organize by category in subdirectories

### Optimization Rules

- Remove all Adobe Illustrator metadata
- Inline CSS styles (no classes)
- Use `viewBox` instead of fixed dimensions
- Simplify paths with SVGO
- Target < 5KB per icon

### Accessibility

- Always include `<title>` with descriptive text
- Add `role="img"` to root `<svg>`
- Add `aria-labelledby` referencing title ID
- Add `<desc>` for complex icons

---

## 📈 Success Metrics

### Phase 1 (Critical Fixes)

- ✅ 0 SVGs with structural errors
- ✅ 100% XML validation pass rate
- ✅ All icons render in browser

### Phase 2 (Optimization)

- ✅ 30-50% file size reduction
- ✅ 100% SVGs have accessibility attributes
- ✅ Consistent format across all files
- ✅ < 5KB average file size

### Phase 3 (Modernization - Optional)

- ✅ 20-30 icons converted to React components
- ✅ Theme switching works for converted icons
- ✅ Type-safe icon system
- ✅ No runtime errors

---

## ⚠️ Risks & Mitigation

### Risk 1: Breaking Visual Appearance

**Likelihood:** Medium  
**Impact:** High  
**Mitigation:**

- Create backups before any changes
- Visual regression testing with screenshots
- Test in both light and dark themes
- Validate on multiple browsers

### Risk 2: Build Performance Degradation

**Likelihood:** Low (Option A), Medium (Option B)  
**Impact:** Medium  
**Mitigation:**

- Benchmark build times before/after
- Use code splitting for icon components
- Lazy load non-critical icons
- Monitor bundle size

### Risk 3: Unexpected Breaking Changes

**Likelihood:** Low  
**Impact:** High  
**Mitigation:**

- Thorough testing on dev environment
- Gradual rollout (directory by directory)
- Keep backups for quick rollback
- Git commits for each directory/phase

### Risk 4: Developer Confusion

**Likelihood:** Medium (if Option B/C used)  
**Impact:** Medium  
**Mitigation:**

- Clear documentation with examples
- Code comments in modified files
- Team training session
- ESLint rules for consistency

---

## 🗓️ Timeline

### Week 1: Audit & Critical Fixes

- **Day 1-2:** Set up scripts, run audit
- **Day 3-4:** Fix critical issues (malformed SVGs)
- **Day 5:** Testing and validation

### Week 2-3: Optimization

- **Day 6-8:** Configure and run SVGO
- **Day 9-11:** Manual review and cleanup
- **Day 12-13:** Add accessibility attributes
- **Day 14-15:** Create style guide and docs

### Week 4-6: Selective Modernization (Optional)

- **Day 16-18:** Set up vite-plugin-svgr
- **Day 19-25:** Convert priority icons
- **Day 26-30:** Testing and documentation

**Total Estimated Time:**

- Phase 1: 5 days (1 week)
- Phase 2: 10 days (2 weeks)
- Phase 3: 15 days (3 weeks) - Optional
- **Minimum Viable Improvement:** 3 weeks (Phases 1-2 only)

---

## 🚦 Decision Points

### Immediate Action Required

✅ **Approve Phase 1** (Critical Fixes)

- Low risk, high value
- Can start immediately
- Fixes known bugs

### Requires Discussion

🟡 **Approve Phase 2** (Optimization)

- Medium effort, good ROI
- Improves maintainability
- Sets foundation for future work

### Deferred Decision

⚪ **Approve Phase 3** (React Components)

- Significant effort
- Evaluate after Phase 2
- Consider based on feature needs (theming, animations)

---

## 📚 Resources

### Tools

- [SVGO](https://github.com/svg/svgo) - SVG optimization
- [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr) - React component conversion
- [xmllint](http://xmlsoft.org/xmllint.html) - XML validation
- [SVG OMG](https://jakearchibald.github.io/svgomg/) - Online SVG optimizer

### Documentation

- [MDN: SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)
- [Accessible SVGs](https://www.w3.org/WAI/tutorials/images/)
- [SVGO Configuration](https://github.com/svg/svgo#configuration)
- [Vite Asset Handling](https://vitejs.dev/guide/assets.html)

### Examples

- [React SVGR Examples](https://react-svgr.com/docs/options/)
- [SVG Best Practices](https://css-tricks.com/svg-best-practices/)
- [Icon System Patterns](https://www.smashingmagazine.com/2021/05/icon-libraries-react/)

---

## 🎬 Getting Started

### To begin Phase 1 immediately:

```bash
# 1. Create scripts directory
mkdir -p scripts

# 2. Create audit script (copy from above)
nano scripts/audit-svgs.js

# 3. Install dependencies
npm install xml2js

# 4. Run audit
node scripts/audit-svgs.js

# 5. Review SVG_AUDIT_REPORT.md

# 6. Create fix script (copy from above)
nano scripts/fix-svgs.js

# 7. Run fixes on critical files
node scripts/fix-svgs.js src/resources/tool-icons/

# 8. Validate fixes
npm run dev
# Test all icons visually
```

---

**Next Steps:**

1. Review this plan
2. Approve Phase 1 (Critical Fixes)
3. Decide on Phase 2 (Optimization) timeline
4. Defer Phase 3 decision until after Phase 2

**Questions? Concerns?**

- Which phases to prioritize?
- Timeline adjustments needed?
- Additional use cases for React components?

---

**Document Version:** 1.0  
**Last Updated:** October 13, 2025  
**Status:** 📋 Awaiting Approval
