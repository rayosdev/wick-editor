# Editor.jsx → Editor.tsx Conversion Plan

**Target:** Convert main Editor component from class-based JSX to functional TypeScript component  
**Complexity:** VERY HIGH - 1420 lines, extends EditorCore (2051 lines)  
**Estimated Time:** 1-2 days  
**Risk Level:** HIGH ⚠️

---

## Current Architecture

```
Editor.jsx (1420 lines)
  ↓ extends
EditorCore.ts (2051 lines) - ALREADY TYPESCRIPT ✅
  ↓ extends
React.Component
```

**Key Challenge:** Editor is a **stateful class component** that:

- Extends `EditorCore` (which has 60+ methods)
- Has complex state with 20+ properties
- Uses lifecycle methods (componentDidMount, componentDidUpdate, UNSAFE_componentWillMount)
- Manages refs to child components
- Has 30+ instance methods
- Uses throttled resize handlers
- Manages autosave, modals, toasts, hotkeys, etc.

---

## Strategy: Incremental Approach

Given the complexity, I recommend a **phased conversion** rather than all at once:

### Phase 1: TypeScript-ify (Keep as Class) ⭐ **RECOMMENDED START**

**Time:** 2-3 hours  
**Risk:** LOW  
**Goal:** Convert to TypeScript while keeping class structure

**Steps:**

1. Rename `Editor.jsx` → `Editor.tsx`
2. Create interface for state
3. Add type annotations to methods
4. Fix any type errors
5. Test thoroughly

**Benefits:**

- ✅ Get to 94% TypeScript coverage immediately
- ✅ Low risk (structure unchanged)
- ✅ Can stop here if needed
- ✅ Makes future refactoring easier

### Phase 2: Extract Custom Hooks (Preparation)

**Time:** 4-6 hours  
**Risk:** MEDIUM  
**Goal:** Create reusable hooks from Editor logic

**Extract these as hooks:**

- `useHotKeys` - Hot key management
- `useAutosave` - Autosave logic
- `useModalQueue` - Modal queueing system
- `useResizePanels` - Panel resize handlers
- `useToast` - Toast notifications
- `useColorPicker` - Color picker state
- `useProject` - Project lifecycle

**Benefits:**

- Breaks down complexity
- Makes logic reusable
- Easier to test
- Sets up for Phase 3

### Phase 3: Convert to Functional Component

**Time:** 8-12 hours  
**Risk:** HIGH  
**Goal:** Full modern React with hooks

**Steps:**

1. Convert class to function
2. Convert `this.state` → `useState` (or better: `useReducer`)
3. Convert lifecycle methods:
   - `componentDidMount` → `useEffect(..., [])`
   - `componentDidUpdate` → `useEffect(..., [deps])`
   - `UNSAFE_componentWillMount` → logic in function body
4. Convert refs: `this.canvasComponent` → `useRef()`
5. Convert instance properties to refs or state
6. Use custom hooks from Phase 2
7. Extensive testing

**Benefits:**

- ✅ Modern React patterns
- ✅ Better performance (potentially)
- ✅ Easier to understand and maintain
- ✅ Can use modern React features

---

## Recommendation

**Start with Phase 1** (TypeScript-ify) today:

- Get immediate benefit (94% TS coverage)
- Low risk to production
- Foundation for future work

**Do Phase 2 & 3 later** when:

- You have dedicated time (1-2 full days)
- You can do extensive testing
- You're making other major changes to Editor

---

## Phase 1 Detailed Plan (TypeScript-ify)

### Step 1: Define Interfaces (30 min)

```typescript
interface WarningModalInfo {
  description: string;
  title: string;
  acceptText: string;
  cancelText: string;
  acceptAction: () => void;
  cancelAction: () => void;
}

interface OnionSkinningColors {
  backward: string;
  forward: string;
}

interface CodeEditorWindowProperties {
  width: number;
  height: number;
  x: number;
  y: number;
  minWidth: number;
  minHeight: number;
  consoleHeight: number;
  consoleOpen: boolean;
  fontSize: number;
  theme: string;
}

interface ResizeProps {
  onStopResize: (args: { domElement: HTMLElement; component: any }) => void;
  onStopPopoutOutlinerResize: (args: {
    domElement: HTMLElement;
    component: any;
  }) => void;
  onStopInspectorResize: (args: {
    domElement: HTMLElement;
    component: any;
  }) => void;
  onStopAssetLibraryResize: (args: {
    domElement: HTMLElement;
    component: any;
  }) => void;
  onStopTimelineResize: (args: {
    domElement: HTMLElement;
    component: any;
  }) => void;
  onStopCodeEditorResize: (args: {
    domElement: HTMLElement;
    component: any;
  }) => void;
  onResize: () => void;
  onWindowResize: () => void;
}

interface EditorState {
  project: any; // Will be typed as WickProject once we import types
  previewPlaying: boolean;
  activeModalName: string | null;
  activeModalQueue: string[];
  codeEditorOpen: boolean;
  scriptToEdit: string;
  showCanvasActions: boolean;
  showBrushModes: boolean;
  showCodeErrors: boolean;
  codeError: any;
  popoutOutlinerSize: number;
  outlinerPoppedOut: boolean;
  inspectorSize: number;
  timelineSize: number;
  assetLibrarySize: number;
  consoleLogs: any[];
  warningModalInfo: WarningModalInfo;
  renderProgress: number;
  renderType: string;
  renderStatusMessage: string;
  customHotKeys: Record<string, any>;
  colorPickerType: "swatches" | "spectrum" | "gradient";
  lastColorsUsed: string[];
  exporting: boolean;
  useCustomOnionSkinningColors: boolean;
  customOnionSkinningColors: OnionSkinningColors;
  onionSkinningWasOn: boolean;
  localSavedFiles: any[];
  codeEditorWindowProperties?: CodeEditorWindowProperties;
}
```

### Step 2: Rename File (1 min)

```bash
mv src/Editor/Editor.jsx src/Editor/Editor.tsx
```

### Step 3: Update Class Declaration (2 min)

```typescript
import React from "react";
// ... other imports ...

class Editor extends EditorCore {
  // Type instance properties
  project: any = null;
  paper: any = null;
  editorVersion: string = version;
  error: any = null;
  _lastAutosave: number = 0;

  fontInfoInterface: any;
  hotKeyInterface: any;
  actionMapInterface: any;
  scriptInfoInterface: any;

  openProjectFileFromClient: () => void;
  openAssetFileFromClient: () => void;

  maxLastColors: number = 8;
  _onEyedropperPickedColor: (color: string) => void = () => {};

  resizeProps: ResizeProps;
  canvasComponent: any = null;
  timelineComponent: any = null;
  lastUsedTool: string = "cursor";
  builtinPreviews: Record<string, any> = {};

  // ... rest of class
}
```

### Step 4: Type Methods (1-2 hours)

Add return types and parameter types to all methods:

```typescript
hidePreloader = (): void => {
  // ... implementation
};

showWaitOverlay = (message?: string): void => {
  // ... implementation
};

updateLastColors = (color: string): void => {
  // ... implementation
};

// etc...
```

### Step 5: Test & Fix (30 min)

- Run TypeScript compiler
- Fix any type errors
- Test in browser
- Verify all functionality works

---

## Shall We Start Phase 1?

**YES** → I'll convert Editor.jsx to Editor.tsx (TypeScript class)  
**NO** → We can leave it as-is for now  
**LATER** → We can plan for full functional conversion

What would you like to do?
