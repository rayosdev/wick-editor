# Creative Workflow Acceptance Task

## Mission
Build a small project called **Animated Guessing Game** and verify that core editor workflows function end-to-end.

## Objective
Validate drawing, editing, timeline animation, scripting, project settings, and persistence in one coherent flow.

## Preconditions
- Editor is open and loaded.
- Welcome/onboarding modal is dismissed or skipped.
- Use desktop layout.

## Definition Of Done
- All required checkpoints pass.
- No critical console errors during the run.
- Project state survives save/load.

## Checkpoint Matrix

| ID | Checkpoint | Action | Pass Criteria | Evidence |
|---|---|---|---|---|
| 1 | Rename Project | Click project name in menu bar, set name to `Animated Guessing Game`, apply. | Menu bar shows new project name. | Screenshot of menu bar name after apply. |
| 2 | Draw Base Scene | Draw at least 3 visible objects on canvas (for example: background shape, character, button shape). | 3+ selectable objects exist on stage. | Screenshot with all objects visible. |
| 3 | Add Text | Add title and instructions text on canvas. | Two separate text elements visible and editable. | Screenshot with text visible. |
| 4 | Change Pen/Stroke Thickness | Select brush or shape tool and change size/width input, then draw/update object. | New stroke visibly thicker/thinner than baseline. | Before/after screenshot pair. |
| 5 | Edit Path | Use path cursor tool and move at least one point/handle on a path. | Shape geometry changes and remains selectable. | Screenshot showing modified path. |
| 6 | Change Colors | Change fill and stroke colors for selected objects. | Colors update and persist after deselect/reselect. | Screenshot of recolored objects. |
| 7 | Tween Animation | Create a tween between two positions/keyframes for one object. | Playback shows interpolated motion between frames. | Short screen capture or two timeline screenshots. |
| 8 | Make Interactive Button | Convert selected shape/object to button and add click script. | Object behaves as button instance. | Inspector/outliner screenshot showing button type. |
| 9 | Alert Script In Code Editor | Add script to button (click event) that runs `alert(...)`. | Clicking button in preview triggers alert. | Screenshot of preview + alert. |
| 10 | Guessing Game Logic | Add script that asks for input and branches correct/incorrect. | Both success and failure paths are reachable. | Two runs captured (correct vs wrong guess). |
| 11 | Save Project | Save project using normal save flow or cache save debug button. | Save operation completes without error toast. | Screenshot of success toast/log. |
| 12 | Load Project | Reload from saved file or cache load debug button. | Project restores with scene + scripts + timeline. | Screenshot after load with expected scene. |
| 13 | Regression Replay | Re-run preview after load. | Animation and scripted interactions still work. | Screenshot/video of replay. |
| 14 | Stability Check | Review console logs for critical runtime errors. | No blocking errors (TypeError/ReferenceError impacting flow). | Console export or log snippet. |

## Script Snippets For Mission

### Button Alert Script
```js
alert("Button clicked");
```

### Guessing Game Script (Simple)
```js
const target = 3;
const raw = prompt("Guess a number between 1 and 5");
const guess = Number(raw);

if (guess === target) {
  alert("Correct guess");
} else {
  alert("Try again");
}
```

## Playwright Hook Map (Selector Hints)

These selectors are based on current code/tests and should be treated as primary candidates:

- Project name (open settings modal): `.menu-bar-project-name`
- Settings modal heading: `text=Project Settings`
- Project name input: `.simple-settings-modal-container input[name="name"]`
- Apply project settings: `button:has-text("Apply")`

- Brush tool: `#action-button-tooltip-tool-button-brush button`
- Path cursor tool: `#action-button-tooltip-tool-button-pathcursor button`
- Brush/size numeric input: `#settings-panel-container input.settings-numeric-input`

- Canvas wrapper: `#canvas-container-wrapper`
- Fallback canvas: `canvas`

- Toggle outliner: `#action-button-tooltip-outliner-toggle > button`
- Inspector script edit (default script row): `#action-button-tooltip-inspector-script-window-row-editdefault > button`
- Code editor root: `#wick-code-editor-resizeable`
- Code editor close: `#wick-code-editor-resizeable > div.wick-code-editor-drag-handle > button`

- Fill color picker container: `#fill-color-picker-container`
- Stroke color picker container: `#stroke-color-picker-container`

- Play button (preview): `input[type="image"][id="play-button-object"]`

- Debug cache persistence buttons:
  - Save: `button:has-text("cache save")`
  - Load: `button:has-text("cache load")`

## Automation Strategy

### Fully automatable now
- Rename project.
- Draw stroke/object on canvas.
- Change brush size.
- Open/close code editor paths.
- Cache save/cache load flow.

### Executable QA Specs
- Files:
  - `tests/qa/creative-workflow-subset.spec.ts`
  - `tests/qa/creative-workflow-animation-color.spec.ts`
  - `tests/qa/creative-workflow-code-editor.spec.ts`
  - `tests/qa/creative-workflow-text-path.spec.ts`
- Run full QA workflow:
  - `npx playwright test tests/qa/*.spec.ts --config=playwright.config.dev.ts --project=chromium`

### Semi-automatable
- Tween verification (UI plus project-state introspection).
- Color changes through UI pickers (popover interactions vary).
- Code editor alert/prompt flows are automated via equivalent script probes in `tests/qa/creative-workflow-code-editor.spec.ts` (`this.__qaProbe`, `this.__guessResult`) to keep runs deterministic in headless mode.

### Best manual validation
- Visual quality of path edits.
- Guessing game usability and script behavior with prompts/alerts.

## Suggested Scoring

- Required checkpoints: 1 through 12.
- Optional hardening: 13 and 14.
- Pass threshold: all required checkpoints pass.
