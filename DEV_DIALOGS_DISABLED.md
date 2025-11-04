# Development Mode - Confirmation Dialogs Disabled

## ✅ Changes Made

Confirmation dialogs are now automatically skipped in development mode to improve developer workflow.

### Modified Files

1. **`src/Editor/Editor.tsx`**
   - `window.onbeforeunload` - Browser confirmation dialog disabled in dev
   - `openWarningModal()` - Auto-accepts all warning modals in dev

2. **`src/Editor/EditorCore.ts`**
   - `openNewProjectConfirmation()` - Skips confirmation, directly creates new project

## 🔧 How It Works

### Development Mode Detection
The editor detects development mode when:
- Running on `localhost`
- Vite dev mode is active (`import.meta.env.DEV`)

### Behavior

#### In Development Mode:
- ✅ **Browser confirmation dialogs** - Disabled (no "Leave site?" prompts)
- ✅ **Warning modals** - Auto-accepted (no confirmation dialogs)
- ✅ **New project confirmation** - Skipped (directly creates new project)
- ✅ **Delete confirmations** - Auto-accepted (no "Delete this asset?" prompts)
- ✅ **Script deletion** - Auto-accepted

#### In Production Mode:
- ✅ All confirmation dialogs work normally
- ✅ Users get proper warnings before destructive actions

## 📝 Console Logging

When dialogs are skipped in dev mode, you'll see console messages like:
```
[DEV] Skipping confirmation dialog: Create New Project?
[DEV] Skipping new project confirmation, creating project directly
```

## 🎯 Benefits

1. **Faster development** - No interruptions from confirmation dialogs
2. **Better workflow** - Actions execute immediately
3. **Production safety** - Confirmations still work in production builds
4. **Easy debugging** - Console logs show what's being skipped

## ⚠️ Notes

- Confirmations are **only disabled in development**
- Production builds will still show all confirmation dialogs
- Auto-accept actions are logged to console for debugging

