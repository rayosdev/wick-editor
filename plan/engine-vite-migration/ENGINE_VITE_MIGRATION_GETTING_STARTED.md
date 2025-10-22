# Getting Started with Engine Vite Migration

## Pre-Flight Check

Before starting, let's verify the current state:

```bash
# 1. Check current gulp build works
cd /Users/anders/Documents/_Projects/_Web/wick-editor/engine
npm run build

# 2. Verify output
ls -la dist/
# Should see: wickengine.js, emptyproject.html, index.html, etc.

# 3. Check bundle size
du -h dist/wickengine.js

# 4. Run frontend to verify it works
cd /Users/anders/Documents/_Projects/_Web/wick-editor
npm start
# Visit http://localhost:3002
```

## Current Status Analysis

### ✅ What's Already Done
- Entry point exists: `engine/src/index.js`
- All imports are set up correctly
- `Wick.ts` creates the global namespace
- Basic `vite.config.cjs` exists
- Playwright testing infrastructure ready
- Vitest testing infrastructure ready

### ⚠️ What Needs Work
- Vite config doesn't match Gulp output exactly
- Missing browser shims (require, module, exports, etc.)
- Post-build processing (emptyproject.html generation)
- Build version injection
- Tests need to be written

## Step-by-Step Implementation

### Step 1: Baseline Tests (1-2 hours)

First, write tests that pass with the current Gulp build. This gives us a baseline.

#### 1.1 Create test directory structure
```bash
mkdir -p tests/engine
```

#### 1.2 Create build verification test
Create `tests/engine/engine-build.test.js`:

```javascript
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Engine Build Output', () => {
  const distPath = path.resolve(process.cwd(), 'engine/dist');

  beforeAll(() => {
    // Ensure build has run
    if (!fs.existsSync(distPath)) {
      throw new Error('Engine dist/ not found. Run: cd engine && npm run build');
    }
  });

  it('creates wickengine.js', () => {
    const file = path.join(distPath, 'wickengine.js');
    expect(fs.existsSync(file)).toBe(true);
  });

  it('wickengine.js is not empty', () => {
    const file = path.join(distPath, 'wickengine.js');
    const stats = fs.statSync(file);
    expect(stats.size).toBeGreaterThan(100000); // At least 100KB
  });

  it('wickengine.js contains IIFE wrapper', () => {
    const file = path.join(distPath, 'wickengine.js');
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toContain('(function()');
  });

  it('wickengine.js contains build version', () => {
    const file = path.join(distPath, 'wickengine.js');
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toMatch(/WICK_ENGINE_BUILD_VERSION.*=.*["']\d+\.\d+\.\d+/);
  });

  it('creates emptyproject.html', () => {
    const file = path.join(distPath, 'emptyproject.html');
    expect(fs.existsSync(file)).toBe(true);
  });

  it('emptyproject.html contains wickengine', () => {
    const file = path.join(distPath, 'emptyproject.html');
    const content = fs.readFileSync(file, 'utf8');
    expect(content).toContain('WICK_ENGINE_BUILD_VERSION');
  });

  it('bundle size is reasonable', () => {
    const file = path.join(distPath, 'wickengine.js');
    const stats = fs.statSync(file);
    const sizeMB = stats.size / 1024 / 1024;
    console.log(`Bundle size: ${sizeMB.toFixed(2)} MB`);
    expect(sizeMB).toBeLessThan(10); // Less than 10MB
  });
});
```

#### 1.3 Run baseline tests
```bash
cd /Users/anders/Documents/_Projects/_Web/wick-editor
npm run test:unit -- tests/engine
```

These should pass with current Gulp build!

### Step 2: Analyze Gulp Output (30 min)

#### 2.1 Examine the IIFE wrapper
```bash
head -100 engine/dist/wickengine.js > /tmp/wickengine-header.txt
tail -100 engine/dist/wickengine.js > /tmp/wickengine-footer.txt

# Review these files to understand:
# - What shims are added
# - How require() is stubbed
# - How globals are set up
```

#### 2.2 Document findings
Create `engine/GULP_OUTPUT_ANALYSIS.md` with notes on:
- IIFE structure
- Shims added
- Global exports
- Post-processing steps

### Step 3: Configure Vite (2-3 hours)

#### 3.1 Backup existing config
```bash
cd engine
cp vite.config.cjs vite.config.cjs.backup
```

#### 3.2 Create new Vite config

Edit `engine/vite.config.cjs`:

```javascript
const path = require('path');
const fs = require('fs');

// Generate build version
const date = new Date();
const buildVersion = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;

// Banner with browser shims (matches Gulp)
const banner = `(function() {
// Browser compatibility shims
var require = function(moduleName) {
  // Handle common Node.js modules
  if (moduleName === 'acorn') return { parse: function() { return {}; } };
  if (moduleName === 'jquery') return window.jQuery || window.$ || { fn: {} };
  if (moduleName === './node/self.js') return window;
  if (moduleName === './node/extend.js') return function(obj) { return obj; };
  if (moduleName === './intersect.js') return {};
  if (moduleName === './grid.js') return {};
  if (moduleName === './format.js') return {};
  if (moduleName === './convex.js') return {};
  if (moduleName === './utils') return {};
  if (moduleName === './support') return {};
  // JSZip related modules
  if (moduleName === './external') return {};
  if (moduleName === './stream/DataWorker') return function() {};
  if (moduleName === './stream/DataLengthProbe') return function() {};
  if (moduleName === './stream/Crc32Probe') return function() {};
  if (moduleName === './stream/GenericWorker') return function() {};
  if (moduleName === './flate') return {};
  if (moduleName === 'lie') return { Promise: window.Promise || function() {} };
  if (moduleName === 'pako') return {};
  if (moduleName === '../stream/GenericWorker') return function() {};
  if (moduleName === '../utf8') return {};
  if (moduleName === '../crc32') return {};
  if (moduleName === '../signature') return {};
  if (moduleName === '../compressions') return {};
  if (moduleName === './ZipFileWorker') return function() {};
  if (moduleName === './object') return {};
  if (moduleName === '../utils') return {};
  if (moduleName === '../stream/GenericWorker') return function() {};
  if (moduleName === '../utf8') return {};
  // Default fallback
  return {};
};
var module = { exports: {} };
var exports = module.exports;
var global = window;
var self = window;
if (typeof console === "undefined") { var console = { log: function() {}, error: function() {} }; }
if (typeof process === "undefined") { var process = { env: {} }; }
if (typeof Buffer === "undefined") { var Buffer = function() {}; }
if (typeof __dirname === "undefined") { var __dirname = ""; }
if (typeof __filename === "undefined") { var __filename = ""; }

/*Wick Engine https://github.com/Wicklets/wick-engine*/
var WICK_ENGINE_BUILD_VERSION = "${buildVersion}";

`;

// Footer to expose platform and close IIFE
const footer = `
// Expose platform if it was exported
try {
  if (typeof window !== "undefined") {
    if (typeof module !== "undefined" && module && module.exports) {
      if (!window.platform && module.exports && (module.exports.name || module.exports.os)) {
        window.platform = module.exports;
      }
    }
    try {
      if (!window.platform && exports && (exports.name || exports.os)) {
        window.platform = exports;
      }
    } catch (e) {}

    try {
      if (window.platform && !window.platform.os) {
        window.platform.os = { architecture: null, family: null, version: null };
      }
    } catch (e) {}
  }
} catch (e) {}

})(); // End IIFE wrapper
`;

/**
 * Vite plugin to handle post-build processing
 */
function postBuildPlugin() {
  return {
    name: 'post-build',
    closeBundle() {
      const distPath = path.resolve(__dirname, 'dist');
      
      // Generate emptyproject.html
      const projectHtml = fs.readFileSync(
        path.resolve(__dirname, 'src/export/html/project.html'),
        'utf8'
      );
      const engineSrc = fs.readFileSync(
        path.resolve(distPath, 'wickengine.js'),
        'utf8'
      );
      
      // Escape $ in replacement string
      const engineSrcSafe = engineSrc.replace(/\$/g, '$$$$');
      const emptyProjectHtml = projectHtml.replace(
        '<!--INJECT_WICKENGINE_HERE-->',
        engineSrcSafe
      );
      
      fs.writeFileSync(
        path.resolve(distPath, 'emptyproject.html'),
        emptyProjectHtml
      );
      
      // Copy ZIP export resources
      const zipIndex = fs.readFileSync(
        path.resolve(__dirname, 'src/export/zip/index.html'),
        'utf8'
      );
      const preloadJs = fs.readFileSync(
        path.resolve(__dirname, 'src/export/zip/preloadjs.min.js'),
        'utf8'
      );
      
      fs.writeFileSync(path.resolve(distPath, 'index.html'), zipIndex);
      fs.writeFileSync(path.resolve(distPath, 'preloadjs.min.js'), preloadJs);
      fs.writeFileSync(path.resolve(distPath, 'project.html'), projectHtml);
      
      console.log('✓ Post-build processing complete');
      console.log('  - emptyproject.html generated');
      console.log('  - ZIP export resources copied');
    }
  };
}

module.exports = {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'Wick',
      fileName: () => 'wickengine.js',
      formats: ['iife']
    },
    outDir: 'dist',
    rollupOptions: {
      output: {
        banner,
        footer,
        format: 'iife',
        name: 'Wick',
        inlineDynamicImports: true,
        // Don't add extra wrappers
        extend: false,
        globals: {
          window: 'window'
        }
      },
      // Suppress warnings
      onwarn(warning, warn) {
        // Suppress 'this is undefined' warning
        if (warning.code === 'THIS_IS_UNDEFINED') return;
        warn(warning);
      }
    },
    minify: false,
    sourcemap: true,
    // Ensure all dependencies are bundled
    commonjsOptions: {
      include: [/node_modules/, /lib/]
    }
  },
  plugins: [
    postBuildPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
};
```

#### 3.3 Test the new config
```bash
cd engine

# Clean dist
rm -rf dist/

# Build with Vite
npm run build:vite

# Check output
ls -la dist/

# Compare with Gulp output
echo "=== Gulp build size ==="
du -h dist-gulp/wickengine.js

echo "=== Vite build size ==="
du -h dist/wickengine.js
```

### Step 4: Fix Entry Point (30 min)

The current `engine/src/index.js` has duplicate imports. Clean it up:

```javascript
// Wick Engine Entry Point for Vite
// This file ensures all modules are bundled in the correct order

// 1. Initialize Wick namespace
import "./Wick.ts";

// 2. Load all libraries in order
import "../lib/paper.js";
import "../lib/base64-arraybuffer.js";
import "../lib/convert-range.js";
import "../lib/croquis.js";
import "../lib/currentTransform.js";
import "../lib/esprima.js";
import "../lib/floodfill.min.js";
import "../lib/howler.js";
import "../lib/hull.js";
import "../lib/invert.min.js";
import "../lib/invert-shim.js";
import "../lib/is-var-name.js";
import "../lib/jszip.js";
import "../lib/lerp.js";
import "../lib/localforage.min.js";
import "../lib/platform.js";
import "../lib/potrace.js";
import "../lib/reserved-words.js";
import "../lib/roundRect.js";
import "../lib/timestamp.js";
import "../lib/soundcloud-waveform.js";
import "../lib/Tween.js";
import "../lib/uuid.js";

// 3. Load all source files in correct order
import "./Clipboard.js";
import "./Color.js";
import "./FileCache.js";
import "./History.js";
import "./ObjectCache.js";
import "./Transformation.js";
import "./ToolSettings.js";
import "./GlobalAPI.js";
import "./builtinassets/BuiltinAssets.js";
import "./export/ExportUtils.js";
import "./export/audio/AudioTrack.js";
import "./export/autosave/AutoSave.js";
import "./export/wick/WickFile.js";
import "./export/wick/WickFile.Alpha.js";
import "./export/wickobj/WickObjectFile.js";
import "./export/html/HTMLExport.js";
import "./export/html/HTMLPreview.js";
import "./export/svg/SvgFile.js";
import "./export/image/ImageSequence.js";
import "./export/zip/ZIPExport.js";
import "./base/Base.js";
import "./base/Layer.js";
import "./base/Project.js";
import "./base/Selection.js";
import "./base/Timeline.js";
import "./base/Tween.js";
import "./base/Path.js";
import "./base/asset/Asset.js";
import "./base/asset/FileAsset.js";
import "./base/asset/FontAsset.js";
import "./base/asset/ImageAsset.js";
import "./base/asset/ClipAsset.js";
import "./base/asset/GIFAsset.js";
import "./base/asset/SoundAsset.js";
import "./base/asset/SVGAsset.js";
import "./base/Tickable.js";
import "./base/Frame.js";
import "./base/Clip.js";
import "./base/Button.js";
import "./tools/Tool.js";
import "./tools/Brush.js";
import "./tools/Cursor.js";
import "./tools/Ellipse.js";
import "./tools/Eraser.js";
import "./tools/Eyedropper.js";
import "./tools/FillBucket.js";
import "./tools/Interact.js";
import "./tools/Line.js";
import "./tools/None.js";
import "./tools/Pan.js";
import "./tools/PathCursor.js";
import "./tools/Pencil.js";
import "./tools/Rectangle.js";
import "./tools/Text.js";
import "./tools/Zoom.js";
import "./view/paper-ext/Layer.erase.js";
import "./view/paper-ext/Paper.hole.js";
import "./view/paper-ext/Paper.OrderingUtils.js";
import "./view/paper-ext/Paper.SelectionWidget.js";
import "./view/paper-ext/Paper.SelectionBox.js";
import "./view/paper-ext/Path.potrace.js";
import "./view/paper-ext/TextItem.edit.js";
import "./view/paper-ext/View.pressure.js";
import "./view/paper-ext/View.gestures.js";
import "./view/paper-ext/View.scrollToZoom.js";
import "./view/View.js";
import "./view/View.Project.js";
import "./view/View.Selection.js";
import "./view/View.Clip.js";
import "./view/View.Button.js";
import "./view/View.Timeline.js";
import "./view/View.Layer.js";
import "./view/View.Frame.js";
import "./view/View.Path.js";
import "./gui/GUIElement.js";
import "./gui/Button.js";
import "./gui/Ghost.js";
import "./gui/Icons.js";
import "./gui/ActionButton.js";
import "./gui/ActionButtonsContainer.js";
import "./gui/Breadcrumbs.js";
import "./gui/BreadcrumbsButton.js";
import "./gui/Frame.js";
import "./gui/FrameEdgeGhost.js";
import "./gui/FrameGhost.js";
import "./gui/FramesContainer.js";
import "./gui/Layer.js";
import "./gui/LayerButton.js";
import "./gui/LayerCreateLabel.js";
import "./gui/LayersContainer.js";
import "./gui/NumberLine.js";
import "./gui/OnionSkinRange.js";
import "./gui/Playhead.js";
import "./gui/PopupMenu.js";
import "./gui/Project.js";
import "./gui/Scrollbar.js";
import "./gui/ScrollbarGrabber.js";
import "./gui/SelectionBox.js";
import "./gui/Timeline.js";
import "./gui/Tooltip.js";
import "./gui/Tween.js";
import "./gui/TweenGhost.js";

console.log("Wick Engine loaded via Vite build system");

// Re-export window.Wick for module consumers
export default (typeof window !== 'undefined' ? window.Wick : {});
```

### Step 5: Update Build Scripts (15 min)

Edit `engine/package.json`:

```json
{
  "scripts": {
    "build": "vite build && npm run copy-dist",
    "build:gulp": "gulp && npm run copy-dist",
    "build:watch": "vite build --watch",
    "build:analyze": "vite build --mode analyze",
    "copy-dist": "mkdir -p ../public/corelibs/wick-engine && cp -a dist/. ../public/corelibs/wick-engine/",
    "generate-docs": "jsdoc -c jsdocs.json -r src/ -d docs/; cp -r docs/* ../../wick-editor-docs/; cd ../../wick-editor-docs; git add .; git commit -m 'update docs'; git push --force;"
  }
}
```

Note: `build:gulp` is kept as backup during migration.

### Step 6: Run Tests (30 min)

```bash
# Run build verification tests
cd /Users/anders/Documents/_Projects/_Web/wick-editor
npm run test:unit -- tests/engine

# If tests fail, compare outputs:
diff engine/dist/wickengine.js engine/dist-gulp/wickengine.js
```

### Step 7: Frontend Integration Tests (1 hour)

Create `tests/engine-integration.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Engine Integration - Vite Build', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('skipWelcomeMessage', 'true');
    });
  });

  test('engine loads without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    expect(errors.filter(e => !e.includes('DevTools'))).toHaveLength(0);
  });

  test('Wick global API is defined', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const hasWick = await page.evaluate(() => typeof window.Wick !== 'undefined');
    expect(hasWick).toBe(true);
    
    const wickKeys = await page.evaluate(() => Object.keys(window.Wick));
    expect(wickKeys.length).toBeGreaterThan(0);
  });

  test('engine version is set', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const version = await page.evaluate(() => window.WICK_ENGINE_BUILD_VERSION);
    expect(version).toBeDefined();
    expect(version).toMatch(/\d+\.\d+\.\d+/);
  });

  test('can create a Wick project', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const canCreate = await page.evaluate(() => {
      try {
        const project = new window.Wick.Project();
        return project !== null && project !== undefined;
      } catch (e) {
        return false;
      }
    });
    
    expect(canCreate).toBe(true);
  });
});
```

Run it:
```bash
npm run test:e2e:headed
```

### Step 8: Switch Over (5 min)

When all tests pass:

```bash
# Update engine/package.json to use Vite by default
# (already done in Step 5)

# Remove Gulp as backup
cd engine
npm uninstall gulp gulp-babel gulp-concat gulp-header gulp-footer gulp-rename gulp-uglify gulp-typescript merge-stream

# Remove gulpfile
rm gulpfile.js

# Commit changes
git add .
git commit -m "feat: migrate engine from Gulp to Vite"
```

## Troubleshooting Guide

### Issue: "require is not defined"

**Solution:** Check that the banner in `vite.config.cjs` includes the `require()` shim.

### Issue: "window.Wick is undefined"

**Solution:** 
1. Check that `Wick.ts` assigns to `window.Wick`
2. Verify the Vite config uses `format: 'iife'`
3. Check the banner doesn't override `window`

### Issue: "Module not found" errors

**Solution:**
1. Check all imports in `index.js` have correct paths
2. Verify all lib files exist in `engine/lib/`
3. Check for typos in file names

### Issue: Bundle is much larger than Gulp

**Solution:**
1. Check `inlineDynamicImports: true` is set
2. Verify `minify` settings
3. Compare number of included files

### Issue: Tests fail with "canvas is undefined"

**Solution:**
1. Install canvas support: `npm install canvas`
2. Or mock canvas in tests
3. Or use Playwright for canvas tests

### Issue: Frontend doesn't load engine

**Solution:**
1. Check `public/corelibs/wick-engine/wickengine.js` exists
2. Verify copy-dist script ran
3. Check browser DevTools Network tab for 404s

## Quick Commands Reference

```bash
# Build engine with Vite
cd engine && npm run build

# Build and watch
cd engine && npm run build:watch

# Copy to public
cd engine && npm run copy-dist

# Build from root
npm run build:engine

# Full build (engine + frontend)
npm run build

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Start dev server
npm start
```

## Success Checklist

- [ ] Build verification tests pass
- [ ] Engine API tests pass
- [ ] Frontend integration tests pass
- [ ] Manual testing confirms functionality
- [ ] Bundle size is acceptable
- [ ] Build time is acceptable
- [ ] No console errors in browser
- [ ] Can draw on canvas
- [ ] Can add/remove frames
- [ ] Can export projects

## Next Steps

After successful migration:

1. ✅ Document the changes
2. ✅ Update README files
3. ✅ Create completion summary
4. 🔜 Begin TypeScript conversion
5. 🔜 Optimize bundle size
6. 🔜 Add HMR for faster dev

---

**Created:** October 22, 2025
**Author:** AI Assistant
**Status:** Ready to implement

