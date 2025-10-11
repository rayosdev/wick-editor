# Phase 3: React Modernization - Class to Functional Components

**Status:** 📋 Planning Phase  
**Start Date:** October 11, 2025  
**Prerequisites:** ✅ Phase 2 TypeScript Migration Complete  
**Goal:** Convert ~78 class components to modern functional components with hooks

---

## Executive Summary

Transform the Wick Editor from legacy class-based React architecture to modern functional components with hooks. This will improve performance, code maintainability, and align with current React best practices.

### Current State

- **97 total** `.tsx` files in Editor
- **~78 class components** (80% of codebase)
- **~19 functional components** (20% - mostly newer)
- **React 18.3.1** with legacy patterns

### Target State

- **~97 functional components** with hooks
- **Zero class components** in main codebase
- **Custom hooks** for shared logic
- **Modern React patterns** throughout

---

## Benefits & Rationale 🎯

### Performance Improvements

- ✅ **Smaller bundle size** - No class overhead
- ✅ **Faster renders** - Optimized function execution
- ✅ **Better tree-shaking** - Easier for bundlers to optimize
- ✅ **React.memo optimization** - Simpler than `PureComponent`

### Code Quality

- ✅ **Less boilerplate** - No `this`, `bind`, or constructors
- ✅ **Better composition** - Custom hooks for reusable logic
- ✅ **Cleaner lifecycle** - `useEffect` vs multiple lifecycle methods
- ✅ **Easier testing** - Pure functions are simpler to test

### Developer Experience

- ✅ **Modern patterns** - Align with React ecosystem
- ✅ **Better TypeScript** - Hooks have better type inference
- ✅ **Easier onboarding** - Standard React patterns
- ✅ **Future-proof** - React team's focus area

---

## Migration Strategy 📋

### Phase 3 Structure

**Session 1-2: Foundation & Simple Components (Week 1)**

- Small components without state
- Components with simple state
- ~15-20 components

**Session 3-4: Inspector & Input Components (Week 2)**

- Inspector row types
- Mobile inspector components
- Form inputs and controls
- ~20-25 components

**Session 5-6: Complex Panels (Week 3)**

- Timeline, Canvas, Toolbox
- Components with lifecycle methods
- ~15-20 components

**Session 7-8: Core Architecture (Week 4)**

- EditorCore refactoring
- Modal system
- Settings components
- ~10-15 components

**Session 9: Custom Hooks & Cleanup (Week 5)**

- Extract custom hooks
- Performance optimization
- Documentation

---

## Conversion Patterns 🔄

### Pattern 1: Simple Stateless Component

**Before (Class):**

```typescript
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

class MyComponent extends Component<MyComponentProps> {
  render() {
    return <div onClick={this.props.onClick}>{this.props.title}</div>;
  }
}
```

**After (Functional):**

```typescript
interface MyComponentProps {
  title: string;
  onClick: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onClick }) => {
  return <div onClick={onClick}>{title}</div>;
};
```

### Pattern 2: Component with State

**Before (Class):**

```typescript
interface MyComponentState {
  count: number;
}

class Counter extends Component<{}, MyComponentState> {
  constructor(props: {}) {
    super(props);
    this.state = { count: 0 };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return <button onClick={this.increment}>{this.state.count}</button>;
  }
}
```

**After (Functional):**

```typescript
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return <button onClick={increment}>{count}</button>;
};
```

### Pattern 3: Component with Lifecycle Methods

**Before (Class):**

```typescript
class DataFetcher extends Component<DataFetcherProps, DataFetcherState> {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: DataFetcherProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    this.cleanup();
  }

  fetchData = () => {
    /* ... */
  };
  cleanup = () => {
    /* ... */
  };

  render() {
    /* ... */
  }
}
```

**After (Functional):**

```typescript
const DataFetcher: React.FC<DataFetcherProps> = ({ id }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
    return () => cleanup(); // Cleanup on unmount
  }, [id]); // Re-run when id changes

  const fetchData = () => {
    /* ... */
  };
  const cleanup = () => {
    /* ... */
  };

  return {
    /* ... */
  };
};
```

### Pattern 4: PureComponent → React.memo

**Before (Class):**

```typescript
class ExpensiveComponent extends PureComponent<ExpensiveProps> {
  render() {
    return <div>{this.props.data}</div>;
  }
}
```

**After (Functional):**

```typescript
const ExpensiveComponent: React.FC<ExpensiveProps> = React.memo(({ data }) => {
  return <div>{data}</div>;
});
```

---

## Custom Hooks to Create 🪝

### 1. `useWickProject`

Encapsulate Wick project interactions:

```typescript
function useWickProject() {
  const project = useContext(WickProjectContext);

  const updateProject = (changes: any) => {
    /* ... */
  };
  const getActiveFrame = () => {
    /* ... */
  };

  return { project, updateProject, getActiveFrame };
}
```

### 2. `useEditorAction`

Simplify editor action calls:

```typescript
function useEditorAction() {
  const editorActions = useContext(EditorActionsContext);

  const executeAction = (actionName: string, ...args: any[]) => {
    editorActions[actionName]?.(...args);
  };

  return { executeAction, editorActions };
}
```

### 3. `useToolSettings`

Manage tool settings state:

```typescript
function useToolSettings(tool: string) {
  const [settings, setSettings] = useState(getToolSettings(tool));

  const updateSetting = (key: string, value: ToolSettingValue) => {
    /* ... */
  };

  return { settings, updateSetting };
}
```

### 4. `useInspectorValue`

Handle inspector input changes:

```typescript
function useInspectorValue(attribute: string, initialValue: any) {
  const [value, setValue] = useState(initialValue);
  const { project } = useWickProject();

  const updateValue = (newValue: any) => {
    setValue(newValue);
    project.setSelectionAttribute(attribute, newValue);
  };

  return [value, updateValue];
}
```

### 5. `useKeyboardShortcut`

Keyboard shortcut registration:

```typescript
function useKeyboardShortcut(
  keys: string,
  callback: () => void,
  deps: any[] = []
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      /* ... */
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [keys, ...deps]);
}
```

---

## Component Priority Matrix 🎯

### Tier 1: Quick Wins (Low Complexity)

**Estimated Time:** 1-2 weeks  
**Components:** ~30

- **Presentational Components** (no state, no lifecycle)

  - `OutlinerName.tsx`
  - `OutlinerTitle.tsx`
  - `InspectorTitle.tsx`
  - `ToolboxBreak.tsx`
  - `MenuBarButton.tsx`
  - `MenuBarSupportButton.tsx`
  - `OutlinerExpandButton.tsx`
  - All `*Preview.tsx` components

- **Simple Interactive Components** (basic state only)
  - `InspectorCheckbox.tsx`
  - `MobileInspectorCheckbox.tsx`
  - `InspectorTextInput.tsx`
  - `MobileInspectorTextInput.tsx`
  - `InspectorNumericInput.tsx`
  - `MobileInspectorNumericInput.tsx`
  - `InspectorNumericSlider.tsx`
  - `MobileInspectorNumericSlider.tsx`

### Tier 2: Medium Complexity

**Estimated Time:** 2-3 weeks  
**Components:** ~30

- **Inspector Components**

  - `Inspector.tsx`
  - `MobileInspector.tsx`
  - `InspectorInput.tsx`
  - `MobileInspectorInput.tsx`
  - `InspectorSelector.tsx`
  - `MobileInspectorSelector.tsx`
  - `InspectorDualNumericInput.tsx`
  - `MobileInspectorDualNumericInput.tsx`
  - `InspectorColorNumericInput.tsx`
  - `MobileInspectorColor.tsx`

- **Asset Library**

  - `AssetLibrary.tsx`
  - `MobileAssetLibrary.tsx`
  - `Asset.tsx` (both versions)

- **Settings & Modals**
  - `SettingsModal.tsx`
  - `EditorSettings.tsx`
  - `KeyboardShortcuts.tsx`
  - `ProjectSettings.tsx`
  - `ModalHandler.tsx`

### Tier 3: High Complexity (Lifecycle Heavy)

**Estimated Time:** 2-3 weeks  
**Components:** ~15

- **Core Panels**
  - `Timeline.tsx` ⚠️ (componentDidMount, componentDidUpdate, componentWillUnmount)
  - `Canvas.tsx` ⚠️ (componentDidMount, componentDidUpdate)
  - `Toolbox.tsx`
  - `ToolSettings.tsx`
  - `ToolSettingsInput.tsx`
  - `Outliner.tsx`
  - `OutlinerWidget.tsx`
  - `MobileContainer.tsx`

### Tier 4: Critical Core (Highest Risk)

**Estimated Time:** 1-2 weeks  
**Components:** ~5

- **Editor Core**
  - `EditorCore.ts` ⚠️⚠️ (Central state management - most critical)
  - `MobileTabbedInterface.tsx`
  - `AddScriptPanel.tsx`
  - `InspectorScriptWindow.tsx`
  - `DockedPanel.tsx` (PureComponent)

---

## Session-by-Session Breakdown 📅

### **Session 1: Presentational Components** (Day 1-2)

**Target:** 10-15 components  
**Complexity:** Low  
**Files:**

- `OutlinerName.tsx`
- `OutlinerTitle.tsx`
- `InspectorTitle.tsx`
- `ToolboxBreak.tsx`
- `MenuBarButton.tsx`
- `MenuBarSupportButton.tsx`
- `OutlinerExpandButton.tsx`
- `InspectorImagePreview.tsx`
- `InspectorSoundPreview.tsx`
- `PlayButton.tsx`

**Success Criteria:**

- ✅ Zero TypeScript errors
- ✅ All props properly typed
- ✅ Manual smoke test passes

---

### **Session 2: Simple Input Components** (Day 3-4)

**Target:** 10-12 components  
**Complexity:** Low-Medium  
**Files:**

- `InspectorCheckbox.tsx`
- `MobileInspectorCheckbox.tsx`
- `InspectorTextInput.tsx`
- `MobileInspectorTextInput.tsx` (currently open!)
- `InspectorNumericInput.tsx`
- `MobileInspectorNumericInput.tsx`
- `InspectorNumericSlider.tsx`
- `MobileInspectorNumericSlider.tsx`
- `OutlinerDropdown.tsx`
- `PopupMenu.tsx`

**Success Criteria:**

- ✅ useState for local state
- ✅ Event handlers properly typed
- ✅ Input functionality preserved

---

### **Session 3: Inspector System** (Day 5-7)

**Target:** 12-15 components  
**Complexity:** Medium  
**Files:**

- `Inspector.tsx`
- `MobileInspector.tsx`
- `InspectorInput.tsx`
- `MobileInspectorInput.tsx`
- `InspectorSelector.tsx`
- `MobileInspectorSelector.tsx`
- `InspectorDualNumericInput.tsx`
- `MobileInspectorDualNumericInput.tsx`
- `InspectorColorNumericInput.tsx`
- `MobileInspectorColor.tsx`

**Success Criteria:**

- ✅ State management with useState
- ✅ Prop drilling or Context API
- ✅ Inspector functionality works

---

### **Session 4: Asset Libraries** (Day 8-9)

**Target:** 5-7 components  
**Complexity:** Medium  
**Files:**

- `AssetLibrary.tsx`
- `MobileAssetLibrary.tsx`
- `Asset.tsx` (desktop version)
- `Asset.tsx` (mobile version)
- Related asset components

**Success Criteria:**

- ✅ File upload works
- ✅ Asset management preserved
- ✅ Drag & drop functional

---

### **Session 5: Settings & Modals** (Day 10-12)

**Target:** 8-10 components  
**Complexity:** Medium  
**Files:**

- `SettingsModal.tsx`
- `EditorSettings.tsx`
- `KeyboardShortcuts.tsx`
- `ProjectSettings.tsx`
- `ModalHandler.tsx`
- `WickModal.tsx`
- `ExportOptions.tsx`

**Success Criteria:**

- ✅ Modal state management
- ✅ Settings persistence works
- ✅ Keyboard shortcuts functional

---

### **Session 6: Toolbox System** (Day 13-15)

**Target:** 8-10 components  
**Complexity:** Medium-High  
**Files:**

- `Toolbox.tsx`
- `ToolButton.tsx`
- `ToolSettings.tsx`
- `ToolSettingsInput.tsx`
- `CanvasActions.tsx`
- `CanvasTransforms.tsx`

**Success Criteria:**

- ✅ Tool switching works
- ✅ Tool settings preserved
- ✅ Canvas actions functional

---

### **Session 7: Complex Panels** (Day 16-20)

**Target:** 5-7 components  
**Complexity:** High  
**Files:**

- `Timeline.tsx` ⚠️
- `Canvas.tsx` ⚠️
- `Outliner.tsx`
- `OutlinerWidget.tsx`
- `OutlinerDisplay.tsx`
- `MobileContainer.tsx`

**Special Considerations:**

- Convert lifecycle methods to useEffect
- Manage complex state with useReducer
- Performance optimization with useMemo/useCallback

**Success Criteria:**

- ✅ Timeline playback works
- ✅ Canvas rendering functional
- ✅ Outliner interactions preserved

---

### **Session 8: Editor Core** (Day 21-25) ⚠️⚠️

**Target:** 3-5 components  
**Complexity:** Critical  
**Files:**

- `EditorCore.ts` ⚠️⚠️
- `MobileTabbedInterface.tsx`
- `AddScriptPanel.tsx`
- `InspectorScriptWindow.tsx`
- `DockedPanel.tsx`

**Special Considerations:**

- **EditorCore is the most critical component**
- Consider Context API refactoring
- May need state management library (Zustand/Jotai)
- Extensive testing required

**Success Criteria:**

- ✅ Full editor functionality preserved
- ✅ State management solid
- ✅ No performance regressions
- ✅ Comprehensive testing

---

### **Session 9: Custom Hooks & Optimization** (Day 26-30)

**Target:** Extract reusable logic  
**Complexity:** Medium  
**Tasks:**

1. Create custom hooks library
2. Extract common patterns
3. Performance optimization
4. Code cleanup
5. Documentation

**Custom Hooks to Create:**

- `useWickProject()`
- `useEditorAction()`
- `useToolSettings()`
- `useInspectorValue()`
- `useKeyboardShortcut()`
- `useModalState()`
- `useAssetLibrary()`

**Success Criteria:**

- ✅ Custom hooks documented
- ✅ Code duplication reduced
- ✅ Performance benchmarks pass
- ✅ Migration documentation complete

---

## Testing Strategy ✅

### Per-Session Testing

1. **TypeScript Compilation** - `npx tsc --noEmit`
2. **Manual Smoke Test** - Test converted components
3. **Functional Testing** - Verify behavior unchanged
4. **Visual Regression** - Check UI consistency

### Full Migration Testing

1. **Unit Tests** - Run existing test suite
2. **E2E Tests** - Playwright test suite
3. **Performance Tests** - Bundle size, render time
4. **Accessibility** - A11y audit
5. **Cross-browser** - Chrome, Firefox, Safari

---

## Risk Assessment & Mitigation ⚠️

### High Risk Components

1. **EditorCore.ts**
   - **Risk:** Central state management, highest complexity
   - **Mitigation:** Convert last, extensive testing, consider state library
2. **Timeline.tsx**

   - **Risk:** Complex lifecycle methods, animation timing
   - **Mitigation:** Careful useEffect conversion, performance profiling

3. **Canvas.tsx**
   - **Risk:** Rendering performance, DOM manipulation
   - **Mitigation:** useMemo/useCallback optimization, RAF usage

### Mitigation Strategies

- ✅ **Incremental approach** - One component at a time
- ✅ **Comprehensive testing** - After each conversion
- ✅ **Git branching** - Feature branch with frequent commits
- ✅ **Rollback plan** - Keep class versions until validated
- ✅ **Documentation** - Document patterns and decisions

---

## Performance Considerations 🚀

### Optimization Techniques

**1. React.memo for Pure Components**

```typescript
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  return <div>{data}</div>;
});
```

**2. useMemo for Expensive Calculations**

```typescript
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.id - b.id);
}, [data]);
```

**3. useCallback for Event Handlers**

```typescript
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

**4. useReducer for Complex State**

```typescript
const [state, dispatch] = useReducer(reducer, initialState);
```

**5. Code Splitting**

```typescript
const HeavyComponent = lazy(() => import("./HeavyComponent"));
```

---

## Success Metrics 📊

### Quantitative Metrics

- ✅ **0 class components** remaining
- ✅ **~97 functional components** created
- ✅ **5-10 custom hooks** extracted
- ✅ **Zero TypeScript errors** maintained
- ✅ **<10% bundle size increase** (ideally decrease)
- ✅ **No performance regressions**

### Qualitative Metrics

- ✅ Code is more readable and maintainable
- ✅ Components follow modern React patterns
- ✅ Custom hooks reduce code duplication
- ✅ Team velocity improves with better patterns
- ✅ Easier onboarding for new developers

---

## Documentation Deliverables 📝

1. **Migration Guide** - Step-by-step conversion patterns
2. **Custom Hooks Documentation** - Usage examples
3. **Best Practices** - Modern React patterns for this codebase
4. **Session Reports** - Progress tracking per session
5. **Completion Report** - Final metrics and achievements

---

## Timeline Estimate ⏱️

**Total Duration:** 4-6 weeks (30-40 working days)

- Week 1: Sessions 1-2 (Simple components)
- Week 2: Sessions 3-4 (Inspector & Assets)
- Week 3: Sessions 5-6 (Settings & Toolbox)
- Week 4: Session 7 (Complex Panels)
- Week 5: Session 8 (Editor Core)
- Week 6: Session 9 (Hooks & Optimization)

**Buffer:** +1 week for testing and polish

---

## Decision Points 🤔

### State Management

**Question:** Should we use Context API or state management library?

**Options:**

1. **Context API** - Built-in, simple, suitable for most cases
2. **Zustand** - Lightweight, modern, easy migration
3. **Jotai** - Atomic state, great TypeScript support
4. **Redux Toolkit** - Industry standard, more boilerplate

**Recommendation:** Start with **Context API**, evaluate **Zustand** if EditorCore gets complex.

### Custom Hooks Strategy

**Question:** How aggressive should we be with custom hooks?

**Recommendation:**

- Create hooks for **repeated patterns** (3+ uses)
- Keep component-specific logic **inline**
- Document all custom hooks thoroughly

### Testing Approach

**Question:** Test before or after each component conversion?

**Recommendation:**

- **Test after each session** (10-15 components)
- **Full regression test** after each tier
- **Comprehensive test** before merging

---

## Next Steps 🚀

### Immediate Actions (Today)

1. ✅ Review this plan
2. ✅ Get stakeholder approval
3. ✅ Create feature branch `upgrade/react-functional`
4. ✅ Set up testing infrastructure
5. ✅ Begin Session 1

### Session 1 Preparation

1. List all presentational components
2. Set up component testing utilities
3. Create conversion checklist
4. Prepare smoke test scenarios

---

## Questions to Answer 🤔

1. **Should we pause for formal testing after Phase 2?**

   - Recommendation: Quick smoke test, then proceed

2. **Should we update React version first?**

   - Current: React 18.3.1 (latest)
   - Recommendation: No update needed

3. **Should we introduce a state management library?**

   - Recommendation: Evaluate during EditorCore conversion

4. **Should we refactor component architecture?**
   - Recommendation: Keep architecture, just modernize implementation

---

## Conclusion 🎯

This is an **excellent next step** after completing the TypeScript migration. The codebase is in perfect shape for this modernization:

✅ **Strong TypeScript foundation** - Types will make conversion safer  
✅ **Clear component boundaries** - Well-structured codebase  
✅ **Modern React version** - React 18.3.1 supports all features  
✅ **Incremental approach** - Low risk, high reward

**Let's make the Wick Editor a showcase of modern React architecture!**

---

**Status:** 📋 **Ready to Begin**  
**Next Phase:** Session 1 - Presentational Components  
**Risk Level:** Low-Medium (with incremental approach)  
**Expected Duration:** 4-6 weeks  
**Success Probability:** **Very High** ✅

_Planning Document - October 11, 2025_  
_Phase 3: React Modernization_
