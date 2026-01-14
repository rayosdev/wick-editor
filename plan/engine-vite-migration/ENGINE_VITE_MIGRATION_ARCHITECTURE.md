# Engine Vite Migration - Architecture Overview

## Current State (Gulp)

```
┌─────────────────────────────────────────────────────────────────┐
│                       PROJECT ROOT                               │
│                                                                  │
│  ┌────────────────────┐          ┌──────────────────────┐      │
│  │                    │          │                      │      │
│  │   FRONTEND (Vite)  │◄─────────│  PUBLIC/             │      │
│  │   - React          │ imports  │  corelibs/           │      │
│  │   - TypeScript     │          │  wick-engine/        │      │
│  │   - Vite           │          │  wickengine.js       │      │
│  │                    │          │                      │      │
│  └────────────────────┘          └──────────▲───────────┘      │
│                                              │                   │
│                                              │ copy              │
│                                              │                   │
│  ┌──────────────────────────────────────────┴────────────────┐  │
│  │              ENGINE (Gulp)                                 │  │
│  │                                                            │  │
│  │  ┌─────────────┐                                          │  │
│  │  │   src/      │                                          │  │
│  │  │   ├─ Wick.ts│                                          │  │
│  │  │   ├─ base/  │                                          │  │
│  │  │   ├─ tools/ │                                          │  │
│  │  │   ├─ view/  │                                          │  │
│  │  │   └─ gui/   │                                          │  │
│  │  └──────┬──────┘                                          │  │
│  │         │                                                  │  │
│  │  ┌──────▼──────┐                                          │  │
│  │  │   lib/      │                                          │  │
│  │  │   ├─ paper.js                                          │  │
│  │  │   ├─ jszip.js                                          │  │
│  │  │   ├─ howler.js                                         │  │
│  │  │   └─ (20+ libs)                                        │  │
│  │  └──────┬──────┘                                          │  │
│  │         │                                                  │  │
│  │         ▼                                                  │  │
│  │  ┌─────────────────────────────────────┐                 │  │
│  │  │         GULPFILE.JS                  │                 │  │
│  │  │                                      │                 │  │
│  │  │  1. Concat libs → libs.js           │                 │  │
│  │  │  2. Concat src → src.js             │                 │  │
│  │  │  3. Merge streams                   │                 │  │
│  │  │  4. Add IIFE wrapper                │                 │  │
│  │  │  5. Add require() shims             │                 │  │
│  │  │  6. Add build version               │                 │  │
│  │  │  7. Add platform.js footer          │                 │  │
│  │  │  8. Write wickengine.js             │                 │  │
│  │  │  9. Generate emptyproject.html      │                 │  │
│  │  │ 10. Copy ZIP resources              │                 │  │
│  │  │                                      │                 │  │
│  │  └────────────────┬─────────────────────                 │  │
│  │                   │                                       │  │
│  │                   ▼                                       │  │
│  │  ┌─────────────────────────────────────┐                 │  │
│  │  │          dist/                       │                 │  │
│  │  │          ├─ wickengine.js            │                 │  │
│  │  │          ├─ emptyproject.html        │                 │  │
│  │  │          ├─ index.html               │                 │  │
│  │  │          ├─ preloadjs.min.js         │                 │  │
│  │  │          └─ project.html             │                 │  │
│  │  └─────────────────────────────────────┘                 │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Target State (Vite)

```
┌─────────────────────────────────────────────────────────────────┐
│                       PROJECT ROOT                               │
│                   (Unified Vite Build System)                    │
│                                                                  │
│  ┌────────────────────┐          ┌──────────────────────┐      │
│  │                    │          │                      │      │
│  │   FRONTEND (Vite)  │◄─────────│  PUBLIC/             │      │
│  │   - React          │ imports  │  corelibs/           │      │
│  │   - TypeScript     │          │  wick-engine/        │      │
│  │   - Vite           │          │  wickengine.js       │      │
│  │                    │          │                      │      │
│  └────────────────────┘          └──────────▲───────────┘      │
│                                              │                   │
│                                              │ copy              │
│                                              │                   │
│  ┌──────────────────────────────────────────┴────────────────┐  │
│  │              ENGINE (Vite)                ✨ NEW            │  │
│  │                                                            │  │
│  │  ┌─────────────────────┐                                  │  │
│  │  │   src/index.js      │                                  │  │
│  │  │   (Entry Point)     │                                  │  │
│  │  │                     │                                  │  │
│  │  │   import './Wick.ts'                                   │  │
│  │  │   import '../lib/*' │                                  │  │
│  │  │   import './base/*' │                                  │  │
│  │  │   import './tools/*'│                                  │  │
│  │  │   import './view/*' │                                  │  │
│  │  │   import './gui/*'  │                                  │  │
│  │  │                     │                                  │  │
│  │  └──────────┬──────────┘                                  │  │
│  │             │                                              │  │
│  │             ▼                                              │  │
│  │  ┌─────────────────────────────────────┐                 │  │
│  │  │      VITE.CONFIG.CJS                 │                 │  │
│  │  │                                      │                 │  │
│  │  │  Build Config:                      │                 │  │
│  │  │  - format: 'iife'                   │                 │  │
│  │  │  - name: 'Wick'                     │                 │  │
│  │  │  - banner: (require shims)          │                 │  │
│  │  │  - footer: (platform export)        │                 │  │
│  │  │                                      │                 │  │
│  │  │  Plugins:                            │                 │  │
│  │  │  - postBuildPlugin()                │                 │  │
│  │  │    ├─ Generate emptyproject.html    │                 │  │
│  │  │    └─ Copy ZIP resources            │                 │  │
│  │  │                                      │                 │  │
│  │  │  Rollup Options:                    │                 │  │
│  │  │  - inlineDynamicImports: true       │                 │  │
│  │  │  - sourcemap: true                  │                 │  │
│  │  │  - minify: false                    │                 │  │
│  │  │                                      │                 │  │
│  │  └────────────────┬─────────────────────                 │  │
│  │                   │                                       │  │
│  │                   ▼                                       │  │
│  │  ┌─────────────────────────────────────┐                 │  │
│  │  │          dist/                       │                 │  │
│  │  │          ├─ wickengine.js            │                 │  │
│  │  │          ├─ wickengine.js.map        │                 │  │
│  │  │          ├─ emptyproject.html        │                 │  │
│  │  │          ├─ index.html               │                 │  │
│  │  │          ├─ preloadjs.min.js         │                 │  │
│  │  │          └─ project.html             │                 │  │
│  │  └─────────────────────────────────────┘                 │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Build Flow Comparison

### Gulp Build Flow (Old)

```
Step 1: Read lib files (20+)
   ↓
Step 2: Concat libs → libs.js (in memory)
   ↓
Step 3: Read src files (100+) in specific order
   ↓
Step 4: Transpile TypeScript → JavaScript
   ↓
Step 5: Transpile with Babel
   ↓
Step 6: Concat src → src.js (in memory)
   ↓
Step 7: Merge libs.js + src.js
   ↓
Step 8: Add IIFE header:
        (function() {
          var require = ...
          var module = ...
          var exports = ...
          var WICK_ENGINE_BUILD_VERSION = "...";
   ↓
Step 9: Add footer:
        try { window.platform = ... } catch {}
        })();
   ↓
Step 10: Write dist/wickengine.js
   ↓
Step 11: Read project.html template
   ↓
Step 12: Inject wickengine.js into template
   ↓
Step 13: Write dist/emptyproject.html
   ↓
Step 14: Copy ZIP export resources
   ↓
DONE ✓
```

### Vite Build Flow (New)

```
Step 1: Read src/index.js (entry point)
   ↓
Step 2: Resolve all imports:
        - ./Wick.ts
        - ../lib/*.js (all libraries)
        - ./base/**/*.js (all source files)
        - ./tools/**/*.js
        - ./view/**/*.js
        - ./gui/**/*.js
   ↓
Step 3: Transpile TypeScript → JavaScript (Wick.ts)
   ↓
Step 4: Bundle everything with Rollup:
        - Inline all imports
        - Tree-shake unused code (if enabled)
        - Resolve dependencies
   ↓
Step 5: Apply Rollup transforms:
        - Add banner (IIFE header + shims)
        - Add footer (platform export + close IIFE)
   ↓
Step 6: Generate source map
   ↓
Step 7: Write dist/wickengine.js + .map
   ↓
Step 8: Run postBuildPlugin:
        - Read project.html template
        - Inject wickengine.js
        - Write emptyproject.html
        - Copy ZIP resources
   ↓
DONE ✓
```

## Testing Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                      TEST PYRAMID                              │
│                                                                │
│                         ╱╲                                     │
│                        ╱  ╲                                    │
│                       ╱ E2E╲      Playwright                  │
│                      ╱      ╲     Browser Tests               │
│                     ╱────────╲    - Canvas interactions       │
│                    ╱          ╲   - Timeline actions          │
│                   ╱            ╲  - Tool selection            │
│                  ╱──────────────╲ - Project operations        │
│                 ╱                ╲                             │
│                ╱  INTEGRATION     ╲  Playwright               │
│               ╱────────────────────╲ - Engine loads           │
│              ╱                      ╲- Wick API exists        │
│             ╱          API           ╲- No console errors     │
│            ╱──────────────────────────╲                       │
│           ╱                            ╲ Vitest + JSDOM       │
│          ╱           BUILD              ╲- window.Wick        │
│         ╱────────────────────────────────╲- Can create project│
│        ╱                                  ╲                    │
│       ╱          FILE VERIFICATION         ╲ Vitest           │
│      ╱────────────────────────────────────────╲- Files exist  │
│     ╱                                          ╲- Valid JS    │
│    ╱              UNIT TESTS                    ╲- Bundle size│
│   ╱─────────────────────────────────────────────────╲         │
│                                                                │
│  Test Layers:                                                 │
│  1. Build Verification (Fast, Many)                           │
│  2. API Tests (Medium Speed, Moderate)                        │
│  3. Integration Tests (Medium Speed, Moderate)                │
│  4. E2E Tests (Slow, Few)                                     │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

## File Structure Changes

### Before (Gulp)

```
engine/
├── gulpfile.js           ← Build configuration
├── package.json          ← npm scripts use gulp
├── src/
│   ├── Wick.ts
│   ├── base/
│   ├── tools/
│   ├── view/
│   └── gui/
├── lib/
│   ├── paper.js
│   ├── jszip.js
│   └── (20+ more)
└── dist/
    ├── wickengine.js     ← Generated by Gulp
    └── emptyproject.html
```

### After (Vite)

```
engine/
├── vite.config.cjs       ← Build configuration ✨
├── package.json          ← npm scripts use vite ✨
├── src/
│   ├── index.js          ← Entry point ✨
│   ├── Wick.ts
│   ├── base/
│   ├── tools/
│   ├── view/
│   └── gui/
├── lib/                  (unchanged)
│   ├── paper.js
│   ├── jszip.js
│   └── (20+ more)
└── dist/
    ├── wickengine.js     ← Generated by Vite
    ├── wickengine.js.map ← Source map ✨
    └── emptyproject.html
```

## Data Flow Diagram

### Engine Loading in Browser

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                               │
│                                                              │
│  1. Page loads index.html                                   │
│     ↓                                                        │
│  2. Browser requests /corelibs/wick-engine/wickengine.js    │
│     ↓                                                        │
│  3. wickengine.js executes:                                 │
│     ┌─────────────────────────────────────┐                │
│     │ (function() {                        │                │
│     │   // Shims                           │                │
│     │   var require = function() {...};    │                │
│     │   var module = {exports: {}};        │                │
│     │   var exports = module.exports;      │                │
│     │   var WICK_ENGINE_BUILD_VERSION ="";│                │
│     │                                      │                │
│     │   // Libs execute                    │                │
│     │   Paper.js code...                   │                │
│     │   JSZip code...                      │                │
│     │   Howler code...                     │                │
│     │                                      │                │
│     │   // Engine code executes            │                │
│     │   Wick namespace created             │                │
│     │   window.Wick = {...};               │                │
│     │   Wick.Project = class {...};        │                │
│     │   Wick.Tools = {...};                │                │
│     │                                      │                │
│     │   // Expose platform                 │                │
│     │   window.platform = ...;             │                │
│     │ })();                                │                │
│     └─────────────────────────────────────┘                │
│     ↓                                                        │
│  4. window.Wick is now available                            │
│     ↓                                                        │
│  5. Frontend React app starts                               │
│     ↓                                                        │
│  6. Editor initializes: new Wick.Project()                  │
│     ↓                                                        │
│  7. User interacts with editor                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Build Performance Comparison

### Gulp (Expected)

```
Clean Build:  ~30 seconds
Rebuild:      ~30 seconds (no cache)
Watch:        Not available
Bundle Size:  ~4MB
Source Maps:  No
```

### Vite (Expected)

```
Clean Build:  ~20-30 seconds
Rebuild:      ~2-5 seconds (with cache)
Watch:        ~1-2 seconds (HMR)
Bundle Size:  ~3.5-4MB (similar or smaller)
Source Maps:  Yes (.map file)
```

## Development Workflow

### Before (Gulp)

```
1. Edit engine source file
   ↓
2. Run: cd engine && npm run build
   ↓ (wait 30s)
3. Run: npm run copy-dist
   ↓
4. Refresh browser
   ↓
5. Check if it works
   ↓
6. If bug → go to step 1
```

### After (Vite)

```
Option A: Manual Build (Same as Before)
1. Edit engine source file
   ↓
2. Run: cd engine && npm run build
   ↓ (wait 20s)
3. Run: npm run copy-dist
   ↓
4. Refresh browser
   ↓
5. Check if it works

Option B: Watch Mode (New!)
1. Run: cd engine && npm run build:watch
   ↓
2. Edit engine source file
   ↓ (auto rebuild in ~2s)
3. Run: npm run copy-dist (or automate)
   ↓
4. Refresh browser
   ↓
5. Check if it works

Option C: Future HMR (After More Work)
1. Configure HMR
   ↓
2. Edit engine source
   ↓ (auto rebuild + auto refresh)
3. See changes instantly!
```

## Module Dependency Graph

```
                    ┌───────────────┐
                    │  index.js     │
                    │  (Entry)      │
                    └───────┬───────┘
                            │
                    ┌───────┴────────┐
                    │                │
            ┌───────▼──────┐   ┌────▼──────┐
            │   Wick.ts    │   │   libs/   │
            │ (Namespace)  │   │  (20+ js) │
            └───────┬──────┘   └───────────┘
                    │
        ┌───────────┼───────────┬───────────┬──────────┐
        │           │           │           │          │
    ┌───▼───┐  ┌───▼───┐  ┌────▼────┐ ┌────▼────┐ ┌──▼───┐
    │ base/ │  │tools/ │  │  view/  │ │  gui/   │ │export│
    │       │  │       │  │         │ │         │ │      │
    │ 20 JS │  │ 10 JS │  │  15 JS  │ │  25 JS  │ │ 12 JS│
    └───────┘  └───────┘  └─────────┘ └─────────┘ └──────┘
```

## Bundle Composition

### Gulp Bundle (wickengine.js)

```
┌──────────────────────────────────────────┐
│          IIFE WRAPPER START              │
│  - require() shim                        │
│  - module/exports shims                  │
│  - global/self/window aliases            │
│  - WICK_ENGINE_BUILD_VERSION             │
├──────────────────────────────────────────┤
│          LIBRARIES (~60%)                │
│  - Paper.js (largest)                    │
│  - JSZip                                 │
│  - Howler                                │
│  - Platform.js                           │
│  - (17 more libs)                        │
├──────────────────────────────────────────┤
│          ENGINE SOURCE (~40%)            │
│  - Wick namespace                        │
│  - Base classes                          │
│  - Tools                                 │
│  - View/GUI                              │
│  - Export utilities                      │
├──────────────────────────────────────────┤
│          IIFE WRAPPER END                │
│  - Platform exposure                     │
│  - Close IIFE                            │
└──────────────────────────────────────────┘
Total: ~4MB
```

### Vite Bundle (wickengine.js)

```
┌──────────────────────────────────────────┐
│          BANNER (vite config)            │
│  - IIFE start                            │
│  - require() shim                        │
│  - module/exports shims                  │
│  - global/self/window aliases            │
│  - WICK_ENGINE_BUILD_VERSION             │
├──────────────────────────────────────────┤
│       BUNDLED CODE (Rollup)              │
│  - All imports resolved                  │
│  - Libraries inlined                     │
│  - Source files inlined                  │
│  - Tree-shaking applied (optional)       │
│  - Dependencies optimized                │
├──────────────────────────────────────────┤
│          FOOTER (vite config)            │
│  - Platform exposure                     │
│  - IIFE end                              │
└──────────────────────────────────────────┘
Total: ~3.5-4MB (similar or smaller)
```

## Benefits Summary

```
┌──────────────────────────┬──────────────┬──────────────┐
│         Metric           │     Gulp     │     Vite     │
├──────────────────────────┼──────────────┼──────────────┤
│ Build Time (clean)       │    ~30s      │    ~20-30s   │
│ Build Time (rebuild)     │    ~30s      │    ~2-5s     │
│ Watch Mode               │     No       │     Yes      │
│ Source Maps              │     No       │     Yes      │
│ Bundle Size              │    ~4MB      │    ~3.5-4MB  │
│ Tree Shaking             │     No       │  Yes (future)│
│ HMR Support              │     No       │  Yes (future)│
│ TypeScript Support       │   Limited    │   Excellent  │
│ Modern Syntax            │   Limited    │   Excellent  │
│ Plugin Ecosystem         │   Limited    │   Extensive  │
│ Maintenance              │   Manual     │   Automatic  │
│ Dev Experience           │   OK         │   Great      │
└──────────────────────────┴──────────────┴──────────────┘
```

## Risk Assessment

```
┌────────────────────┬──────────────┬────────────────────┐
│      Risk          │  Likelihood  │    Mitigation      │
├────────────────────┼──────────────┼────────────────────┤
│ Bundle too large   │    Low       │ Test + compare     │
│ API not exposed    │    Low       │ Test window.Wick   │
│ Libs not bundled   │    Low       │ Check imports      │
│ Shims missing      │    Medium    │ Copy from Gulp     │
│ Build fails        │    Low       │ Incremental test   │
│ Frontend breaks    │    Low       │ E2E tests          │
│ Performance issue  │    Low       │ Benchmark          │
│ Can't revert       │    None      │ Git history        │
└────────────────────┴──────────────┴────────────────────┘
```

## Timeline

```
Week 1:
  Day 1-2: Analysis + Planning (this document)
  Day 3-4: Configure Vite + Write Tests
  Day 5:   Implement + Iterate

Week 2:
  Day 1:   Testing + Verification
  Day 2:   Cleanup + Documentation
  Day 3:   Review + Deploy

Total: ~10 days (with buffer)
```

---

**Created:** October 22, 2025
**Status:** Planning Complete, Ready to Implement
**Next:** Follow ENGINE_VITE_MIGRATION_GETTING_STARTED.md

