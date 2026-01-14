# Test Commands Reference

## 🧪 Running Tests

### Quick Tests

```bash
# Brush workflow test (your requested test)
npm run test:e2e -- tests/brush-workflow.spec.ts --project=chromium

# Brush workflow with visible browser
npm run test:e2e:headed -- tests/brush-workflow.spec.ts --project=chromium

# Smoke test (basic loading)
npm run test:e2e -- tests/smoke.spec.ts --project=chromium

# Drawing test
npm run test:e2e -- tests/drawing-test.spec.ts --project=chromium
```

### All Tests

```bash
# All unit tests (build verification)
npm run test:unit -- tests/engine

# All E2E tests
npm run test:e2e -- tests/*.spec.ts --project=chromium

# Everything
npm run test:unit -- tests/engine && npm run test:e2e -- tests/*.spec.ts --project=chromium
```

### Test Options

```bash
# Run with UI (interactive)
npm run test:e2e:ui -- tests/brush-workflow.spec.ts

# Run in headed mode (see browser)
npm run test:e2e:headed -- tests/brush-workflow.spec.ts --project=chromium

# Run with debug
npm run test:e2e:debug -- tests/brush-workflow.spec.ts --project=chromium

# Run specific test by name
npm run test:e2e -- tests/brush-workflow.spec.ts --project=chromium --grep "select brush"
```

---

## 📋 Test Files

### Engine Tests (Unit)
- `tests/engine/engine-build.test.js` - Build verification

### E2E Tests (Playwright)
- `tests/smoke.spec.ts` - Basic loading
- `tests/tool-interaction.spec.ts` - Tool selection
- `tests/drawing-test.spec.ts` - Drawing functionality
- **`tests/brush-workflow.spec.ts`** - **Complete brush workflow** ✨
- `tests/settings-panel.spec.ts` - Settings verification
- `tests/debug-engine.spec.ts` - Diagnostic/console capture

---

## 🎯 Your Requested Test

**Test:** Open page → Select brush → Change size → Draw stroke

**Command:**
```bash
npm run test:e2e:headed -- tests/brush-workflow.spec.ts --project=chromium
```

**What it does:**
1. ✓ Loads the editor
2. ✓ Clicks brush tool button
3. ✓ Changes brush size from 10 to 25
4. ✓ Draws a wavy stroke on canvas
5. ✓ Verifies no errors occurred
6. ✓ Confirms stroke was added to project

**Expected output:**
```
Step 1: Loading page...
✓ Page loaded
✓ Wick engine loaded

Step 2: Selecting brush tool...
✓ Brush tool selected

Step 3: Changing brush size...
  Initial brush size: 10
  New brush size: 25
✓ Brush size changed to 25

Step 4: Drawing stroke on canvas...
  Drawing from (465, 310)
  Stroke drawn
✓ Stroke completed

Step 5: Checking for errors...
✓ No errors

Step 6: Verifying stroke was added to project...
✓ Stroke added to project

==================================================
✅ COMPLETE WORKFLOW TEST PASSED
==================================================
```

---

## 🔍 Debug Tests

```bash
# See all console output
npm run test:e2e -- tests/debug-engine.spec.ts --project=chromium

# Find UI element selectors
npm run test:e2e -- tests/find-brush-settings.spec.ts --project=chromium
```

---

## ⚡ Quick Start

```bash
# 1. Make sure dev server is NOT running
# (tests will start their own server)

# 2. Run the brush workflow test
npm run test:e2e:headed -- tests/brush-workflow.spec.ts --project=chromium

# 3. Watch the browser perform the actions automatically!
```

---

## 📊 Expected Results

All tests should pass:
- ✅ Unit tests: 22/22
- ✅ E2E tests: All passing
- ✅ Brush workflow: 2/2 passing

If any test fails, it means there's a regression that needs to be fixed.

---

## 🐛 Troubleshooting

### Test fails with "Connection refused"
**Fix:** The test auto-starts the server. Just wait a bit longer or kill any existing server:
```bash
# Kill existing server
lsof -ti:3002 | xargs kill -9
# Run test again
```

### Test times out
**Fix:** Increase timeout:
```bash
npm run test:e2e -- tests/brush-workflow.spec.ts --project=chromium --timeout=120000
```

### Can't see what's happening
**Fix:** Use headed mode:
```bash
npm run test:e2e:headed -- tests/brush-workflow.spec.ts --project=chromium
```

---

**Quick command:** `npm run test:e2e:headed -- tests/brush-workflow.spec.ts --project=chromium`

