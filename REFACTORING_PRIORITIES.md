# Refactoring Priorities for Wick Editor

## 🔴 **Priority 1: Type Safety (Critical)**

### Issue
- **43+ instances of `any` type** throughout the codebase
- `project: any`, `paper: any`, `error: any` in Editor component
- `[key: string]: any` index signature in EditorCore
- Missing proper types for Wick Engine objects

### Impact
- **High risk of runtime errors**
- **Poor IDE support** (no autocomplete, no type checking)
- **Difficult to refactor** safely
- **Maintenance nightmare**

### Recommendation
1. **Create proper TypeScript definitions for Wick Engine**
   - Define `Wick.Project`, `Wick.Clip`, `Wick.Frame`, etc. types
   - Add to `types/engine.types.ts` or use declaration merging

2. **Replace `any` with proper types**
   ```typescript
   // Instead of:
   project: any = null;
   
   // Use:
   project: WickProject | null = null;
   ```

3. **Remove index signature abuse**
   ```typescript
   // Instead of:
   [key: string]: any;
   
   // Use proper typed properties
   ```

**Estimated Impact**: 🔥 **High** - Foundation for all other refactoring

---

## 🟠 **Priority 2: Extract Type Definitions for Wick Engine**

### Issue
- Wick Engine is JavaScript (in `engine/src/`)
- Editor uses `window.Wick.*` with no types
- Type definitions exist but are incomplete

### Recommendation
Create comprehensive type definitions:

```typescript
// types/engine.types.ts
declare namespace Wick {
  class Project {
    serialize(): SerializedProject;
    activeTool: string;
    selection: Selection;
    // ... all properties
  }
  
  class Clip { /* ... */ }
  class Frame { /* ... */ }
  // ... etc
}

interface Window {
  Wick: typeof Wick;
  paper: any; // Paper.js types
}
```

**Estimated Impact**: 🟡 **Medium-High** - Enables type safety improvements

---

## 🟡 **Priority 3: Split Large Class Components**

### Issue
- **EditorCore.ts**: 2,333 lines
- **Editor.tsx**: 1,475 lines (part of larger file)
- **57 calls to `projectDidChange`** - tight coupling
- Monolithic class with too many responsibilities

### Recommendation
Break into focused modules:

```
src/Editor/
├── core/
│   ├── EditorCore.ts (orchestrator only)
│   ├── ProjectManager.ts (project operations)
│   ├── ToolManager.ts (tool management)
│   ├── SelectionManager.ts (selection operations)
│   ├── ExportManager.ts (export operations)
│   └── HistoryManager.ts (undo/redo)
├── hooks/
│   ├── useProject.ts
│   ├── useEditorState.ts
│   └── useAutoSave.ts
└── services/
    ├── ProjectService.ts
    └── StorageService.ts (already started with ProjectStorage)
```

**Benefits**:
- Easier to test
- Better separation of concerns
- Easier to maintain
- Can gradually migrate to hooks

**Estimated Impact**: 🟡 **Medium** - Improves maintainability

---

## 🟢 **Priority 4: Modernize React Patterns**

### Issue
- Using `UNSAFE_componentWillMount` (deprecated)
- Class components everywhere
- Large state objects
- Prop drilling through many levels

### Recommendation

**Option A: React Context for State (Recommended)**
```typescript
// contexts/EditorContext.tsx
const EditorContext = createContext<EditorContextValue | null>(null);

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};
```

**Option B: State Management Library (Zustand/Jotai)**
```typescript
// stores/editorStore.ts
import create from 'zustand';

interface EditorStore {
  project: WickProject | null;
  setProject: (project: WickProject) => void;
  // ... other state
}

export const useEditorStore = create<EditorStore>((set) => ({
  project: null,
  setProject: (project) => set({ project }),
}));
```

**Benefits**:
- Eliminates prop drilling
- Better performance (selective re-renders)
- Easier to test
- Modern React patterns

**Estimated Impact**: 🟢 **Medium** - Improves developer experience

---

## 🟢 **Priority 5: Extract Custom Hooks**

### Issue
- Logic mixed with component lifecycle
- Hard to reuse logic
- Difficult to test

### Recommendation
Extract to custom hooks:

```typescript
// hooks/useProjectPersistence.ts
export const useProjectPersistence = (project: WickProject | null) => {
  useEffect(() => {
    if (!project) return;
    const interval = setInterval(() => {
      ProjectStorage.saveCurrentProject(/* ... */);
    }, 10000);
    return () => clearInterval(interval);
  }, [project]);
};

// hooks/useAutoSave.ts
export const useAutoSave = (project: WickProject | null) => {
  // Auto-save logic
};

// hooks/useEditorHistory.ts
export const useEditorHistory = (project: WickProject | null) => {
  // Undo/redo logic
};
```

**Estimated Impact**: 🟢 **Low-Medium** - Improves code reuse

---

## 🔵 **Priority 6: Improve Error Handling**

### Issue
- `error: any` type
- Global error handlers
- Inconsistent error handling

### Recommendation
- Create typed error classes
- Use error boundaries properly
- Add error recovery mechanisms

---

## 📋 **Recommended Refactoring Order**

1. **Type Safety** (Priority 1) - **Start here!**
   - Create Wick Engine type definitions
   - Replace `any` types gradually
   - This enables all other refactoring

2. **Split Large Files** (Priority 3)
   - Extract managers/services
   - Keep EditorCore as orchestrator
   - Makes code more testable

3. **Modernize React** (Priority 4)
   - Add React Context for state
   - Extract custom hooks
   - Gradually migrate patterns

4. **Polish** (Priorities 5-6)
   - Extract more hooks
   - Improve error handling
   - Add tests

---

## 🎯 **Quick Wins (Do First)**

1. **Fix `project: any`** - Create `WickProject` type
2. **Extract `ProjectStorage`** - Already done! ✅
3. **Replace `UNSAFE_componentWillMount`** - Move to `useEffect`
4. **Add proper error types** - Replace `error: any`

---

## 📊 **Metrics**

- **Total TypeScript files**: 120
- **Lines in EditorCore**: 2,333
- **`any` types found**: 43+
- **`projectDidChange` calls**: 57
- **Class components**: ~10+

---

## 💡 **Why This Order?**

1. **Type Safety First**: Without types, refactoring is dangerous
2. **Split Before Modernizing**: Easier to modernize smaller pieces
3. **State Management Last**: Need types and structure first

---

## 🚀 **Next Steps**

Would you like me to:
1. **Start with type definitions** for Wick Engine?
2. **Extract a specific manager** (e.g., ProjectManager)?
3. **Create a React Context** for editor state?
4. **Something else?**

