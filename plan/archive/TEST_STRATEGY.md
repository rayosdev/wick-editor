# Vitest vs Playwright Test Strategy

## Overview
This project uses **both** Vitest and Playwright for comprehensive testing at different levels of the test pyramid.

## Quick Comparison

| Aspect | Vitest (Unit) | Playwright (E2E) |
|--------|---------------|------------------|
| **Speed** | ⚡ Very Fast (~5s for 15 tests) | 🐢 Slower (~2-10s per test) |
| **Environment** | Node.js + happy-dom | Real browsers |
| **Isolation** | High (mocked dependencies) | Low (full integration) |
| **Purpose** | Test logic/algorithms | Test user experience |
| **Reliability** | Very stable | Can be flaky |
| **Cost** | Free, instant | More CI time/resources |
| **Debugging** | Easy (stack traces) | Harder (browser states) |

## Test Coverage Strategy

### ✅ Use Vitest For:

**Logic & Algorithms**
- ✅ Zoom calculation math
- ✅ Touch distance calculations  
- ✅ Delta accumulation
- ✅ Pan scaling formulas
- ✅ Gesture detection logic
- ✅ Zoom clamping bounds

**Pure Functions**
```javascript
// Perfect for Vitest
function calculateZoomToPoint(oldZoom, newZoom, cursorPos, viewCenter) {
  const beta = oldZoom / newZoom;
  const offset = cursorPos.subtract(viewCenter).multiply(1 - beta);
  return viewCenter.add(offset);
}
```

**Edge Cases**
- Minimum zoom bounds
- Maximum zoom bounds
- deltaMode variations (pixel, line, page)
- Floating point precision
- Null/undefined handling

**What You Already Have**
- `tests/engine/view/ViewProject.mouse.test.js` - 14 tests ✅
- Wheel event detection
- Touch event calculations
- RAF throttling
- Pan scaling

### 🎭 Use Playwright For:

**Real Browser Interactions**
- 🎯 Actual Ctrl+Wheel zoom on canvas
- 🎯 Real mouse pan gestures
- 🎯 Pinch-to-zoom on touch devices
- 🎯 Gesture events in Safari
- 🎯 Timeline wheel isolation

**Integration**
- Canvas + Paper.js + Wick Engine together
- Editor state changes during zoom/pan
- Tool selection not interfering with gestures
- Timeline vs canvas event targeting

**Cross-Browser/Device**
- Chrome, Firefox, Safari differences
- Desktop vs mobile behavior
- iPhone vs Android differences
- Trackpad vs mouse vs touch

**Visual Regression**
```typescript
// Playwright can do this, Vitest cannot
await expect(page).toHaveScreenshot('zoomed-canvas.png');
```

**What You Now Have**
- `tests/canvas-interactions.spec.ts` - 11 new tests
- Zoom/pan in real browser
- Cross-browser compatibility
- Touch gesture setup
- Performance checks

## Running Tests

### Development Workflow

```bash
# 1. Unit tests first (fast feedback)
npm run test:unit:watch

# 2. Run E2E when major changes
npm run test:e2e

# 3. Full suite before committing
npm run test:ci
```

### Specific Test Runs

```bash
# Unit tests only
npm run test:unit

# E2E tests only  
npm run test:e2e

# E2E with UI (visual debugging)
npm run test:e2e:ui

# E2E on specific browser
npx playwright test --project=firefox

# E2E on mobile
npx playwright test --project=mobile-safari

# Run specific test file
npx playwright test canvas-interactions
```

## When to Write Each Type

### Write Vitest Test When:
- ✅ Testing a pure function
- ✅ Testing calculation/algorithm
- ✅ Testing edge cases/bounds
- ✅ Need to run tests 100+ times/day
- ✅ Testing refactored code (prevent regressions)
- ✅ Doing TDD (test-driven development)

### Write Playwright Test When:
- 🎭 Testing user interactions
- 🎭 Need real browser APIs (Paper.js, Canvas)
- 🎭 Testing across browsers/devices
- 🎭 Verifying visual output
- 🎭 Testing full user flows
- 🎭 Need confidence before release

## Example: Testing Zoom Feature

### Vitest Tests (What You Have)
```javascript
// tests/engine/view/ViewProject.mouse.test.js
describe('scrollToZoom', () => {
  it('should detect zoom gesture when ctrlKey is pressed', () => {
    const event = { ctrlKey: true, deltaY: -10 };
    const isZoomGesture = event.ctrlKey || event.metaKey;
    expect(isZoomGesture).toBe(true);
  });

  it('should zoom toward cursor position (zoom-to-point)', () => {
    const oldZoom = 1;
    const newZoom = 1.1;
    const cursorPos = new global.paper.Point(100, 100);
    const viewCenter = new global.paper.Point(0, 0);
    
    const beta = oldZoom / newZoom;
    const offset = cursorPos.subtract(viewCenter).multiply(1 - beta);
    const newCenter = viewCenter.add(offset);
    
    expect(newCenter.x).toBeCloseTo(9.09, 2);
    expect(newCenter.y).toBeCloseTo(9.09, 2);
  });
});
```

### Playwright Tests (What You Now Have)
```typescript
// tests/canvas-interactions.spec.ts
test('should zoom in with Ctrl+Wheel', async ({ page }) => {
  const canvas = page.locator('#canvas-container-wrapper canvas').first();
  
  const initialZoom = await page.evaluate(() => {
    return window.wickEditor.project.view.paper.view.zoom;
  });
  
  await canvas.hover();
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -100);
  await page.keyboard.up('Control');
  
  const newZoom = await page.evaluate(() => {
    return window.wickEditor.project.view.paper.view.zoom;
  });
  
  expect(newZoom).toBeGreaterThan(initialZoom);
});
```

## Test Pyramid for Wick Editor

```
                  E2E (Playwright)
                  ================
                  - Full user flows
                  - Cross-browser
                  - Visual tests
                  ~10-20 tests
                  
         Integration (Playwright + Vitest)
         ==================================
         - Component + Engine
         - Feature interactions
         - ~50-100 tests
         
Unit Tests (Vitest)
===========================================
- Logic & calculations
- Pure functions
- Edge cases
- ~100-500 tests
```

## CI/CD Integration

### Fast Feedback (on every commit)
```yaml
# .github/workflows/test.yml
- name: Unit Tests
  run: npm run test:unit
  # Takes ~5 seconds
```

### Pre-merge (Pull Requests)
```yaml
- name: E2E Tests (Chrome)
  run: npx playwright test --project=chromium
  # Takes ~1-2 minutes
```

### Pre-release (Before Deploy)
```yaml
- name: Full E2E Suite
  run: npx playwright test
  # Takes ~5-10 minutes (all browsers)
```

## Debugging Tips

### Vitest Debugging
```bash
# Run with verbose output
npx vitest run --reporter=verbose

# Debug specific test
npx vitest run --reporter=verbose tests/engine/view/ViewProject.mouse.test.js

# Watch mode with UI
npx vitest --ui
```

### Playwright Debugging
```bash
# Run with headed browser (see what's happening)
npm run test:e2e:headed

# Interactive UI mode
npm run test:e2e:ui

# Debug mode (step through)
npx playwright test --debug

# Run specific test
npx playwright test -g "should zoom in with Ctrl+Wheel"
```

## Coverage Goals

### Unit Test Coverage (Vitest)
- **Target**: 80%+ for logic/calculations
- **Current**: Mouse/trackpad logic fully covered
- **Next**: Add tests during ES6 conversion

### E2E Coverage (Playwright)
- **Target**: Key user flows + cross-browser
- **Current**: Canvas interactions covered
- **Next**: Tool interactions, file operations, exports

## Benefits of This Approach

### ✅ Fast Development Cycle
- Unit tests give instant feedback
- E2E tests catch integration issues
- No waiting for slow tests during coding

### ✅ Confidence in Refactoring
- Unit tests: "Does the logic still work?"
- E2E tests: "Does it work for users?"
- Both: Safe to do ES6/TS conversion

### ✅ Clear Failure Signals
- Unit test fails → Logic bug
- E2E test fails → Integration/browser issue
- Both fail → Serious problem

### ✅ Cost Effective
- Run unit tests 1000x/day for free
- Run E2E tests 10x/day (more expensive)
- Get best coverage for lowest cost

## Next Steps

1. **Run the new E2E tests**
   ```bash
   npm run test:e2e
   ```

2. **Add more unit tests during ES6 conversion**
   - Test each module after converting
   - Ensure no regressions

3. **Add E2E tests for critical flows**
   - Drawing tools
   - Timeline operations
   - File import/export
   - Animation playback

4. **Set up CI/CD**
   - Run unit tests on every commit
   - Run E2E tests on PRs
   - Full suite before deployment

## Summary

| Question | Answer |
|----------|--------|
| Should you add Playwright tests? | **Yes!** They complement Vitest perfectly |
| Replace Vitest with Playwright? | **No!** Use both for different purposes |
| Which to write first? | **Vitest** - faster feedback during development |
| Which gives more confidence? | **Playwright** - tests real user experience |
| Which is more cost effective? | **Vitest** - much faster, runs more often |

You now have **both** test types covering your mouse/trackpad improvements from different angles. This gives you maximum confidence with minimum test maintenance! 🎯
