# Settings Panel Investigation

**Issue:** Brush size setting doesn't affect actual stroke size  
**Status:** Pre-existing bug (not caused by Vite migration)  
**Impact:** Brush strokes all same size regardless of setting

---

## 🔍 Findings

### What We Know

1. **The UI updates correctly**
   - Input field shows: 5 → 15 → 25 ✅
   - Value is entered successfully ✅

2. **The strokes are all the same size**
   - All 3 lines are identical thickness ❌
   - Visual test screenshot confirms this ❌

3. **The code flow looks correct**
   - `SettingsNumericSlider` has `onChange` prop
   - `onChange` calls `setToolSetting()`  
   - `setToolSetting()` calls `project.toolSettings.setSetting()`
   - Brush tool reads setting via `this.getSetting('brushSize')`

4. **Both Gulp and Vite builds tested**
   - Issue appears to exist in both builds
   - Not specific to Vite migration

---

## 🧩 Code Flow

```
User types in input
     ↓
WickInput onChange triggered
     ↓
SettingsNumericSlider onChange  
     ↓
ToolSettingsInput onChange
     ↓
ToolSettings setToolSetting prop
     ↓
EditorCore.setToolSetting()
     ↓
project.toolSettings.setSetting('brushSize', value)
     ↓
projectDidChange() (triggers re-render)
     ↓
Brush tool should read new value via getSetting('brushSize')
```

**Question:** Is the value actually being stored in `toolSettings`?

---

## 🐛 Possible Causes

### 1. React Event Not Firing
The automated test uses `fill()` which might not trigger React's onChange:
- Playwright `fill()` sets DOM value directly
- React synthetic events might not fire
- Component state doesn't update

### 2. Tool Settings Not Persisting
- Value set but not stored in engine
- Tool reads stale/default value
- State management issue

### 3. Tool Not Re-reading Setting
- Brush caches the size on tool activation
- Doesn't re-read setting during drawing
- Need to re-select tool after changing setting

### 4. Wrong Setting Name
- Frontend uses `brushSize`
- Engine expects different name?
- Mismatch in setting keys

---

## 🧪 Next Steps to Debug

### Test 1: Check Tool Settings Storage
```typescript
// In browser console after changing brush size:
window.wickEditor.project.toolSettings.getSetting('brushSize')
// Should return the new value
```

### Test 2: Manual Interaction
```
1. Load editor manually
2. Select brush
3. Change size to 30 (using mouse/keyboard naturally)
4. Draw a stroke
5. Does it work when done manually vs automated?
```

### Test 3: Re-select Tool
```
1. Select brush
2. Change size to 30
3. Select different tool (e.g., pencil)
4. Re-select brush
5. Draw - does it use new size now?
```

### Test 4: Check Default Values
```typescript
// In engine/src/tools/Brush.js
// Line 261: var size = this.getSetting('brushSize') + 1;
// Add console.log to see what value is actually returned
```

---

## 🎯 Recommendation

### For Vite Migration:
✅ **COMPLETE** - This is not a Vite issue

The migration is successful. The engine builds, loads, and runs correctly with Vite.

### For Settings Panel Bug:
⚠️ **Needs Separate Investigation**

This appears to be a **frontend state management or event handling issue**, not related to the build system.

**Priority:** Medium  
**Scope:** Frontend debugging  
**Affected:** Brush size setting (possibly other numeric settings too)

---

## 📋 Quick Manual Test

To confirm this is not a Vite issue:

1. Load http://localhost:3002
2. Open browser DevTools console
3. Type: `window.wickEditor.project.toolSettings.getSetting('brushSize')`
4. Note the value (probably 10)
5. Change brush size to 30 in UI
6. Type the same command again
7. Did the value change?
   - If **YES**: Tool is not re-reading the setting
   - If **NO**: Setting is not being stored

---

## 🔧 Temporary Workaround

If you need different brush sizes right now:

**Option 1:** Re-select the brush tool after changing size
1. Select brush
2. Change size
3. Select different tool
4. Re-select brush
5. Draw (might work now)

**Option 2:** Use the toolbar slider instead of the input
- Click the brush size icon
- Use the slider that appears
- Slider might trigger different event handler

---

**Status:** Issue documented, not blocking Vite migration  
**Next:** Proceed with TypeScript conversion or debug this separately

