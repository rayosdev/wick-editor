# Engine Vite Migration Plan

## Overview
Migrate the Wick Engine build system from Gulp to Vite for unified build tooling before TypeScript conversion.

**Current State:**
- Engine uses Gulp to bundle libs + source → `wickengine.js`
- Builds into `engine/dist/`
- Copied to `public/corelibs/wick-engine/` for frontend consumption
- Frontend uses Vite and React
- Existing Playwright tests for smoke testing

**Goal:**
- Replace Gulp with Vite for engine builds
- Maintain identical output format (IIFE bundle)
- Ensure frontend continues to work without changes
- Add comprehensive automated testing

---

## Phase 1: Analysis & Preparation

### 1.1 Analyze Current Build Output
**Tasks:**
- [ ] Document the exact structure of `wickengine.js` created by Gulp
- [ ] Identify all files included in the bundle (libs + src)
- [ ] Document the IIFE wrapper and shims added by Gulp
- [ ] Review `emptyproject.html` generation
- [ ] Document file copy operations to `public/`

**Verification:**
```bash
cd engine
npm run build
# Examine dist/wickengine.js structure
# Check all output files: wickengine.js, emptyproject.html, index.html, etc.
```

### 1.2 Review Existing Vite Config
**Tasks:**
- [ ] Review existing `engine/vite.config.cjs`
- [ ] Verify it can produce UMD format
- [ ] Check if `src/index.js` exports all necessary APIs
- [ ] Document gaps between current Vite config and Gulp output

---

## Phase 2: Create Vite Build Configuration

### 2.1 Update Engine Entry Point
**Tasks:**
- [ ] Ensure `engine/src/index.js` properly exports the Wick API
- [ ] Import all necessary lib dependencies in proper order
- [ ] Add build version constant injection
- [ ] Verify all Gulp source files are included

**File:** `engine/src/index.js`

### 2.2 Configure Vite for Library Build
**Tasks:**
- [ ] Update `engine/vite.config.cjs` to match Gulp output:
  - Generate single IIFE bundle
  - Include all libraries inline
  - Add compatibility shims (require, module, exports, etc.)
  - Set correct global exports
  - Generate build version banner
  - Create source maps
- [ ] Configure Rollup options for proper bundling
- [ ] Add Vite plugin for post-processing (emptyproject.html generation)

**Files:**
- `engine/vite.config.cjs`
- `engine/vite.config.d.ts` (optional TypeScript definitions)

### 2.3 Handle Library Dependencies
**Tasks:**
- [ ] Move all `engine/lib/*.js` files to proper module imports OR
- [ ] Configure Vite to bundle them inline in correct order
- [ ] Ensure Paper.js, JSZip, Howler, etc. are included
- [ ] Test that no external dependencies are required at runtime

### 2.4 Browser Compatibility Shims
**Tasks:**
- [ ] Add IIFE wrapper with Node.js shims:
  - `require()` function stub
  - `module`, `exports`, `global`, `self`
  - `console`, `process`, `Buffer`, `__dirname`, `__filename`
- [ ] Add build version banner
- [ ] Add platform.js exposure footer
- [ ] Use Vite banner/footer options or custom plugin

---

## Phase 3: Update Build Scripts

### 3.1 Modify Package Scripts
**Tasks:**
- [ ] Update `engine/package.json`:
  - Keep `build` as primary command
  - Make `build` use `vite build` instead of `gulp`
  - Keep `copy-dist` script unchanged
  - Add `build:watch` for development
  - Add `build:analyze` for bundle analysis
- [ ] Update root `package.json`:
  - Verify `build:engine` still works
  - No changes needed if engine/package.json is correct

**Files:**
- `engine/package.json`
- Root `package.json` (verify only)

### 3.2 Post-Build Processing
**Tasks:**
- [ ] Create Vite plugin or script for:
  - Generating `emptyproject.html` (inject engine into project.html)
  - Copying ZIP export resources (index.html, preloadjs.min.js, project.html)
- [ ] Ensure all dist artifacts match Gulp output exactly

---

## Phase 4: Automated Testing Strategy

### 4.1 Engine Build Verification Tests
**Tasks:**
- [ ] Create test to verify engine builds successfully
- [ ] Create test to verify all expected files are in `dist/`:
  - `wickengine.js`
  - `wickengine.js.map`
  - `emptyproject.html`
  - `index.html`
  - `preloadjs.min.js`
  - `project.html`
- [ ] Create test to verify bundle size is reasonable (not bloated)
- [ ] Create test to verify wickengine.js is valid JavaScript

**File:** `tests/engine-build.test.js` (Vitest)

### 4.2 Engine API Tests
**Tasks:**
- [ ] Create unit tests for engine loading:
  - Verify `window.Wick` is defined
  - Verify core API methods exist
  - Verify version constant is set
- [ ] Test in browser environment using Vitest + jsdom
- [ ] Test engine can create a basic project

**File:** `tests/engine-api.test.js` (Vitest)

### 4.3 Frontend Integration Tests (Playwright)
**Tasks:**
- [ ] Extend existing smoke test:
  - Verify engine loads without errors
  - Check `window.Wick` is available
  - Verify no console errors on load
- [ ] Create canvas interaction test:
  - Wait for editor to fully load
  - Create a new frame
  - Select a tool (pencil, brush)
  - Draw on canvas
  - Verify canvas has content
- [ ] Create timeline interaction test:
  - Add new frame
  - Delete frame
  - Move playhead
  - Verify timeline updates
- [ ] Create project operations test:
  - Create new project
  - Add layer
  - Add clip
  - Verify project structure

**Files:**
- `tests/engine-integration.spec.ts` (Playwright)
- `tests/canvas-interactions.spec.ts` (already exists - enhance)
- `tests/timeline-actions.spec.ts` (new)

### 4.4 Browser Compatibility Tests (Playwright MCP)
**Tasks:**
- [ ] Test in multiple browsers using Playwright projects:
  - Chrome/Chromium
  - Firefox
  - Safari/WebKit
- [ ] Test on mobile viewports
- [ ] Verify engine console output shows no errors

### 4.5 Visual Regression Tests (Optional)
**Tasks:**
- [ ] Take screenshots of canvas after drawing
- [ ] Take screenshots of timeline after interactions
- [ ] Compare with baseline images
- [ ] Store in `test-results/` with failure artifacts

---

## Phase 5: Implementation Steps

### 5.1 Set Up Testing Infrastructure
```bash
# Install test dependencies (already installed)
npm install --save-dev @playwright/test vitest jsdom

# Create test directories
mkdir -p tests/engine
```

### 5.2 Implement Vite Config
**Order:**
1. Create new `engine/vite.config.cjs` (backup old one)
2. Add entry point configuration
3. Add library bundling options
4. Add compatibility shims via banner/footer
5. Create post-build plugin for HTML generation

### 5.3 Update Entry Point
**Order:**
1. Review current `engine/src/index.js`
2. Ensure all exports are present
3. Import libraries in correct order
4. Test build produces output

### 5.4 Write Tests First (TDD)
**Order:**
1. Write engine build verification tests
2. Write engine API tests
3. Write frontend integration tests
4. Run tests against current Gulp build (establish baseline)

### 5.5 Implement Vite Build
**Order:**
1. Configure Vite to produce similar output
2. Run build, compare with Gulp output
3. Iterate until tests pass
4. Fix any differences

### 5.6 Update Build Scripts
**Order:**
1. Update `engine/package.json` scripts
2. Test `npm run build` in engine directory
3. Test `npm run build:engine` from root
4. Verify files copy to `public/` correctly

---

## Phase 6: Verification & Testing

### 6.1 Build Verification
```bash
# Clean slate
rm -rf engine/dist public/corelibs/wick-engine

# Build with Vite
cd engine
npm run build

# Verify output files
ls -lah dist/

# Check file sizes
du -sh dist/wickengine.js
```

### 6.2 Run Automated Tests
```bash
# Unit tests (engine API)
npm run test:unit

# E2E tests (frontend integration)
npm run test:e2e

# Test in all browsers
npm run test:e2e:ci
```

### 6.3 Manual Verification Checklist
- [ ] Start dev server: `npm start`
- [ ] Open browser to http://localhost:3002
- [ ] Verify editor loads without errors
- [ ] Open browser DevTools console
- [ ] Check for no errors or warnings
- [ ] Test basic interactions:
  - [ ] Select Pencil tool
  - [ ] Draw on canvas
  - [ ] Create new frame
  - [ ] Play animation
  - [ ] Add new layer
  - [ ] Upload image asset
  - [ ] Add sound asset
  - [ ] Export project as HTML
  - [ ] Import existing .wick file

### 6.4 Performance Verification
- [ ] Compare bundle size: Gulp vs Vite
- [ ] Check build time: Gulp vs Vite
- [ ] Verify no runtime performance degradation
- [ ] Check memory usage in browser

---

## Phase 7: Cleanup & Documentation

### 7.1 Remove Gulp Dependencies
**Tasks:**
- [ ] Remove gulp dependencies from `engine/package.json`:
  - gulp
  - gulp-babel
  - gulp-concat
  - gulp-header
  - gulp-footer
  - gulp-rename
  - gulp-uglify
  - gulp-typescript
  - merge-stream
- [ ] Remove `engine/gulpfile.js`
- [ ] Run `npm install` to clean up node_modules

### 7.2 Update Documentation
**Tasks:**
- [ ] Update `engine/README.md`:
  - Document new Vite build process
  - Update development instructions
  - Add build commands reference
- [ ] Update root `README.md`:
  - Note unified Vite build system
  - Update build instructions
- [ ] Document test commands in README

### 7.3 Create Migration Summary
**Tasks:**
- [ ] Create `ENGINE_VITE_MIGRATION_COMPLETE.md`:
  - Document changes made
  - List benefits of Vite over Gulp
  - Note any breaking changes (should be none)
  - Include test results
  - Add next steps (TypeScript conversion)

---

## Phase 8: CI/CD Integration

### 8.1 Update CI Pipeline
**Tasks:**
- [ ] Verify CI builds engine correctly
- [ ] Ensure all tests pass in CI
- [ ] Check deployment process still works
- [ ] Update any deployment scripts if needed

---

## Test Implementation Details

### Test 1: Engine Build Test (Vitest)
```javascript
// tests/engine/engine-build.test.js
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Engine Build Output', () => {
  const distPath = path.resolve(__dirname, '../../engine/dist');

  it('creates wickengine.js', () => {
    expect(fs.existsSync(path.join(distPath, 'wickengine.js'))).toBe(true);
  });

  it('creates source map', () => {
    expect(fs.existsSync(path.join(distPath, 'wickengine.js.map'))).toBe(true);
  });

  it('creates emptyproject.html', () => {
    expect(fs.existsSync(path.join(distPath, 'emptyproject.html'))).toBe(true);
  });

  it('wickengine.js contains IIFE wrapper', () => {
    const content = fs.readFileSync(path.join(distPath, 'wickengine.js'), 'utf8');
    expect(content).toContain('(function()');
  });

  it('wickengine.js contains build version', () => {
    const content = fs.readFileSync(path.join(distPath, 'wickengine.js'), 'utf8');
    expect(content).toMatch(/WICK_ENGINE_BUILD_VERSION/);
  });

  it('bundle size is reasonable', () => {
    const stats = fs.statSync(path.join(distPath, 'wickengine.js'));
    const sizeMB = stats.size / 1024 / 1024;
    // Engine should be less than 10MB
    expect(sizeMB).toBeLessThan(10);
  });
});
```

### Test 2: Engine API Test (Vitest)
```javascript
// tests/engine/engine-api.test.js
import { describe, it, expect, beforeAll } from 'vitest';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

describe('Engine API', () => {
  let window;

  beforeAll(() => {
    const enginePath = path.resolve(__dirname, '../../engine/dist/wickengine.js');
    const engineCode = fs.readFileSync(enginePath, 'utf8');
    
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
      runScripts: 'outside-only'
    });
    window = dom.window;
    
    // Execute engine code in window context
    window.eval(engineCode);
  });

  it('defines Wick global', () => {
    expect(window.Wick).toBeDefined();
  });

  it('has Project class', () => {
    expect(window.Wick.Project).toBeDefined();
  });

  it('has Tool classes', () => {
    expect(window.Wick.Tools).toBeDefined();
    expect(window.Wick.Tools.Pencil).toBeDefined();
  });

  it('can create a project', () => {
    const project = new window.Wick.Project();
    expect(project).toBeDefined();
    expect(project.name).toBeDefined();
  });

  it('has build version', () => {
    expect(window.WICK_ENGINE_BUILD_VERSION).toBeDefined();
    expect(typeof window.WICK_ENGINE_BUILD_VERSION).toBe('string');
  });
});
```

### Test 3: Frontend Integration Test (Playwright)
```typescript
// tests/engine-integration.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Engine Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('skipWelcomeMessage', 'true');
    });
    await page.goto('/');
  });

  test('loads engine without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');
    
    // Should have no console errors
    expect(errors).toHaveLength(0);
  });

  test('exposes Wick global API', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const hasWickAPI = await page.evaluate(() => {
      return typeof window.Wick !== 'undefined';
    });
    
    expect(hasWickAPI).toBe(true);
  });

  test('engine version is set', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    const version = await page.evaluate(() => {
      return window.WICK_ENGINE_BUILD_VERSION;
    });
    
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
  });
});
```

### Test 4: Canvas Interaction Test (Playwright)
```typescript
// tests/canvas-interactions.spec.ts (enhance existing)
import { test, expect } from '@playwright/test';

test.describe('Canvas Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('skipWelcomeMessage', 'true');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('can select pencil tool and draw', async ({ page }) => {
    // Select Pencil tool
    await page.click('[data-tool="pencil"]');
    
    // Wait for tool to activate
    await page.waitForTimeout(500);
    
    // Get canvas element
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible();
    
    // Draw a line
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 200, box.y + 200);
      await page.mouse.up();
    }
    
    // Verify something was drawn (check if undo is enabled)
    const undoButton = page.locator('[data-action="undo"]');
    await expect(undoButton).not.toBeDisabled();
  });

  test('can select brush tool and paint', async ({ page }) => {
    await page.click('[data-tool="brush"]');
    await page.waitForTimeout(500);
    
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();
    
    if (box) {
      // Paint a stroke
      await page.mouse.move(box.x + 150, box.y + 150);
      await page.mouse.down();
      for (let i = 0; i < 10; i++) {
        await page.mouse.move(box.x + 150 + i * 10, box.y + 150);
      }
      await page.mouse.up();
    }
    
    const undoButton = page.locator('[data-action="undo"]');
    await expect(undoButton).not.toBeDisabled();
  });
});
```

### Test 5: Timeline Actions Test (Playwright)
```typescript
// tests/timeline-actions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Timeline Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('skipWelcomeMessage', 'true');
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('can add new frame', async ({ page }) => {
    const timeline = page.locator('#animation-timeline-container');
    await expect(timeline).toBeVisible();
    
    // Right-click to add frame (or use button)
    const addFrameButton = page.locator('[data-action="add-frame"]');
    if (await addFrameButton.isVisible()) {
      await addFrameButton.click();
    }
    
    // Verify frame was added by checking frame count
    await page.waitForTimeout(500);
    const frames = page.locator('.timeline-frame');
    const count = await frames.count();
    expect(count).toBeGreaterThan(0);
  });

  test('can add new layer', async ({ page }) => {
    const addLayerButton = page.locator('[data-action="add-layer"]');
    
    if (await addLayerButton.isVisible()) {
      const initialLayers = await page.locator('.timeline-layer').count();
      await addLayerButton.click();
      await page.waitForTimeout(500);
      const newLayers = await page.locator('.timeline-layer').count();
      expect(newLayers).toBe(initialLayers + 1);
    }
  });

  test('playhead moves when playing', async ({ page }) => {
    // Add a second frame first
    const addFrameButton = page.locator('[data-action="add-frame"]');
    if (await addFrameButton.isVisible()) {
      await addFrameButton.click();
      await page.waitForTimeout(500);
    }
    
    // Click play button
    const playButton = page.locator('[data-action="play"]');
    if (await playButton.isVisible()) {
      await playButton.click();
      await page.waitForTimeout(1000);
      
      // Stop playing
      await playButton.click();
    }
    
    // Test passes if no errors occurred
    expect(true).toBe(true);
  });
});
```

---

## Success Criteria

### Must Have
- ✅ Engine builds successfully with Vite
- ✅ Output `wickengine.js` is functionally identical to Gulp version
- ✅ Frontend loads and runs without errors
- ✅ All existing functionality works
- ✅ Build time is same or faster
- ✅ Bundle size is same or smaller
- ✅ Automated tests pass

### Nice to Have
- ✅ Faster build times
- ✅ Better dev experience (HMR for engine changes)
- ✅ Smaller bundle size
- ✅ Better source maps
- ✅ Tree-shaking capabilities (for future use)

---

## Rollback Plan

If Vite migration fails or causes issues:

1. Keep Gulp files in git history
2. Revert `engine/package.json` scripts
3. Revert `engine/vite.config.cjs`
4. Run `npm install` to restore Gulp dependencies
5. Run `npm run build` to verify Gulp still works

---

## Timeline Estimate

- **Phase 1 (Analysis):** 1-2 hours
- **Phase 2 (Config):** 3-4 hours
- **Phase 3 (Scripts):** 1-2 hours
- **Phase 4 (Testing):** 4-6 hours
- **Phase 5 (Implementation):** 4-6 hours
- **Phase 6 (Verification):** 2-3 hours
- **Phase 7 (Cleanup):** 1-2 hours
- **Phase 8 (CI/CD):** 1-2 hours

**Total Estimated Time:** 17-27 hours (2-3 days)

---

## Next Steps After Completion

1. ✅ Engine uses Vite (this plan)
2. 🔜 Convert engine to TypeScript
3. 🔜 Convert frontend to TypeScript (already partially done)
4. 🔜 Full monorepo TypeScript build system
5. 🔜 Consider using a monorepo tool (Turborepo, Nx, etc.)

---

## Notes

- Maintain backward compatibility - frontend should work without changes
- Keep the same public API exposed on `window.Wick`
- Ensure all browser shims are in place for library compatibility
- Test in multiple browsers (Chrome, Firefox, Safari)
- Test on multiple devices (desktop, tablet, mobile)
- Consider using Playwright's MCP server for advanced debugging

