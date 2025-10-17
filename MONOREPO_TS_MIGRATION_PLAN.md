# Monorepo + TypeScript Migration Plan

**Status**: `In Planning`  
**Branch**: `upgrade/engine-to-ts-and-vite`  
**Last Updated**: 2025-10-17

## Overview

This plan describes the gradual migration from a Gulp-based build system to a Vite-based monorepo with TypeScript support. The engine will be upgraded to TypeScript in phases, with each phase validated using Playwright e2e tests to ensure the frontend editor continues to work.

### Goals
- ✅ Unify project as monorepo with separate engine and editor packages
- ✅ Migrate engine from Gulp to Vite
- ✅ Gradually convert engine codebase to TypeScript (maintain backwards compatibility)
- ✅ Validate each step with Playwright tests
- ✅ Keep engine reusable as standalone library

---

## Phase 0: Monorepo Setup & Vite Migration

**Status**: `Not Started`  
**Estimated Time**: 2-3 days

### Goals
- Establish monorepo structure with npm/yarn workspaces
- Migrate engine build from Gulp to Vite
- Ensure both projects build and integrate correctly
- Validate with Playwright smoke tests

### Tasks

- [ ] **0.1 - Audit Current Setup**
  - [ ] Document engine/package.json dependencies and scripts
  - [ ] Document root package.json and editor dependencies
  - [ ] Identify all integration points between engine and editor
  - [ ] List current build outputs and their locations
  - [ ] Map how public/corelibs/ is populated
  - **Status**: Not Started
  - **Notes**: 

- [ ] **0.2 - Configure Monorepo Structure**
  - [ ] Update root package.json to use workspaces
  - [ ] Move editor files to editor/ subdirectory (or create alias)
  - [ ] Update root build scripts to handle both packages
  - [ ] Create editor/package.json if needed
  - [ ] Update paths in all config files (tsconfig, vite, etc)
  - **Status**: Not Started
  - **Notes**: 

- [ ] **0.3 - Migrate Engine Build to Vite**
  - [ ] Create engine/vite.config.ts
  - [ ] Configure UMD + ESM outputs
  - [ ] Set output path to dist/
  - [ ] Migrate build scripts from gulpfile.js to vite.config.ts
  - [ ] Test that dist/wickengine.js is generated correctly
  - [ ] Verify bundle size is acceptable
  - **Status**: Not Started
  - **Notes**: 

- [ ] **0.4 - Update Integration**
  - [ ] Update build process to copy engine dist to public/corelibs/
  - [ ] Update editor vite.config.js to reference new engine location
  - [ ] Ensure Wick global is available in editor
  - [ ] Test manual build and editor startup
  - **Status**: Not Started
  - **Notes**: 

- [ ] **0.5 - Playwright Smoke Tests**
  - [ ] Run existing smoke tests: `npm run test:smoke`
  - [ ] Verify editor loads successfully
  - [ ] Verify key panels are visible
  - [ ] Verify canvas initializes with Wick engine
  - [ ] Check console for errors/warnings
  - **Status**: Not Started
  - **Expected Output**: All smoke tests pass

---

## Phase 1: TypeScript Migration - Core Files

**Status**: `Not Started`  
**Estimated Time**: 3-4 days  
**Dependencies**: Phase 0 must be complete

### Goals
- Convert foundational engine files to TypeScript
- Create engine/tsconfig.json with appropriate settings
- Maintain UMD output compatibility with editor

### Tasks

- [ ] **1.1 - Setup TypeScript Configuration**
  - [ ] Create engine/tsconfig.json
  - [ ] Set target to ES2017 (editor compatibility)
  - [ ] Configure module output (commonjs for now)
  - [ ] Set up path aliases if needed
  - [ ] Enable strict mode gradually
  - **Status**: Not Started
  - **Notes**: 

- [ ] **1.2 - Convert Core Files to TypeScript**
  - [ ] Convert engine/src/Wick.js → Wick.ts
    - [ ] Define namespace declaration
    - [ ] Type version and resourcepath
    - [ ] Type _originals object
  - [ ] Convert engine/src/Base.js → Base.ts
    - [ ] This is likely the base class for all Wick objects
    - [ ] Define proper interfaces and types
  - [ ] Convert engine/src/Project.js → Project.ts
  - **Status**: Not Started
  - **Notes**: 

- [ ] **1.3 - Update Vite Build Configuration**
  - [ ] Update engine/vite.config.ts to handle .ts files
  - [ ] Ensure rollup config includes TypeScript processing
  - [ ] Verify dist/ output still generates valid UMD bundle
  - **Status**: Not Started
  - **Notes**: 

- [ ] **1.4 - Test Phase 1 - Core Files**
  - [ ] Build engine: `npm run build` (from engine directory)
  - [ ] Verify dist/wickengine.js is generated and valid
  - [ ] Run Playwright smoke tests from root: `npm run test:smoke`
  - [ ] Verify editor loads and initializes
  - [ ] Check canvas renders without errors
  - [ ] Verify Wick global is accessible
  - **Status**: Not Started
  - **Expected Output**: All smoke tests pass, no console errors related to core files
  - **If Failed**: 
    - [ ] Check for type errors in build output
    - [ ] Verify UMD bundle exports are correct
    - [ ] Test Wick global in browser console

---

## Phase 2: TypeScript Migration - Utilities & Helpers

**Status**: `Not Started`  
**Estimated Time**: 2-3 days  
**Dependencies**: Phase 1 must be complete

### Goals
- Convert utility and helper modules to TypeScript
- Ensure all math, color, and timeline utilities work correctly
- Build incrementally without breaking main engine

### Tasks

- [ ] **2.1 - Identify Helper Modules**
  - [ ] List all utility files (vector math, color utils, etc)
  - [ ] Map dependencies between utilities
  - [ ] Identify modules with no external dependencies (start here)
  - **Status**: Not Started
  - **Notes**: 

- [ ] **2.2 - Convert Utilities to TypeScript**
  - [ ] Start with lowest-dependency modules first
  - [ ] Convert math utilities
  - [ ] Convert color utilities
  - [ ] Convert timeline helpers
  - [ ] Convert any other utility modules
  - **Status**: Not Started
  - **Notes**: 

- [ ] **2.3 - Build and Verify**
  - [ ] Build engine with Phase 2 TypeScript files
  - [ ] Check bundle size increase
  - [ ] Verify no runtime errors
  - **Status**: Not Started
  - **Notes**: 

- [ ] **2.4 - Test Phase 2 - Utilities**
  - [ ] Run Playwright smoke tests
  - [ ] Run Playwright core tests (if available)
  - [ ] Test features that depend on utilities (colors, transforms, etc)
  - [ ] Check console for warnings
  - **Status**: Not Started
  - **Expected Output**: All tests pass, utilities function correctly
  - **If Failed**: 
    - [ ] Check type definitions match runtime behavior
    - [ ] Verify module exports are correct

---

## Phase 3: TypeScript Migration - GUI & Display Layer

**Status**: `Not Started`  
**Estimated Time**: 4-5 days  
**Dependencies**: Phase 2 must be complete

### Goals
- Convert GUI and display layer classes to TypeScript
- Handle complex canvas rendering logic
- Ensure all rendering and interaction features work

### Tasks

- [ ] **3.1 - Identify GUI Module Files**
  - [ ] List all GUI files (Canvas, FrameObject, PathObject, etc)
  - [ ] Map dependencies between GUI modules
  - [ ] Identify rendering vs interaction code
  - **Status**: Not Started
  - **Notes**: 

- [ ] **3.2 - Convert GUI Files to TypeScript**
  - [ ] Convert Canvas.js → Canvas.ts
  - [ ] Convert FrameObject.js → FrameObject.ts
  - [ ] Convert PathObject.js → PathObject.ts
  - [ ] Convert other display classes
  - **Status**: Not Started
  - **Notes**: 

- [ ] **3.3 - Build and Verify**
  - [ ] Build engine with Phase 3 TypeScript files
  - [ ] Verify bundle compiles without errors
  - [ ] Check bundle size
  - **Status**: Not Started
  - **Notes**: 

- [ ] **3.4 - Test Phase 3 - GUI & Rendering**
  - [ ] Run full Playwright test suite
  - [ ] Test canvas rendering and interaction
  - [ ] Test timeline operations
  - [ ] Test object creation and manipulation
  - [ ] Test rendering with various object types
  - **Status**: Not Started
  - **Expected Output**: All tests pass, rendering and interaction work correctly
  - **If Failed**: 
    - [ ] Check canvas context types
    - [ ] Verify DOM interaction code
    - [ ] Check event handler typing

---

## Phase 4: TypeScript Migration - Remaining Files & Cleanup

**Status**: `Not Started`  
**Estimated Time**: 2-3 days  
**Dependencies**: Phase 3 must be complete

### Goals
- Convert any remaining JavaScript files
- Clean up build configuration
- Remove Gulp entirely
- Optimize TypeScript setup

### Tasks

- [ ] **4.1 - Convert Remaining Files**
  - [ ] Identify all remaining .js files in engine/src/
  - [ ] Convert test utilities
  - [ ] Convert any build helper files
  - [ ] Convert data/config files if applicable
  - **Status**: Not Started
  - **Notes**: 

- [ ] **4.2 - Cleanup Build Configuration**
  - [ ] Remove gulpfile.js
  - [ ] Remove Gulp dependencies from engine/package.json
  - [ ] Remove babel configuration if no longer needed
  - [ ] Update engine/package.json build scripts
  - **Status**: Not Started
  - **Notes**: 

- [ ] **4.3 - Optimize TypeScript Configuration**
  - [ ] Review and optimize engine/tsconfig.json
  - [ ] Enable stricter type checking gradually
  - [ ] Configure path aliases for cleaner imports
  - [ ] Update root tsconfig.json to reference workspace packages
  - **Status**: Not Started
  - **Notes**: 

- [ ] **4.4 - Final Testing & Validation**
  - [ ] Run full Playwright test suite
  - [ ] Run any existing unit tests
  - [ ] Test both editor and engine build independently
  - [ ] Verify no console errors or warnings
  - [ ] Test production build
  - **Status**: Not Started
  - **Expected Output**: All tests pass, clean builds, no warnings
  - **If Failed**: 
    - [ ] Debug remaining type issues
    - [ ] Check build configuration

- [ ] **4.5 - Documentation & Cleanup**
  - [ ] Update README.md with new build instructions
  - [ ] Document TypeScript setup for future developers
  - [ ] Remove old Gulp documentation
  - [ ] Update CONTRIBUTING.md if applicable
  - [ ] Commit cleanup changes
  - **Status**: Not Started
  - **Notes**: 

---

## Testing Strategy

### Playwright Test Suite

**Smoke Tests** (basic functionality)
```bash
npm run test:smoke
```
- Editor loads
- Key panels visible
- Canvas initializes

**Full Test Suite** (comprehensive)
```bash
npm run test
```
- All smoke tests
- Canvas rendering
- Timeline operations
- Object manipulation
- Event handling
- Data persistence

### Per-Phase Testing Approach

1. **After each phase**: Run smoke tests to ensure editor loads
2. **After Phase 3+**: Run full test suite including rendering tests
3. **Before committing**: Zero console errors, all tests passing
4. **Manual testing**: Test key features in editor UI after each phase

### Rollback Strategy

If tests fail:
1. Check if it's a type issue vs runtime issue
2. If runtime: revert files from git, investigate
3. If type issue: fix types, rebuild, retest
4. If blocker: move back to previous phase, document issue

---

## Key Integration Points

These files need special attention during migration:

1. **engine/src/Wick.js** → Global namespace must work in browser
2. **engine/src/Base.js** → Parent class for all Wick objects
3. **engine/src/Project.js** → Main canvas container
4. **public/corelibs/wick-engine/wickengine.js** → Must be UMD compatible
5. **src/Editor/Panels/Canvas/Canvas.jsx** → Loads and initializes engine

## Potential Issues & Mitigations

| Issue | Impact | Mitigation |
|-------|--------|-----------|
| UMD bundle changes break editor | Critical | Test every phase with Playwright |
| Type definitions too strict | Blocking | Use `any` as escape hatch, gradually improve |
| Circular dependencies | High | Identify in Phase 1, refactor early |
| Missing type definitions | Medium | Generate ambient types for third-party libs |
| Build output size increases | Low | Monitor with each phase, optimize if needed |

---

## Success Criteria

✅ Phase 0: Monorepo builds, editor loads with Playwright smoke tests passing  
✅ Phase 1: Core engine files in TypeScript, smoke tests passing  
✅ Phase 2: Utilities in TypeScript, all features working  
✅ Phase 3: GUI layer in TypeScript, rendering/interaction working  
✅ Phase 4: All files in TypeScript, full test suite passing, Gulp removed  

---

## Notes & Decisions

### Why gradual?
- Large codebase conversion all at once risks breaking everything
- Each phase is independently testable
- Easier to debug if something breaks
- Team can understand changes incrementally

### Why keep UMD output?
- Engine may be used in non-module contexts
- Backwards compatibility with existing projects
- Can be used as standalone library

### Why Vite over Webpack?
- Faster builds and HMR
- Better ESM support out of the box
- Simpler configuration
- Already used for editor

---

## Progress Tracking

```
Phase 0: ░░░░░░░░░░ 0%
Phase 1: ░░░░░░░░░░ 0%
Phase 2: ░░░░░░░░░░ 0%
Phase 3: ░░░░░░░░░░ 0%
Phase 4: ░░░░░░░░░░ 0%

Overall: ░░░░░░░░░░ 0%
```
