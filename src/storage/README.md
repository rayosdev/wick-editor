# Storage Migration: localforage → Dexie.js

This directory contains the new Dexie.js-based storage system that replaces localforage.

## Structure

- **`database.ts`** - Main Dexie database setup and localforage-compatible adapter
- **`projectCache.ts`** - Specialized storage for cached projects
- **`fileCache.ts`** - Specialized storage for asset files
- **`index.ts`** - Main exports

## Migration Status

### ✅ Completed
- Dexie.js installed
- Database schema defined
- Localforage-compatible adapter created
- Editor.tsx updated to use Dexie adapter
- index.html updated to prefer Dexie, fallback to localforage

### 🔄 In Progress
- Engine FileCache migration (still uses localforage)
- Engine AutoSave migration (still uses localforage)
- Engine ToolSettings migration (still uses localforage)

### 📋 Benefits of Dexie.js
- Better TypeScript support
- SQL-like queries (filter, sort, etc.)
- More structured storage
- Better performance for complex operations
- Easier to debug (DevTools support)

## Usage

### Basic Key-Value Storage (localforage replacement)
```typescript
import { localforageAdapter } from '../storage';

// Same API as localforage
await localforageAdapter.setItem('key', value);
const value = await localforageAdapter.getItem('key');
await localforageAdapter.removeItem('key');
```

### Project Cache
```typescript
import { ProjectCache } from '../storage';

await ProjectCache.save(projectJsonString);
const project = await ProjectCache.load();
const exists = await ProjectCache.exists();
```

### File Cache
```typescript
import { FileCache } from '../storage';

await FileCache.save(uuid, blob);
const file = await FileCache.load(uuid);
await FileCache.remove(uuid);
```

## Migration Strategy

The migration is gradual:
1. New code uses Dexie
2. Old code still works with localforage
3. Both systems coexist during transition
4. Eventually remove localforage dependency


