# TypeScript Migration Strategy

## Overview

This document describes the incremental TypeScript migration approach for the Wick Editor codebase.

**Status**: Phase 2 Complete - Ready for incremental conversion  
**TypeScript Version**: 5.9.3 with strict mode enabled  
**Strategy**: Incremental file-by-file conversion with `@ts-nocheck` protection

---

## Why `@ts-nocheck`?

The `// @ts-nocheck` directive at the top of files tells TypeScript to **skip type checking** for that entire file. This is the standard approach for incremental TypeScript adoption because:

1. ✅ **Enables strict mode globally** - New code gets full type safety
2. ✅ **No breaking changes** - Existing code continues to work
3. ✅ **Clear TODO markers** - Easy to find files that need conversion
4. ✅ **Incremental progress** - Convert files one at a time at your own pace
5. ✅ **Zero pressure** - No rush to fix everything at once

---

## Current Files with `@ts-nocheck`

### Source Files (2)

```typescript
// @ts-nocheck - TODO: Remove when converting to proper TypeScript
```

1. **`src/Editor/Panels/MenuBar/MenuBarIconButton/MenuBarIconButton.tsx`**
   - Reason: Unused React import (legacy pattern)
   - Work needed: Remove `import React` line (react-jsx handles it)
   
2. **`src/Editor/Panels/MenuBar/MenuBarIconButton/MenuBarIconButtonComponent.tsx`**
   - Reason: Unused React import (legacy pattern)
   - Work needed: Remove `import React` line (react-jsx handles it)

### Test Files (2)

```typescript
// @ts-nocheck - TODO: Remove when properly typing test files
```

1. **`tests/canvas-interactions.spec.ts`**
   - Reason: Unused variables in test setup
   - Work needed: Remove unused `initialCenter` and `page` variables
   
2. **`tests/debug.spec.ts`**
   - Reason: Missing type annotations for arrays
   - Work needed: Add types like `any[]` or `Error[]` to array declarations

---

## Migration Process

### Step 1: Choose a File

Start with files that are:
- Small and focused (< 100 lines)
- Have clear inputs/outputs
- Low dependencies on other files
- Used frequently (high value)

**Recommended starting points:**
- Utility functions in `src/Editor/Util/`
- Helper files that export pure functions
- Small React components with minimal props

### Step 2: Remove `@ts-nocheck`

Delete the first line:
```typescript
// @ts-nocheck - TODO: Remove when converting to proper TypeScript
```

### Step 3: Fix Type Errors

Run type checking to see what needs fixing:
```bash
npx tsc --noEmit
```

Common patterns:

#### Unused Imports
```typescript
// ❌ Before (with @ts-nocheck)
import React from 'react';

// ✅ After (removed - react-jsx handles it)
// No React import needed for JSX!
```

#### Function Parameters
```typescript
// ❌ Before
function doSomething(value) {
  return value * 2;
}

// ✅ After
function doSomething(value: number): number {
  return value * 2;
}
```

#### React Props
```typescript
// ❌ Before
function MyComponent({ name, age }) {
  return <div>{name} is {age}</div>;
}

// ✅ After
interface MyComponentProps {
  name: string;
  age: number;
}

function MyComponent({ name, age }: MyComponentProps) {
  return <div>{name} is {age}</div>;
}
```

#### Array Types
```typescript
// ❌ Before
const errors = [];

// ✅ Good
const errors: any[] = [];

// ✨ Better
const errors: Error[] = [];
```

### Step 4: Test

After removing `@ts-nocheck` and fixing errors:

```bash
# 1. Type check
npx tsc --noEmit

# 2. Build
npm run build

# 3. Run tests
npm run test:unit
```

If all pass ✅, you're done with that file!

### Step 5: Commit

Make small, focused commits:
```bash
git add src/Editor/Util/SomeFile.ts
git commit -m "Convert SomeFile to TypeScript (remove @ts-nocheck)"
```

---

## Quick Wins

These files can be converted quickly (< 5 minutes each):

### 1. MenuBarIconButton Files

**Issue**: Just need to remove unused React imports

```bash
# Open the file
code src/Editor/Panels/MenuBar/MenuBarIconButton/MenuBarIconButton.tsx

# Delete line 1: // @ts-nocheck - TODO: Remove when converting to proper TypeScript
# Delete line 2: import React, { Component } from 'react';
# Change line 2 to: import { Component } from 'react';

# Test
npx tsc --noEmit
```

Repeat for `MenuBarIconButtonComponent.tsx`

### 2. Test Files

**tests/canvas-interactions.spec.ts**
```typescript
// Delete unused variables at lines 156 and 180
// Or use them in your test
```

**tests/debug.spec.ts**
```typescript
// Change:
const errors = [];
const logs = [];

// To:
const errors: any[] = [];
const logs: any[] = [];
```

---

## Benefits of This Approach

### ✅ No Big Bang Migration
- Convert files at your own pace
- No pressure to do everything at once
- Can pause and resume anytime

### ✅ Strict Mode from Day 1
- All **new** `.ts`/`.tsx` files get strict type checking
- Catch bugs early in new code
- Existing code protected by `@ts-nocheck`

### ✅ Clear Progress Tracking
- Grep for `@ts-nocheck` to see remaining work:
```bash
grep -r "@ts-nocheck" src/ tests/
```

### ✅ Zero Risk
- Existing files with `@ts-nocheck` work exactly as before
- Can't accidentally break working code
- TypeScript errors don't block builds (Vite uses esbuild)

---

## Tracking Progress

### Current Status

```bash
# Count files with @ts-nocheck
grep -r "@ts-nocheck" src/ tests/ | wc -l
# Result: 4 files
```

| Category | Total Files | With @ts-nocheck | Converted | % Complete |
|----------|-------------|------------------|-----------|------------|
| Source Files | ~500 | 2 | ~498 | ~99.6% |
| Test Files | ~5 | 2 | ~3 | ~60% |

**Note**: Most files are already `.js`/`.jsx` and aren't type-checked yet. The above shows only `.ts`/`.tsx` files.

### Goal

Remove all `@ts-nocheck` directives and convert remaining `.js`/`.jsx` files to `.ts`/`.tsx` over time.

---

## TypeScript Configuration

With strict mode enabled, new TypeScript files automatically get:

```json
{
  "strict": true,                           // All strict checks
  "noUnusedLocals": true,                   // Catch unused variables
  "noUnusedParameters": true,               // Catch unused parameters
  "noFallthroughCasesInSwitch": true,       // Prevent switch bugs
  "noUncheckedIndexedAccess": true,         // Array safety
  "jsx": "react-jsx",                       // Modern JSX (no React import)
  "moduleResolution": "bundler"             // Optimized for Vite
}
```

See `tsconfig.json` and `TYPESCRIPT_UPDATE.md` for full configuration details.

---

## When to Convert a File

### ✅ Good Times to Convert

- **Adding new features** - Convert the file while you're already editing it
- **Fixing bugs** - Add types to prevent similar bugs in the future
- **Refactoring** - Types make refactoring safer
- **Code review feedback** - "Could you add types to this?"

### ❌ Don't Rush

- Don't convert files just to convert them
- Don't convert complex files in isolation (dependencies first)
- Don't convert during urgent bug fixes (unless types help)
- Don't feel pressured - `@ts-nocheck` is fine for now!

---

## Getting Help

### TypeScript Resources

- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/
- **React TypeScript Cheatsheet**: https://react-typescript-cheatsheet.netlify.app/
- **TypeScript Playground**: https://www.typescriptlang.org/play

### Common Questions

**Q: Why do I still see type errors in my editor?**  
A: Your editor (VS Code) shows type errors even though builds succeed. This is helpful! Fix them when converting files.

**Q: Can I use `any` types?**  
A: Yes! `any` is better than `@ts-nocheck`. You can refine types later.

**Q: What if I can't figure out the type?**  
A: Use `any` for now, add a `// TODO: Type this properly` comment, and move on.

**Q: Do I need to type everything?**  
A: No! TypeScript's inference is smart. Only add types where inference fails or for public APIs.

---

## Next Steps

1. ✅ **Phase 1 Complete**: jQuery removed, 100KB smaller bundle
2. ✅ **Phase 2 Complete**: TypeScript 5.9.3 with strict mode configured
3. 🔄 **Phase 3 In Progress**: Incremental file conversion
   - Remove `@ts-nocheck` from 4 files (quick wins)
   - Convert utility files in `src/Editor/Util/`
   - Gradually convert React components

---

## Summary

The `@ts-nocheck` approach gives us the best of both worlds:

- 🎯 **Strict type safety** for new code
- 🛡️ **Zero risk** for existing code
- 📈 **Incremental progress** at your own pace
- ✅ **Working builds** throughout the migration

No pressure, no rush, no big bang. Just steady, safe progress towards a fully typed codebase! 🚀
