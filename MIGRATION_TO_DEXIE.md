# Migration to Dexie.js for Project Storage

## Why Dexie.js?

**Current Setup (localforage):**
- Simple key-value store
- No indexes or queries
- Manual list management
- No TypeScript support

**With Dexie.js:**
- ✅ Type-safe operations
- ✅ Indexed queries (by UUID, lastModified)
- ✅ Better transaction handling
- ✅ Bulk operations
- ✅ Automatic cleanup
- ✅ Still lightweight (~50KB)

## Benefits

1. **Better Performance**: Indexed queries are much faster than scanning all entries
2. **Type Safety**: Full TypeScript support
3. **Cleaner Code**: No manual list management
4. **Automatic Cleanup**: Easy to keep only N most recent autosaves
5. **Better Queries**: Find by UUID, get latest, sort by date - all optimized

## Migration Steps

1. Install Dexie.js: `npm install dexie`
2. Replace localforage usage in `EditorCore.ts` with `ProjectStorage` methods
3. Update `engine/src/export/autosave/AutoSave.js` to use Dexie.js (optional, can keep both)
4. Test thoroughly

## Usage Example

```typescript
// Save autosave
await ProjectStorage.saveAutosave(autosaveData);

// Get latest autosave
const latest = await ProjectStorage.getLatestAutosave();

// Save current project
await ProjectStorage.saveCurrentProject(autosaveData);

// Get current project
const current = await ProjectStorage.getCurrentProject();

// Cleanup old autosaves (keep only 10 most recent)
await ProjectStorage.cleanupOldAutosaves(10);
```

## Comparison: Dexie.js vs RxDB

**Dexie.js** (Recommended for this use case):
- ✅ Perfect for simple persistence
- ✅ Lightweight (~50KB)
- ✅ Excellent TypeScript support
- ✅ Fast indexed queries
- ❌ No reactive/observable features

**RxDB** (Overkill unless you need):
- ✅ Real-time sync across tabs/devices
- ✅ Reactive queries with observables
- ✅ Complex offline-first sync
- ❌ Much heavier (~300KB+)
- ❌ More complex setup

## Recommendation

Use **Dexie.js** - it's the perfect fit for project persistence without the overhead of RxDB.

