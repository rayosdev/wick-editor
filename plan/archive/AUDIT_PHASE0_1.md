# Phase 0.1 Audit - Current Setup and Dependencies

**Date**: 2025-10-17  
**Status**: Complete  
**Auditor**: Automated Analysis

## Executive Summary

The Wick Editor is a **two-part project** with clear separation of concerns:

- **Engine** (Gulp-based, plain JS): `engine/` → outputs to `public/corelibs/wick-engine/`
- **Editor** (Vite-based, React+TS): `src/` → built by Vite, consumes engine

**Current State**: Functional but with redundant build processes and mixed tooling.

---

## Part 1: Root Project (`wick-editor`)

### Package.json Analysis

**Name**: `wick-editor` v1.19.3  
**Type**: Private Electron + Vite app  
**Node Version**: >=22

### Build Scripts

| Command                        | Purpose                | Calls                        | Output                                        |
| ------------------------------ | ---------------------- | ---------------------------- | --------------------------------------------- |
| `npm start`                    | Dev server             | `vite`                       | HMR dev server on port 5173                   |
| `npm run build`                | Production build       | `vite build`, copy resources | `build/` directory                            |
| `npm run build-engine`         | Engine build (macOS)   | `gulp` in engine/            | Copies dist to `public/corelibs/wick-engine/` |
| `npm run build-engine-windows` | Engine build (Windows) | Same as above                | Windows path handling                         |
| `npm run test:e2e`             | Playwright tests       | `playwright test`            | Chrome/Firefox/Safari results                 |

**Key Finding**: Engine and editor builds are **separate and sequential**:

```
npm run build-engine  # Must run first
npm run build         # Depends on engine output in public/
```

### Root Dependencies

**Critical for editor** (48 direct dependencies):

- React 18.3.1
- Vite 5.4.8
- TypeScript 5.9.3
- Electron 32.0.0
- Playwright 1.48.2
- SASS 1.79.4
- Bootstrap, React DnD, etc.

**DevDependencies**:

- Gulp 5.0.0 (root level - for engine build only)
- JSDoc 3.6.4

**Problem**: Gulp is in root devDeps but only used by engine. Should be moved.

---

## Part 2: Engine Project (`engine/`)

### Package.json Analysis

**Name**: `wick-engine` v1.0.0  
**Type**: Plain JavaScript library  
**Main**: `index.js` (not used in current setup)

### Engine Dependencies

**Very minimal** (only 2 actual dependencies):

- `gulp-footer` (^2.1.0)
- `merge-stream` (^2.0.0)

**DevDependencies**:

```
@babel/core ^7.1.2
gulp ^4.0.0
gulp-babel ^8.0.0-beta.2
gulp-concat ^2.6.1
gulp-header ^2.0.5
gulp-rename ^1.4.0
gulp-uglify ^3.0.1
jsdoc ^3.6.4
```

### Build Process (Gulpfile)

**Input**: 112 JavaScript files in `engine/src/`

**Process**:

1. Concatenates library files (paper.js, croquis.js, etc.) - `lib/` folder
2. Concatenates engine source files (`src/`) in specific order
3. Runs through Babel transpilation
4. Minifies with UglifyJS
5. Outputs to `dist/wickengine.js` (single bundle, UMD format)

**Output**:

- `engine/dist/wickengine.js` (UMD bundle, ~4.1MB unminified)
- Bundle size: **4.1MB** for engine + libraries

### Engine Source Structure

```
engine/src/
├── Wick.js                    (Main namespace entry point)
├── Base.js                    (Base class for all objects)
├── Project.js                 (Canvas container)
├── builtinassets/             (Asset definitions)
├── export/                    (ZIP/project file export)
├── gui/                       (Canvas rendering, UI)
├── tools/                     (Editor tools)
├── objects/                   (Frame, Clip, Button, etc.)
├── Transformation.js          (Math/transforms)
├── History.js                 (Undo/redo)
├── Color.js                   (Color utilities)
├── GlobalAPI.js               (Script API for animations)
└── [others]                   (112 total .js files)
```

**Sizes**:

- `engine/src/`: 2.9MB
- `engine/lib/`: 1.6MB (third-party libraries)
- Output `dist/`: 4.1MB

---

## Part 3: Editor Integration

### Script Loading (index.html)

**Line 99**:

```html
<script src="/corelibs/wick-engine/wickengine.js"></script>
```

**Setup**:

1. HTML loads engine bundle before React
2. Wick engine available as global `window.Wick`
3. Browser creates UUID fallback
4. Browser creates localforage fallback

### Editor Integration (Editor.tsx)

**Line 114**:

```typescript
window.Wick.resourcepath = "corelibs/wick-engine/";
```

**Usage**: Editor references engine via global `window.Wick` for:

- Canvas rendering
- Project management
- Object creation
- Export functionality

---

## Part 4: Integration Points - CRITICAL

### File: `index.html`

- Loads engine bundle at `<script src="/corelibs/wick-engine/wickengine.js"></script>`
- Sets up UUID and localforage polyfills

### File: `src/Editor/Editor.tsx` (Line 114)

- Sets `window.Wick.resourcepath = "corelibs/wick-engine/"`
- All canvas operations go through `window.Wick`

### File: `public/corelibs/wick-engine/wickengine.js`

- Current output: Gulp-built bundle
- **Must remain**: UMD format, browser-loadable global
- **Must work**: Loaded before React mounts

### File: `engine/src/Wick.js`

- Entry point for entire engine
- Must export as global `Wick` namespace
- Cannot change in migration

---

## Part 5: Current Build Output

### Location: `public/corelibs/wick-engine/`

**Files**:

```
├── wickengine.js           (Main bundle - 4.1MB)
├── index.html              (Standalone player)
├── project.html            (Embedded project player)
├── emptyproject.html       (Template)
├── preloadjs.min.js        (Audio library)
```

**How it's populated**:

1. Gulp builds engine to `engine/dist/wickengine.js`
2. Root script: `cp -a dist/. ../public/corelibs/wick-engine/`
3. Editor loads from public folder during dev/build

---

## Part 6: Current Testing Setup

### Playwright Tests

**Config**: `playwright.config.ts` (dev) and `playwright.config.ci.ts` (CI)

**Test Structure**:

- Located in `tests/` directory
- Uses Chromium, Firefox, Safari, Mobile browsers
- Tests editor loading, UI interactions, canvas rendering

**Key Test**: Smoke test - verify editor loads successfully

**Current Issue**: Tests rely on:

1. Engine being built first (`npm run build-engine`)
2. Output in `public/corelibs/wick-engine/`
3. Editor dev server running with Vite

---

## Part 7: What Needs to Change (Monorepo View)

### Before (Current)

```
wick-editor/
├── engine/                 (Gulp, plain JS)
│   ├── gulpfile.js        (Build config)
│   ├── src/               (112 .js files)
│   ├── dist/              (Built output)
│   └── package.json       (Engine deps)
│
├── src/                   (React/TS editor)
├── public/                (Static assets)
├── package.json           (Root + editor deps + Gulp)
└── vite.config.js         (Editor build only)
```

### After (Proposed)

```
wick-editor/
├── engine/                (Vite, TS + JS mix)
│   ├── vite.config.ts    (New - Vite config)
│   ├── tsconfig.json     (New - TS config)
│   ├── src/              (JS → TS migration)
│   ├── dist/             (Vite output)
│   └── package.json      (Engine only deps)
│
├── editor/                (React/TS - alias to src/)
│   ├── package.json      (Editor only deps)
│   └── [points to src/]
│
├── package.json          (Workspaces only)
├── tsconfig.json         (Shared TS config)
└── vite.config.base.ts   (Shared Vite config)
```

---

## Dependency Audit Summary

### Root package.json (Should NOT include engine tools)

**Current engine dependencies in root**:

```json
"devDependencies": {
  "gulp": "^5.0.0",
  "gulp-babel": "^8.0.0",
  ...
}
```

**Action**: Move to `engine/package.json` only

### Engine package.json (Needs expansion for Vite)

**Current**: 2 dependencies, 8 devDependencies  
**Needed for Vite**: Add TypeScript, rollup configs, etc.

---

## Key Metrics

| Metric              | Value                       |
| ------------------- | --------------------------- |
| Engine Source Files | 112 .js files               |
| Engine Source Size  | 2.9 MB                      |
| Libraries (bundled) | 1.6 MB                      |
| Final Bundle        | 4.1 MB (unminified)         |
| TypeScript Files    | ~50 in editor               |
| E2E Tests           | 5+ test suites              |
| Build Commands      | 2 separate (engine, editor) |

---

## Blockers & Considerations

### 1. **Global Namespace** ⚠️ CRITICAL

- Engine exports as global `window.Wick`
- Must load before React
- Cannot change without breaking compatibility
- Migration must preserve this interface

### 2. **UMD Output Format** ⚠️ CRITICAL

- Currently built by Gulp + UglifyJS
- Must remain UMD (not just ESM)
- Can be used standalone in HTML files
- Must verify every phase

### 3. **Library Dependencies**

- Paper.js, Croquis, Potrace in `lib/`
- Some are very old/specialized
- Babel transpiles for browser compatibility
- Need to ensure nothing breaks

### 4. **Build Order Dependency**

- Engine must build first
- Editor depends on `public/corelibs/wick-engine/wickengine.js`
- Automated build scripts must handle this

### 5. **Bundle Size**

- 4.1 MB is large for bundle
- Vite + TypeScript might impact size
- Monitor each phase

---

## Success Criteria for Monorepo Migration

✅ Root `package.json` uses workspaces  
✅ Engine builds with Vite (no Gulp)  
✅ Output remains at `public/corelibs/wick-engine/wickengine.js`  
✅ Format remains UMD (browser-loadable global)  
✅ Editor loads successfully in dev and prod  
✅ All Playwright tests pass  
✅ Bundle size doesn't increase >10%

---

## Next Steps

This audit enables:

1. **Phase 0.2**: Configure monorepo with workspaces
2. **Phase 0.3**: Create Vite config for engine
3. **Phase 0.4**: Test integration
4. **Phase 1**: Begin TypeScript migration

All decisions are documented and blockers identified.
