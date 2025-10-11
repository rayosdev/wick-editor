# TypeScript Refactor Plan

## Current Status Assessment

**Date**: January 2025  
**TypeScript Version**: 5.9.3  
**Overall Progress**: ~85% converted to `.tsx`, but type quality needs improvement

### Migration Progress

- ✅ **98 files** converted to `.tsx/.ts`
- ⚠️ **17 files** still `.jsx` (need conversion)
- ❌ **50+ instances** of `unknown` types (need proper typing)
- ✅ **0 files** with `@ts-nocheck` (good!)
- ✅ **Strict mode** enabled

---

## The Real Problem: Type Quality vs File Conversion

The current strategy focused on **renaming files** (`.jsx` → `.tsx`) but didn't address **type quality**. This created a false sense of completion.

### What We Have Now:
```typescript
// ❌ Technically TypeScript, but not actually type-safe
importFileAsAsset: (file: unknown) => void;
builtinPreviews: unknown;
projectData: unknown;
getSelectedTimelineObjects: (...args: unknown[]) => unknown;
```

### What We Need:
```typescript
// ✅ Proper TypeScript with actual type safety
importFileAsAsset: (file: File | WickAsset) => void;
builtinPreviews: Map<string, AssetPreview>;
projectData: WickProject;
getSelectedTimelineObjects: () => TimelineObject[];
```

---

## New 3-Phase Strategy

### Phase 1: Type System Foundation (PRIORITY)
**Goal**: Define core types that everything depends on  
**Time**: 1-2 weeks

#### 1.1 Create Core Type Definitions
Create `src/Editor/types/core.types.ts`:

```typescript
// Wick Engine Core Types
export interface WickProject {
  name: string;
  width: number;
  height: number;
  framerate: number;
  backgroundColor: string;
  root: WickClip;
  assets: WickAsset[];
  // ... other properties from engine
}

export interface WickClip {
  identifier: string;
  name: string;
  timeline: WickTimeline;
  transformation: Transformation;
  // ... other properties
}

export interface WickFrame {
  identifier: string;
  start: number;
  end: number;
  paths: WickPath[];
  clips: WickClip[];
  sounds: WickSound[];
  scripts: WickScript[];
  tweens: WickTween[];
}

export interface WickAsset {
  uuid: string;
  name: string;
  type: 'image' | 'sound' | 'clip';
  src: string;
}

export interface WickPath {
  identifier: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  pathData: string;
  // ... other properties
}

export interface WickTimeline {
  identifier: string;
  layers: WickLayer[];
}

export interface WickLayer {
  identifier: string;
  name: string;
  frames: WickFrame[];
  locked: boolean;
  hidden: boolean;
}

export interface WickTween {
  identifier: string;
  playheadPosition: number;
  transformation: Transformation;
  easing: EasingType;
}

export interface WickScript {
  identifier: string;
  src: string;
  name: string;
}

export interface WickSound {
  identifier: string;
  assetUUID: string;
  volume: number;
  start?: number;
  loop?: boolean;
}

export interface Transformation {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  opacity: number;
}

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

// Selection Types
export type TimelineObject = WickFrame | WickTween;
export type CanvasObject = WickPath | WickClip;
export type ScriptableObject = WickClip | WickFrame | WickProject;
export type SelectableObject = CanvasObject | TimelineObject | WickAsset;
```

#### 1.2 Create Editor Type Definitions
Create `src/Editor/types/editor.types.ts`:

```typescript
import { WickProject, WickAsset, CanvasObject, TimelineObject } from './core.types';

// Tool Settings
export interface ToolSettings {
  brushSize: number;
  brushColor: string;
  brushSmoothness: number;
  eraserSize: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
}

export type ToolSettingKey = keyof ToolSettings;

export interface ToolSettingRestrictions {
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

// Project Settings
export interface ProjectSettings {
  name?: string;
  width?: number;
  height?: number;
  framerate?: number;
  backgroundColor?: string;
}

// File Entries (for local storage)
export interface LocalFileEntry {
  handle: FileSystemFileHandle;
  name: string;
  lastModified: number;
}

// Builtin Previews
export interface BuiltinPreview {
  name: string;
  thumbnail?: string;
  projectData?: WickProject;
}

// Asset Library
export interface AssetLibraryItem extends WickAsset {
  inLibrary: boolean;
  preview?: string;
}

// Console Logs
export interface ConsoleLogEntry {
  id: string;
  method: 'log' | 'warn' | 'error' | 'info';
  data: unknown[];
  timestamp: number;
}

// Render Types
export type RenderType = 'gif' | 'video' | 'zip' | 'html' | 'image-sequence' | 'audio' | 'svg';

export interface RenderOptions {
  type: RenderType;
  progress: number;
  statusMessage: string;
}
```

#### 1.3 Create Selection Interface Types
Create `src/Editor/types/selection.types.ts`:

```typescript
import {
  WickProject,
  WickClip,
  WickFrame,
  WickPath,
  WickAsset,
  WickTween,
  CanvasObject,
  TimelineObject,
  ScriptableObject,
} from './core.types';

export interface SelectionInterface {
  // Getters
  getSelectedTimelineObjects(): TimelineObject[];
  getSelectedFrames(): WickFrame[];
  getSelectedTweens(): WickTween[];
  getSelectedCanvasObjects(): CanvasObject[];
  getSelectedPaths(): WickPath[];
  getSelectedClips(): WickClip[];
  getSelectedButtons(): WickClip[]; // Buttons are clips with special flag
  getSelectedAssetLibraryObjects(): WickAsset[];
  getSelectedSoundAssets(): WickAsset[];
  getSelectedImageAssets(): WickAsset[];
  getSelectedScriptableObject(): ScriptableObject | null;
  
  // Setters
  selectObject(object: CanvasObject | TimelineObject | WickAsset): void;
  selectObjects(objects: (CanvasObject | TimelineObject | WickAsset)[]): void;
  deselectObjects(objects: (CanvasObject | TimelineObject | WickAsset)[]): void;
  deselectAll(): void;
  
  // Checks
  isObjectSelected(object: CanvasObject | TimelineObject | WickAsset): boolean;
  
  // Attributes
  getSelectionAttribute(attributeName: string): string | number | boolean | null;
  setSelectionAttribute(attribute: string, newValue: string | number | boolean): void;
  
  // Movement
  moveSelection(target: WickFrame | WickLayer, index: number): void;
}
```

#### 1.4 Action Items for Phase 1

1. ✅ Create type definition files (above)
2. 🔧 Review Wick Engine source to validate types
3. 🔧 Add JSDoc comments to complex types
4. 🔧 Export types from central `types/index.ts`
5. 🔧 Run type checks, fix any initial errors

---

### Phase 2: Replace `unknown` Types (CURRENT PRIORITY)
**Goal**: Eliminate all `unknown` types with proper definitions  
**Time**: 2-3 weeks

#### Priority Order:

**2.1 Core Editor (Week 1)**
- `src/Editor/EditorCore.ts` - **60+ instances** of `unknown`
  - Selection methods
  - Tool settings
  - Project manipulation
  - Asset handling

**2.2 Editor Wrapper & Props (Week 1)**
- `src/Editor/EditorWrapper.tsx` - Props interface
- `src/Editor/Editor.jsx` - Main component (still `.jsx`!)

**2.3 Major Panels (Week 2)**
- `src/Editor/Panels/Timeline/Timeline.tsx`
- `src/Editor/Panels/Inspector/Inspector.jsx` (convert to `.tsx`)
- `src/Editor/Panels/Canvas/Canvas.jsx` (convert to `.tsx`)
- `src/Editor/Panels/Outliner/Outliner.jsx` (convert to `.tsx`)

**2.4 Modal & Popouts (Week 2-3)**
- `src/Editor/Modals/ModalHandler/ModalHandler.tsx`
- `src/Editor/PopOuts/WickCodeEditor/WickCodeEditor.tsx`
- `src/Editor/PopOuts/WickCodeEditor/ConsolePanel.tsx`

**2.5 Remaining Components (Week 3)**
- Asset Library
- Toolbox
- Menu Bar
- Mobile components

---

### Phase 3: Convert Remaining `.jsx` Files (2-3 weeks)
**Goal**: Complete file extension conversion with proper types from day one

#### Files to Convert (17 total):

**High Priority** (Core functionality):
1. `src/index.jsx` → `src/index.tsx`
2. `src/Editor/Editor.jsx` → `src/Editor/Editor.tsx`
3. `src/Editor/EditorCore.jsx` → Already done ✅
4. `src/Editor/EditorWrapper.jsx` → Already done ✅

**Medium Priority** (Main panels):
5. `src/Editor/Panels/Canvas/Canvas.jsx`
6. `src/Editor/Panels/Timeline/Timeline.jsx` → Already done ✅
7. `src/Editor/Panels/Inspector/Inspector.jsx`
8. `src/Editor/Panels/AssetLibrary/AssetLibrary.jsx`
9. `src/Editor/Panels/Toolbox/Toolbox.jsx`
10. `src/Editor/Panels/MenuBar/MenuBar.jsx`
11. `src/Editor/Panels/Outliner/Outliner.jsx`

**Lower Priority** (Supporting components):
12. `src/Editor/Panels/Outliner/OutlinerObject/OutlinerObject.jsx`
13. `src/Editor/Panels/Toolbox/ToolSettings/ToolSettings.jsx`
14. `src/Editor/Panels/MobileContainer/MobileContainer.jsx`
15. `src/Editor/Panels/MobileContainer/MobileInspector/MobileInspector.jsx` → Already done ✅
16. `src/Editor/PopOuts/WickCodeEditor/WickCodeEditor.jsx` → Already done ✅
17. `src/Editor/PopOuts/WickCodeEditor/ConsolePanel.jsx` → Already done ✅

---

## Conversion Best Practices

### For Each Component:

```typescript
// Step 1: Add proper prop types FIRST
interface ComponentProps {
  project: WickProject;  // NOT unknown!
  onProjectChange: (project: WickProject) => void;
  selectedObjects: CanvasObject[];
  // ... all props properly typed
}

// Step 2: Convert to functional component with typed props
const Component: React.FC<ComponentProps> = ({ 
  project, 
  onProjectChange,
  selectedObjects 
}) => {
  // Step 3: Type all state
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tool, setTool] = useState<ToolType>('brush');
  
  // Step 4: Type all refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Step 5: Type all callbacks
  const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    // ...
  };
  
  return (/* JSX */);
};

export default Component;
```

### Type Assertion Rules:

```typescript
// ❌ NEVER do this
const thing = data as any;

// ❌ AVOID if possible
const thing = data as unknown as SpecificType;

// ✅ DO THIS instead - type guards
function isWickClip(obj: unknown): obj is WickClip {
  return typeof obj === 'object' && 
         obj !== null && 
         'timeline' in obj &&
         'identifier' in obj;
}

if (isWickClip(selectedObject)) {
  // TypeScript now knows it's a WickClip
  console.log(selectedObject.timeline);
}
```

---

## Testing Strategy

### After Each Phase:

1. **Type Check**: `npx tsc --noEmit`
2. **Run Tests**: `npm test`
3. **Manual Testing**: Test affected UI components
4. **Build Check**: `npm run build`

### Validation Checklist:

- [ ] No `unknown` types in public APIs
- [ ] All props interfaces documented
- [ ] No `any` type assertions
- [ ] No TypeScript errors
- [ ] All tests passing
- [ ] Application builds successfully

---

## Timeline

| Phase | Duration | Goal |
|-------|----------|------|
| **Phase 1** | 1-2 weeks | Type foundations |
| **Phase 2** | 2-3 weeks | Replace `unknown` |
| **Phase 3** | 2-3 weeks | Convert `.jsx` files |
| **Total** | 5-8 weeks | Full type safety |

---

## Success Metrics

- ✅ **0 files** with `@ts-nocheck`
- ✅ **0 files** with `.jsx` extension
- ✅ **< 10 instances** of `unknown` (only where truly dynamic)
- ✅ **0 instances** of `any`
- ✅ **0 TypeScript errors** in strict mode
- ✅ **All tests passing**

---

## Quick Wins (Start Here)

These can be done immediately:

1. **Create type definition files** (Phase 1.1-1.3) - 1 day
2. **Fix `EditorWrapper.tsx`** - Replace 14 `unknown` types - 2 hours
3. **Fix `ConsolePanel.tsx`** - Already mostly typed - 1 hour
4. **Convert `src/index.jsx`** - Simple file - 1 hour

---

## Notes

- **Don't rush Phase 1** - Good types make everything else easier
- **Review Wick Engine types** - Match their structure exactly
- **Test incrementally** - Don't convert 10 files then test
- **Use type guards** - Avoid type assertions when possible
- **Document complex types** - Future you will thank you

---

## References

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- Current configs: `tsconfig.json`, `TYPESCRIPT_MIGRATION_STRATEGY.md`
