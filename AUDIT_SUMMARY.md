# Phase 0.1 - Audit Complete Summary

✅ **Audit Status**: COMPLETE  
📅 **Date**: 2025-10-17  
📋 **Findings**: Comprehensive analysis of current setup and integration points

---

## Key Findings

### 1. Project Architecture

**Two completely separate build systems currently:**

```
npm run build-engine (macOS)    → Gulp concatenates 112 .js files
                                → Outputs: engine/dist/wickengine.js
                                → Copies to: public/corelibs/wick-engine/wickengine.js

npm run build (Vite)            → Builds React app
                                → Loads engine from public/corelibs/
                                → Outputs: build/
```

**Problem**: Manual sequencing required. No workspace automation.

### 2. Integration Points (CRITICAL FOR MIGRATION)

#### Point 1: Script Loading

**File**: `index.html` (line 99)

```html
<script src="/corelibs/wick-engine/wickengine.js"></script>
```

- **Why**: Engine must be global before React mounts
- **Format**: UMD (Universal Module Definition) bundle
- **Size**: ~4.1 MB (current)

#### Point 2: Configuration

**File**: `src/Editor/Editor.tsx` (line 114)

```typescript
window.Wick.resourcepath = "corelibs/wick-engine/";
```

- **Why**: Engine loads assets from this path
- **Must Work**: After monorepo + Vite migration

#### Point 3: Export Functionality

**Files**: `engine/src/export/zip/ZIPExport.js`

- Engine bundles wickengine.js into exported projects
- **Must Preserve**: Standalone engine availability

### 3. Current Build Commands

| Command                | Purpose                | Dependencies                           |
| ---------------------- | ---------------------- | -------------------------------------- |
| `npm run build-engine` | Build engine with Gulp | Must run first                         |
| `npm run build`        | Build editor with Vite | Depends on build-engine output         |
| `npm run test:e2e`     | Run Playwright tests   | Both build-engine + build must succeed |

### 4. Engine Source Breakdown

- **112 total .js files**
- **2.9 MB source code**
- **1.6 MB third-party libraries** (Paper.js, Croquis, etc.)
- **4.1 MB final bundle** (unminified)

### 5. Dependency Issues

#### Root package.json has engine-specific tools:

```json
"devDependencies": {
  "gulp": "^5.0.0",
  "gulp-babel": "^8.0.0",
  "gulp-concat": "^2.6.1",
  "gulp-header": "^2.0.9",
  "gulp-rename": "^2.0.0",
  "gulp-uglify": "^3.0.2"
}
```

**Should be moved to**: `engine/package.json` only

#### Engine package.json is minimal:

```json
"dependencies": {
  "gulp-footer": "^2.1.0",
  "merge-stream": "^2.0.0"
}
```

**Needs to add for Vite build**:

- TypeScript dependencies
- Rollup/Vite configuration
- Type definitions

---

## Critical Constraints for Migration

### 🔴 MUST PRESERVE

1. **UMD Output Format**

   - Current: Browser-loadable global
   - Cannot become: Pure ESM without fallback
   - Reason: Exported projects need standalone engine

2. **Global Namespace**

   - `window.Wick` must exist
   - Cannot break existing API
   - Player apps depend on this

3. **Bundle Path**

   - Must output to: `public/corelibs/wick-engine/wickengine.js`
   - Editor hard-codes this path
   - Changing breaks integration

4. **Library Dependencies**
   - Paper.js, Croquis.js, etc. must load correctly
   - Some are old/specialized
   - Browser compatibility maintained

### 🟡 IMPORTANT TO WATCH

1. **Bundle Size**: Currently 4.1 MB

   - Vite + TypeScript may increase
   - Monitor each phase, aim for <+10% growth

2. **Build Performance**: Gulp is fast for concatenation

   - Vite may be faster or slower depending on config
   - Watch for regressions

3. **Library Ordering**: Gulp concatenates in specific order
   - Must preserve for dependencies to work
   - Vite may need explicit import ordering

---

## Monorepo Migration Checklist

From this audit, we need:

- [ ] **Workspace Setup**

  - Root package.json with `"workspaces": ["engine", "editor"]` (or similar)
  - Move Gulp deps from root to engine
  - Separate build scripts for each package

- [ ] **Engine Vite Config**

  - `engine/vite.config.ts` with library mode
  - Output: UMD + ESM formats
  - Output path: `dist/wickengine.js`
  - Include all third-party libs from `lib/`

- [ ] **Engine TypeScript Config**

  - `engine/tsconfig.json`
  - Compatible with current JS codebase
  - Gradual type migration possible

- [ ] **Build Integration**

  - Root build script orchestrates: engine first, then editor
  - Or: Single Vite pipeline that handles both
  - Must pass Playwright smoke tests after each step

- [ ] **Dependency Management**
  - Root package.json: Only shared tooling
  - engine/package.json: All engine-specific
  - editor/ (src/): All React/UI specific
  - Avoid duplication, use npm link or workspaces

---

## Tests That Must Pass

### Before Any Changes

Run baseline:

```bash
npm run build-engine
npm run build
npm run test:e2e
```

All should pass without errors.

### After Each Phase

Must verify:

- ✅ `npm run build-engine` completes without errors
- ✅ `npm run build` completes without errors
- ✅ `npm run test:e2e` passes (smoke tests)
- ✅ No console errors in browser (dev tools)
- ✅ Canvas renders correctly
- ✅ Bundle size acceptable

---

## Next Phase: 0.2 - Monorepo Setup

Ready to proceed with:

1. Converting root `package.json` to workspaces
2. Moving engine-specific deps to engine/package.json
3. Updating build scripts
4. Testing that current build still works

**Estimated time**: 1-2 days  
**Blocker**: None - this is pure configuration

---

## Audit Documents

- 📄 Full Audit: [AUDIT_PHASE0_1.md](AUDIT_PHASE0_1.md)
- 📋 Migration Plan: [MONOREPO_TS_MIGRATION_PLAN.md](MONOREPO_TS_MIGRATION_PLAN.md)
- 📊 This Summary: You are here
