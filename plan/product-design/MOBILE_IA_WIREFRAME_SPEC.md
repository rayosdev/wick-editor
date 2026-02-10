# Mobile IA + Wireframe Spec

## 1) Objective

Define a touch-native information architecture for Wick Editor that preserves Flash-style stage/timeline workflows while making mobile authoring practical, fast, and learnable.

## 2) Scope

- In scope:
- Navigation model
- Screen regions and panel behaviors
- Touch gestures and interaction rules
- Mode-level wireframes
- Core creation flows
- Out of scope:
- Final visual language (colors/typography polish)
- Runtime engine changes not required for UI interaction

## 3) IA Model (Mobile)

### Global Top Bar (always visible)

- Left: `Project Menu` (new/open/export/settings/help)
- Center: `Project Name` + unsaved state dot
- Right: `Quick Save`

### Global Bottom Mode Rail (always visible)

- Modes:
- `Draw`
- `Animate`
- `Code`
- `Assets`
- `Run`

Each mode swaps the secondary workspace while keeping Stage context alive.

### Stage Is Persistent

- Stage stays visible across mode switches.
- Secondary controls appear as bottom sheet, side sheet, or docked panel depending on orientation.

## 4) Layout Regions

### Portrait

- Region A: Top Bar (`40-48px`)
- Region B: Tool Strip (`40-48px`, context-dependent)
- Region C: Stage viewport (`flex`)
- Region D: Context controls (`floating mini bar`)
- Region E: Mode Rail (`56px`)
- Region F: Mode Workspace Sheet (`30-45% height`, expandable)

### Landscape

- Region A: Compact Top Bar
- Region B: Left Tool Rail (`56px`)
- Region C: Stage viewport (`flex`)
- Region D: Right Workspace Sheet (`320-420px`)
- Region E: Bottom transport strip (timeline scrub/play in animate mode)

## 5) Wireframes (Textual)

## 5.1 Draw Mode

```text
+--------------------------------------------------+
| [≡]   My Project *                    [save]     |
| [tool group] [undo] [redo] [more]               |
|                                                  |
|                  STAGE VIEW                      |
|          selection box / handles / guides        |
|                                                  |
|       [zoom-] [zoom] [zoom+] [play]             |
|--------------------------------------------------|
| Draw | Animate | Code | Assets | Run            |
| [Draw workspace sheet: tool settings + actions]  |
+--------------------------------------------------+
```

## 5.2 Animate Mode

```text
+--------------------------------------------------+
| [≡]   My Project *                    [save]     |
| [timeline actions] [keyframe] [tween] [easing]  |
|                  STAGE VIEW                      |
|                                                  |
|--------------------------------------------------|
| Draw | Animate | Code | Assets | Run            |
| Playhead: |====o-------------------------------| |
| Layer 1:  |■■■■|----|■■|-----------------------| |
| Layer 2:  |----|■■■■|--|-----------------------| |
+--------------------------------------------------+
```

## 5.3 Code Mode

```text
+--------------------------------------------------+
| [≡]   My Project *                    [save]     |
| [object selector] [event selector] [run check]  |
|                  STAGE VIEW                      |
|--------------------------------------------------|
| Draw | Animate | Code | Assets | Run            |
| Script list: [onLoad] [onClick] [+ add script]  |
| Editor panel / console toggle                    |
+--------------------------------------------------+
```

## 5.4 Assets Mode

```text
+--------------------------------------------------+
| [≡]   My Project *                    [save]     |
| [search...] [filter] [upload] [builtin]         |
|                  STAGE VIEW                      |
|--------------------------------------------------|
| Draw | Animate | Code | Assets | Run            |
| [Assets grid/list with folders and tags]         |
+--------------------------------------------------+
```

## 5.5 Run Mode

```text
+--------------------------------------------------+
| [≡]   My Project *                    [save]     |
| [play/stop] [restart] [fps] [console]           |
|                  LIVE PREVIEW                    |
|--------------------------------------------------|
| Draw | Animate | Code | Assets | Run            |
| [runtime panel: logs/events/perf]                |
+--------------------------------------------------+
```

## 6) Interaction Rules

### Touch gestures

- Single tap:
- Select object or focus control.
- Double tap:
- Enter symbol/clip timeline when applicable.
- Long press (`>= 350ms`):
- Open context menu for selected object.
- Pinch:
- Zoom centered on pinch midpoint.
- Two-finger drag:
- Pan stage without changing active drawing tool.
- Lasso gesture:
- Multi-select on stage in Draw mode.

### Conflict resolution

- If active tool is drawing and two fingers are detected, force pan gesture.
- If long press begins on handle, prioritize transform handle action over context menu.
- If timeline sheet is expanded, horizontal swipe on stage does not scrub playhead.

## 7) Core Flows

### Flow A: First Animation in <5 Minutes

1. Open app.
2. Draw shape in `Draw`.
3. Switch to `Animate`.
4. Add keyframe and transform object.
5. Press play.
6. Export GIF/MP4 from project menu.

Success criteria:

- User can complete without opening settings.
- At most one hidden action per step.

### Flow B: Make Interactive Clip

1. Select object on stage.
2. Open context action `Make Interactive`.
3. Choose clip or button.
4. Switch to `Code` and add script event.
5. Validate in `Run`.

Success criteria:

- Conversion and script entry require no desktop-only control.

### Flow C: Asset-to-Scene Placement

1. Open `Assets`.
2. Search or filter.
3. Tap asset and place on stage.
4. Return to `Draw` with selection preserved.

Success criteria:

- Asset insertion requires <= 2 taps after selection.

## 8) Component Requirements

- Touch target min: `44x44px`.
- Visual state for all controls: default, hover (optional), pressed, disabled, selected.
- Numeric controls support:
- Tap-to-edit
- +/- stepper
- Drag scrub for rapid changes
- Mode rail items must include icon + text label for discoverability.

## 9) Accessibility Requirements

- `aria-label` on all icon-only controls.
- Predictable focus order for external keyboards.
- Contrast ratio at least WCAG AA for all text and actionable icons.
- Motion reduction option for panel transitions.

## 10) Telemetry (Required Events)

- `mobile_mode_switch`
- `mobile_tool_change`
- `mobile_gesture_pan`
- `mobile_gesture_pinch`
- `mobile_first_keyframe`
- `mobile_first_tween`
- `mobile_export_complete`
- `mobile_export_fail`

Each event payload includes:

- project UUID
- platform/os
- viewport size
- mode
- selection type

## 11) QA Matrix

- iPhone SE width class
- iPhone standard width class
- Android medium phone class
- iPad portrait + landscape
- External keyboard attached on tablet
- Touch + mouse hybrid device

## 12) Implementation Notes for Current Codebase

- Replace local tab memory in `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Util/MobileTabbedInterface/MobileTabbedInterface.tsx` with controlled state from `Editor`.
- Expand mobile menu actions in `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Modals/MobileMenu/MobileMenu.tsx` to include context-aware quick actions.
- Remove small-mode fallback assumptions in `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/_editor.scss`.
- Introduce gesture handlers at stage container level near `/Users/anders/Documents/_Projects/_Web/wick-editor/src/Editor/Panels/Canvas/Canvas.tsx`.
- Keep current desktop parity while iterating mobile shell behind feature flag.

## 13) Definition of Done

- All core flows (A/B/C) pass on phone portrait.
- No overlap/clipping across portrait/landscape.
- Creator can finish draw->animate->run->export without discovering hidden desktop affordances.
- Regression tests updated for mobile mode switching and key gestures.
