# Timeline QA Audit

## Summary
- The DOM timeline now has a dedicated QA harness for deterministic desktop and mobile coverage.
- The highest-value regression surface is keyframe insertion, tween-strip interaction, playhead sync, markers/work area, and mobile long-press/touch behavior.
- Desktop Chromium coverage is green across the focused DOM suites.
- Mobile Chromium coverage is green except for touch layer reorder, which remains an explicit `fixme` because the input synthesis path is still unreliable.

## Current automated coverage
- Unit coverage:
  - `tests/timeline-double-click-menu-mode.test.ts` (5 tests)
  - `tests/timeline-keyframe-insertion.test.ts` (4 tests)
- Desktop Playwright coverage:
  - `tests/timeline-dom-editing.spec.ts` (17 Chromium tests)
  - `tests/timeline-dom-markers-workarea.spec.ts` (2 Chromium tests)
  - `tests/timeline-dom-playback-sync.spec.ts` (2 Chromium tests)
  - `tests/timeline-renderer-switch.spec.ts`
- Mobile Playwright coverage:
  - `tests/timeline-dom-mobile.spec.ts` (5 passing tests, 1 explicit `fixme`)
- Audit artifacts:
  - `output/playwright/timeline-qa/desktop-options-panel.png`
  - `output/playwright/timeline-qa/desktop-tween-strip-menu.png`
  - `output/playwright/timeline-qa/desktop-marker-footer-actions.png`
  - `output/playwright/timeline-qa/mobile-timeline-layout.png`
  - `output/playwright/timeline-qa/mobile-frame-long-press-menu.png`
  - `output/playwright/timeline-qa/mobile-tween-strip-menu.png`

## Current failures
- Touch layer reorder remains explicitly unsupported in `mobile-chrome` automation and is isolated as a `fixme` instead of being hidden behind a fallback.
- Marker actions still live in a horizontally scrollable footer, so they remain less discoverable than the primary timeline actions.

## Desktop interaction issues
- `P1` Advanced controls are intentionally hidden behind `Options`, so manual QA still depends on discoverability even though the state is now explicit and testable.
- `P1` Marker actions are easy to miss because they can be pushed off-screen in the footer overflow region.
- `P1` Large monolithic timeline tests previously hid multiple failures behind a single timeout; the suite is now split, but future additions should keep that granularity.
- `P2` Timeline context-menu actions are now model-backed in tests, but they still depend on subtle hit targets in the strip/grid area.

## Mobile interaction issues
- `P0` Touch layer reorder is still not reliable enough for a true end-to-end regression test.
- `P1` Long-press and gesture timing are sensitive to compressed layout and touch target placement, so the helper now uses a release buffer to avoid race conditions.
- `P1` The timeline still competes vertically with canvas controls on smaller screens, reducing confidence in touch hit targets.
- `P1` Layer reorder by touch is not yet stable enough for a trusted regression test.

## Discoverability issues
- `P1` `Options` still hides follow mode and density mode behind a secondary affordance, even though the DOM now exposes explicit open state and stable test hooks.
- `P1` Marker controls rely on footer scrolling, which is easy to miss in both manual QA and automation.
- `P2` Tween-strip affordances are stronger after the new menu work, but still benefit from visual audit screenshots because the target area is subtle.

## Recommended improvements
- `P0` Keep the DOM timeline interactions model-backed in tests: every critical UI action should assert the runtime model, not only DOM changes.
- `P0` Maintain explicit timeline testability hooks:
  - `data-testid="timeline-options-toggle"`
  - `data-testid="timeline-options-panel"`
  - `data-testid="timeline-follow-mode-group"`
  - `data-testid="timeline-density-mode-group"`
  - `data-testid="timeline-marker-actions"`
  - `data-testid="timeline-grid-workspace"`
  - `data-timeline-options-open="true|false"`
- `P1` Consider surfacing the most-used advanced controls more prominently on wide desktop layouts so follow/density changes are less hidden.
- `P1` Consider adding a stronger visual affordance for footer overflow so marker actions are easier to discover.
- `P1` Revisit mobile timeline spacing and control density to improve long-press and drag confidence.
- `P1` Add a product-level solution for touch layer reorder before promoting it from `fixme` to blocking regression coverage.
- `P2` Continue capturing headed audit screenshots when timeline UI structure changes so subtle regressions are visible before users report them.

## Priority backlog
- `P0` Make desktop DOM timeline regression tests deterministic and free of hidden-control timeouts.
- `P0` Replace the mobile touch layer reorder `fixme` with a reliable UI-level regression test.
- `P0` Keep touch layer reorder isolated as a documented limitation until it is reliable enough for real automation.
- `P1` Improve discoverability of advanced controls and marker footer actions.
- `P1` Expand screenshot-based audit coverage whenever timeline layout or control density changes.
- `P2` Add more visual assertions around tween-strip targeting and compressed mobile layouts after the core interaction suite is stable.
