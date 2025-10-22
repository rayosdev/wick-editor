# Engine Vite Migration - Quick Summary

## What's the Goal?

Replace Gulp with Vite for building the Wick Engine to achieve:
1. **Unified build system** - Both engine and frontend use Vite
2. **Better dev experience** - Faster builds, better tooling
3. **Preparation for TypeScript** - Vite has excellent TS support
4. **Automated testing** - Comprehensive tests to ensure nothing breaks

## Current Architecture

```
┌─────────────────────────────────────────────────────┐
│  Root Project (Vite)                                │
│  ├─ Frontend (React + Vite)                         │
│  └─ Engine (Gulp) ← WE'RE CHANGING THIS             │
│                                                      │
│  Build Flow:                                        │
│  1. engine/src + engine/lib → Gulp → dist/          │
│  2. dist/wickengine.js → copy → public/corelibs/    │
│  3. Frontend imports from public/                   │
└─────────────────────────────────────────────────────┘
```

## Target Architecture

```
┌─────────────────────────────────────────────────────┐
│  Root Project (Vite)                                │
│  ├─ Frontend (React + Vite)                         │
│  └─ Engine (Vite) ← USING VITE                      │
│                                                      │
│  Build Flow:                                        │
│  1. engine/src + libs → Vite → dist/                │
│  2. dist/wickengine.js → copy → public/corelibs/    │
│  3. Frontend imports from public/                   │
│                                                      │
│  Benefits:                                          │
│  ✓ Faster builds                                    │
│  ✓ Better source maps                               │
│  ✓ Tree-shaking ready                               │
│  ✓ TypeScript ready                                 │
└─────────────────────────────────────────────────────┘
```

## Key Challenges to Solve

### 1. Library Bundling
**Current:** Gulp concatenates 20+ library files in specific order
**Solution:** Vite config with proper imports and Rollup options

### 2. IIFE Wrapper + Shims
**Current:** Gulp adds extensive browser compatibility shims
```javascript
(function() {
  var require = function() {...};
  var module = {exports: {}};
  var exports = module.exports;
  // ... lots of shims ...
  // Engine code here
})();
```
**Solution:** Vite banner/footer or custom plugin

### 3. Post-Build Processing
**Current:** Gulp generates `emptyproject.html` and copies ZIP resources
**Solution:** Vite plugin or post-build script

### 4. API Exposure
**Current:** Engine exposes `window.Wick` via global scope
**Solution:** Vite UMD build with proper global name

## Testing Strategy

### Automated Tests (Prevents Regressions)

1. **Build Verification (Vitest)**
   - All expected files created
   - Bundle size reasonable
   - Valid JavaScript syntax
   - Build version injected

2. **API Tests (Vitest + JSDOM)**
   - `window.Wick` exists
   - Core classes available
   - Can create projects
   - All tools defined

3. **Integration Tests (Playwright)**
   - Editor loads without errors
   - Canvas interactions work
   - Timeline operations work
   - Drawing tools function
   - Assets can be added
   - Projects can be exported

4. **Cross-Browser Tests (Playwright)**
   - Chrome/Chromium ✓
   - Firefox ✓
   - Safari/WebKit ✓
   - Mobile viewports ✓

### Manual Verification Checklist

After running automated tests, manually verify:
- [ ] Editor opens
- [ ] No console errors
- [ ] Can draw with pencil
- [ ] Can add frames
- [ ] Can add layers
- [ ] Can upload images
- [ ] Can play animation
- [ ] Can export HTML

## Implementation Approach

### Phase-by-Phase Execution

```
Phase 1: Analysis (2h)
├─ Study Gulp output
├─ Document all files
└─ Note shims & wrappers

Phase 2: Configure Vite (4h)
├─ Update vite.config.cjs
├─ Configure library build
├─ Add shims via banner
└─ Create post-build plugin

Phase 3: Update Scripts (2h)
├─ Modify package.json
└─ Test build commands

Phase 4: Write Tests (6h)
├─ Build verification
├─ API tests
├─ Integration tests
└─ Cross-browser tests

Phase 5: Implement (6h)
├─ Run tests on Gulp (baseline)
├─ Switch to Vite
├─ Iterate until tests pass
└─ Compare outputs

Phase 6: Verify (3h)
├─ Run all tests
├─ Manual testing
└─ Performance check

Phase 7: Cleanup (2h)
├─ Remove Gulp
├─ Update docs
└─ Create summary

Phase 8: CI/CD (2h)
└─ Verify in CI pipeline
```

**Total Time: ~27 hours (3-4 days)**

## Quick Start Commands

### Run Existing Build (Gulp)
```bash
cd engine
npm run build                    # Builds with Gulp
ls -la dist/                     # Check output
npm run copy-dist                # Copy to public/
```

### After Migration (Vite)
```bash
cd engine
npm run build                    # Builds with Vite
npm run build:watch              # Watch mode for dev
ls -la dist/                     # Check output
```

### Run Tests
```bash
# From root directory

# Unit tests (engine build & API)
npm run test:unit

# E2E tests (frontend integration)
npm run test:e2e

# E2E tests with UI
npm run test:e2e:ui

# E2E tests in headed mode (see browser)
npm run test:e2e:headed

# E2E tests in CI mode
npm run test:e2e:ci
```

## File Changes Summary

### Files to Modify
- `engine/vite.config.cjs` - Main Vite configuration
- `engine/src/index.js` - Entry point (may need updates)
- `engine/package.json` - Update build scripts
- Add: `engine/vite-plugins/` - Custom plugins

### Files to Create
- `tests/engine/engine-build.test.js` - Build verification
- `tests/engine/engine-api.test.js` - API tests
- `tests/engine-integration.spec.ts` - Integration tests
- `tests/timeline-actions.spec.ts` - Timeline tests

### Files to Remove (After Success)
- `engine/gulpfile.js`
- Gulp dependencies from `engine/package.json`

### Files to Keep Unchanged
- `engine/src/**/*.js` - All source files
- `engine/lib/**/*.js` - All library files
- Root `package.json` - Should work without changes
- Frontend code - Should work without changes

## Success Metrics

| Metric | Gulp | Vite Target |
|--------|------|-------------|
| Build time | ~30s | ≤30s (ideally faster) |
| Bundle size | ~4MB | ≤4MB (ideally smaller) |
| Watch rebuild | N/A | <2s |
| All tests pass | ✓ | ✓ |
| Browser errors | 0 | 0 |

## Risk Mitigation

### Low Risk
✅ Keep Gulp in git history
✅ Can revert quickly if needed
✅ Comprehensive test coverage
✅ No frontend changes needed

### Rollback Plan
If something goes wrong:
```bash
git checkout HEAD -- engine/
cd engine
npm install
npm run build
```

## Benefits After Completion

### Immediate
- ✅ Unified build system (Vite everywhere)
- ✅ Faster development iteration
- ✅ Better source maps for debugging
- ✅ Modern build tooling

### Future
- ✅ Ready for TypeScript conversion
- ✅ Tree-shaking for smaller bundles
- ✅ Better code splitting options
- ✅ Hot Module Replacement (HMR)
- ✅ Modern JS features support

## Next Steps After This Migration

1. ✅ **Engine on Vite** (this migration)
2. 🔜 **Engine to TypeScript** - Convert .js → .ts
3. 🔜 **Full TypeScript Monorepo** - Type safety everywhere
4. 🔜 **Optimization** - Tree-shaking, code splitting
5. 🔜 **Modern Tooling** - Consider Turborepo/Nx

## Questions & Answers

**Q: Will this break the frontend?**
A: No, we maintain identical output format. Extensive tests ensure this.

**Q: Can we revert if needed?**
A: Yes, Gulp files stay in git history. Revert is simple.

**Q: How long will this take?**
A: ~27 hours of work over 3-4 days with proper testing.

**Q: Why not keep Gulp?**
A: Gulp is older tech, Vite is faster and better for TypeScript.

**Q: Will bundle size change?**
A: Should be same or smaller. We test this explicitly.

**Q: What about browser compatibility?**
A: We maintain all shims and test in Chrome, Firefox, Safari.

## Getting Started

### 1. Review the Full Plan
Read `ENGINE_VITE_MIGRATION_PLAN.md` for detailed steps

### 2. Run Current Build
```bash
cd engine
npm run build
```

### 3. Examine Output
```bash
ls -la engine/dist/
cat engine/dist/wickengine.js | head -100
```

### 4. Run Existing Tests
```bash
npm run test:e2e
```

### 5. Start Implementation
Follow phases in `ENGINE_VITE_MIGRATION_PLAN.md`

## Need Help?

- See `ENGINE_VITE_MIGRATION_PLAN.md` for detailed instructions
- Check existing `engine/vite.config.cjs` as starting point
- Look at root `vite.config.js` for reference
- Review `tests/smoke.spec.ts` for existing test patterns

---

**Created:** October 22, 2025
**Status:** Ready to start implementation
**Estimated Completion:** 3-4 days

