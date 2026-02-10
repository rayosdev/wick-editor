# Flash Reborn Product Backlog

## 1) Product Goal

Build the fastest path from idea to publishable vector animation or small game on desktop and mobile, while keeping the mental model familiar to Flash-era creators.

## 2) Design and Product Principles

- Stage-first: the canvas is always the center of gravity.
- Timeline-first: animation controls are never more than one tap away.
- Progressive power: beginner path is simple, advanced controls are nearby.
- Touch-native parity: mobile can complete the same core flows as desktop.
- Authoring confidence: every action has clear feedback, undo safety, and visible state.

## 3) Current Gaps Anchored In Code

- Breakpoint-only adaptation without true touch model: `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Editor.tsx:1059`.
- Small layout flagged as not implemented: `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/_editor.scss:56`.
- Empty mobile container stylesheet: `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Panels/MobileContainer/_mobilecontainer.scss`.
- Missing actions (`NYI`): `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/actionMap.ts:91` and `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/actionMap.ts:116`.
- Shallow outliner depth cap: `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Panels/Outliner/Outliner.tsx:39`.
- Mobile settings omit shortcuts tab: `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Modals/SettingsModal/SettingsModal.tsx:130`.
- Desktop menu contains debug actions (`cache save/load`): `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Panels/MenuBar/MenuBar.tsx:82`.

## 4) Prioritized Backlog

### P0 (Must Ship First)

### UX-001 Remove debug-only menu actions from creator UI

- Priority: `P0`
- Effort: `S`
- Dependencies: none
- Acceptance criteria:
- `cache save` and `cache load` are hidden behind a developer flag or removed from production menu.
- Menu actions visible to creators are only project-relevant.
- No regression in existing save/open workflows.

### UX-002 Finish mobile shell baseline

- Priority: `P0`
- Effort: `M`
- Dependencies: UX-001
- Acceptance criteria:
- `/src/Editor/Panels/MobileContainer/_mobilecontainer.scss` has explicit layout tokens and states.
- Portrait and landscape layouts avoid overlap for top bar, toolbox, stage, and bottom tabs.
- Hit targets are minimum `44x44` CSS px for all mobile controls.

### UX-003 Persist mobile workspace context

- Priority: `P0`
- Effort: `S`
- Dependencies: UX-002
- Acceptance criteria:
- Selected mobile tab persists across non-destructive rerenders.
- Selected mobile tab and inspector sub-tab restore on app refresh.
- Persistence can be reset from settings.

### UX-004 Implement missing core actions (group + add tween)

- Priority: `P0`
- Effort: `M`
- Dependencies: none
- Acceptance criteria:
- `createGroupFromSelection` no longer logs `NYI`; performs grouping with undo support.
- `addTweenToSelection` no longer logs `NYI`; adds tween where selection supports it.
- Actions are discoverable from desktop and mobile action surfaces.

### UX-005 Remove outliner depth hard cap

- Priority: `P0`
- Effort: `S`
- Dependencies: none
- Acceptance criteria:
- Outliner displays nested structures beyond depth 3 with virtualization or lazy rendering.
- Expand/collapse and selection still perform under large hierarchies.
- Drag/reorder remains stable across nested depths.

### UX-006 Add first-run creator onboarding

- Priority: `P0`
- Effort: `M`
- Dependencies: UX-002
- Acceptance criteria:
- New users get a short task-driven flow: draw shape, keyframe, play, export.
- Returning users can skip onboarding permanently.
- Onboarding completion is instrumented.

### UX-007 Instrument core funnel events

- Priority: `P0`
- Effort: `S`
- Dependencies: none
- Acceptance criteria:
- Events tracked: first shape, first keyframe, first tween, first script, first preview run, first export.
- Events include platform, viewport class, and session stage.
- Dashboard query can report mobile vs desktop completion rates.

### UX-008 Mobile command sheet (searchable actions)

- Priority: `P0`
- Effort: `M`
- Dependencies: UX-002, UX-004
- Acceptance criteria:
- Action sheet opens from top bar and supports text filter.
- Top 12 actions are grouped by current context (selection/tool/mode).
- Every listed action is executable and has undo/feedback behavior.

### P1 (Core Product Power)

### MOB-001 Mode-based mobile IA (`Draw`, `Animate`, `Code`, `Assets`, `Run`)

- Priority: `P1`
- Effort: `L`
- Dependencies: UX-002
- Acceptance criteria:
- Bottom mode rail switches full secondary interface, not only panel tabs.
- Stage remains visible while switching modes.
- Transitions maintain active selection and playhead state.

### MOB-002 Touch gesture engine

- Priority: `P1`
- Effort: `L`
- Dependencies: MOB-001
- Acceptance criteria:
- Pinch zoom, two-finger pan, and long-press context are implemented.
- Gesture conflicts with drawing tools are resolved by explicit mode rules.
- Gesture tutorial appears once and is replayable in settings.

### MOB-003 Touch timeline controls

- Priority: `P1`
- Effort: `L`
- Dependencies: MOB-001
- Acceptance criteria:
- Playhead scrub handle is touch-friendly and draggable.
- Keyframes are tappable chips with press states.
- Frame range drag handles support trim/extend and show snap feedback.

### MOB-004 Contextual property sheet

- Priority: `P1`
- Effort: `M`
- Dependencies: MOB-001
- Acceptance criteria:
- Property sheet changes by selection type (path/text/clip/frame/tween/asset).
- Properties expose transform/style/actions with clear labels.
- Numeric inputs support slider + stepper + direct edit.

### MOB-005 Selection UX overhaul

- Priority: `P1`
- Effort: `M`
- Dependencies: MOB-002
- Acceptance criteria:
- Selection bounding box includes visible handles sized for touch.
- Multi-select supports marquee and additive toggle.
- Deselect behavior is consistent across stage and panel interactions.

### ANI-001 Scene manager and scene-level timeline organization

- Priority: `P1`
- Effort: `M`
- Dependencies: UX-005
- Acceptance criteria:
- Users can create, rename, duplicate, reorder, and delete scenes.
- Scene switching preserves editor context and playhead per scene.
- Export and runtime honor scene order.

### ANI-002 Symbol library organization

- Priority: `P1`
- Effort: `M`
- Dependencies: UX-005
- Acceptance criteria:
- Asset/symbol library supports folders, tags, and type filters.
- Search supports name + tag query.
- Drag/drop between folders is undoable.

### ANI-003 Keyframe and easing editor

- Priority: `P1`
- Effort: `L`
- Dependencies: UX-004
- Acceptance criteria:
- Keyframe inspector exposes interpolation and timing controls.
- Easing graph editor supports presets + custom curve edits.
- Curve edits are previewable live on stage.

### ANI-004 Timeline breadcrumbs for nested clip editing

- Priority: `P1`
- Effort: `M`
- Dependencies: ANI-001
- Acceptance criteria:
- Breadcrumbs show full nesting path and active timeline level.
- Users can jump to any ancestor timeline in one tap/click.
- Breadcrumbs are visible on desktop and mobile.

### P2 (Game-Creation Differentiators)

### GAME-001 Visual behavior blocks (no-code logic layer)

- Priority: `P2`
- Effort: `L`
- Dependencies: MOB-001, ANI-004
- Acceptance criteria:
- Common behaviors (move, collide, score, timer, trigger) can be configured visually.
- Behavior blocks compile to runtime scripts.
- Users can switch between visual and code view without data loss.

### GAME-002 Prefab/component system

- Priority: `P2`
- Effort: `L`
- Dependencies: ANI-002
- Acceptance criteria:
- Users can create reusable components with exposed properties.
- Component updates can propagate to instances with opt-out.
- Prefab browser supports search, versioning, and insertion.

### GAME-003 In-editor run/debug panel

- Priority: `P2`
- Effort: `M`
- Dependencies: GAME-001
- Acceptance criteria:
- Runtime console, watched variables, and event trace are visible during preview.
- Break on error points to object/script/frame.
- Debug panel can be docked on desktop and opened as sheet on mobile.

### GAME-004 Performance profiler

- Priority: `P2`
- Effort: `M`
- Dependencies: GAME-003
- Acceptance criteria:
- Frame time, draw count, and script time are sampled in preview mode.
- Slow frame warnings indicate likely causes.
- Export diagnostics include known performance risks.

### P3 (Ecosystem and Growth)

### ECOS-001 Plugin API for tools/exporters

- Priority: `P3`
- Effort: `L`
- Dependencies: ANI-003
- Acceptance criteria:
- Plugin surface documented with stable contracts.
- Sample plugin demonstrates custom export target.
- Plugin load failures are sandboxed and non-fatal.

### ECOS-002 Starter template gallery

- Priority: `P3`
- Effort: `M`
- Dependencies: ANI-001, GAME-002
- Acceptance criteria:
- New project flow includes templates for animation, game loop, and interactive story.
- Templates include tutorial steps and sample assets.
- Template metadata is versioned.

### ECOS-003 Goal-based onboarding tracks

- Priority: `P3`
- Effort: `M`
- Dependencies: UX-006
- Acceptance criteria:
- Tracks: `Animate`, `Build a Game`, `Teach in Class`.
- Each track has measurable completion milestones.
- Track outcomes correlate to higher publish completion.

## 5) Suggested Delivery Sequence

### Release A (Weeks 1-4)

- UX-001, UX-002, UX-003, UX-004, UX-007

### Release B (Weeks 5-8)

- UX-005, UX-006, UX-008, MOB-001

### Release C (Weeks 9-14)

- MOB-002, MOB-003, MOB-004, MOB-005

### Release D (Weeks 15-20)

- ANI-001, ANI-002, ANI-003, ANI-004

### Release E (Weeks 21+)

- GAME-001 through GAME-004, then ecosystem tickets.

## 6) KPIs and Gates

- Time to first animation export: target `< 5 min`.
- Time to first playable interaction: target `< 10 min`.
- Mobile completion rate on core flow (`draw -> keyframe -> play -> export`) within 15% of desktop.
- Editor crash-free sessions: `>= 99.5%`.
- Undo confidence metric: `< 1%` unrecoverable action reports.

## 7) Definition of Done (Global)

- Feature works on desktop and mobile unless explicitly scoped otherwise.
- Keyboard and touch equivalents are documented.
- Accessibility pass complete (labels, focus order, contrast, touch targets).
- QA scenario is automated or added to regression checklist.
- Metrics are instrumented and visible on dashboard.
