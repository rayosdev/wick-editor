# Phase 1.2b Retrospective: TypeScript in Gulp Bundles

## Issue Discovered

Attempted to convert `Base.ts` to TypeScript but encountered a critical issue: **TypeScript classes compiled in a Gulp concatenation bundle cannot properly serve as base classes for file-scoped classes defined in other JavaScript/TypeScript files.**

### The Problem

```
Error: Cannot read properties of undefined (reading 'isFocus')
```

**Root Cause**: When files are concatenated by Gulp into a single bundle:

1. `Wick.ts` defines the Wick namespace
2. `Base.ts` (TypeScript class) gets compiled to JavaScript and assigned to `Wick.Base`
3. Other files like `Tickable.js` try to extend `Wick.Base` using ES5 class pattern
4. The inheritance chain breaks because:
   - TypeScript compiles to ES5 getters/setters differently than vanilla JS
   - The class prototype isn't properly accessible in the concatenated context
   - Child classes can't find properties on the parent class

### What Went Wrong

**Original approach** (concatenation-based):

```
Wick.ts → TypeScript class → compiled JS
         ↓
       Base.ts (another TS class)
         ↓
     [gulp-concat combines all]
         ↓
     wickengine.js (UMD bundle)
         ↓
    Frame.js tries to extend Wick.Base ❌ FAILS
```

The issue is that TypeScript's class compilation and the concatenation model don't play well together.

## Solution: Module-Based Build

We need to move away from **concatenation-based** builds to **module-based** builds to support proper TypeScript classes with inheritance.

### Two Viable Options

#### Option A: Keep Gulp + Add Bundler (Webpack/Rollup)

- Compile TypeScript separately → ES modules
- Use bundler for proper module resolution
- Bundle into UMD format for global `window.Wick`
- **Pros**: Minimal changes, keep Gulp
- **Cons**: Extra build step, more complex

#### Option B: Replace Gulp with Vite (Recommended)

- Build engine as an ES module library
- Use Vite's superior TypeScript support
- Generate UMD bundle for browser consumption
- **Pros**: Modern, fast, TypeScript-native, already using Vite for editor
- **Cons**: Larger refactor of build system

### Recommended Path: Option B (Vite)

**Why Vite for the engine?**

1. **Native TypeScript support** - No separate compilation needed
2. **Proper module resolution** - Classes extend correctly across files
3. **Already in use** - Editor uses Vite, one consistent build system
4. **Performance** - Faster than Gulp for development
5. **Library mode** - Can generate UMD bundle for global consumption

**Migration Strategy**:

```
Step 1: Create vite.config.ts for engine/
Step 2: Configure UMD output to window.Wick
Step 3: Test with existing Wick.ts + Base.js (no TS yet)
Step 4: Once working, convert files to TypeScript
Step 5: Verify inheritance chains work
```

## Why Wick.ts Succeeded

`Wick.ts` worked because it's not extended by other files - it's just the namespace definition. Once we tried to make an extensible base class, the concatenation model failed.

## Decision

**Recommendation**: Proceed with **Vite migration for engine build** (Phase 1.3) before continuing TypeScript class conversions.

This will:

- Enable proper TypeScript class inheritance
- Maintain faster build times
- Support dynamic module imports if needed later
- Keep the codebase modern and maintainable

## Files Affected

- ✅ Reverted: `engine/src/base/Base.ts` → restored to `Base.js`
- ✅ Restored build to working state
- ⚠️ `Wick.ts` remains (works as namespace-only)
- 📋 `gulpfile.js` will need migration to Vite config

## Next Steps

1. **Phase 1.3**: Create `engine/vite.config.ts` and migrate build
2. Verify editor loads engine from new Vite-built bundle
3. Run tests to ensure no regressions
4. Then resume TypeScript conversions with proper module support
