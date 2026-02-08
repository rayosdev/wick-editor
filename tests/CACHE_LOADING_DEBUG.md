# Debugging Project Loading from Cache

This guide explains how to use Playwright MCP and DevTools MCP to test project loading by saving files to localStorage/IndexedDB and loading them from browser cache.

## Quick Start

### 1. Run Playwright Test (Automated)

```bash
# Start local server
npx --yes http-server public -p 3002 -c-1

# Run the cache loading test
npx --yes playwright test tests/load-from-cache-debug.spec.ts --headed --project=chromium
```

The test will:
- Read `tests/test-projects/timeline-script.wick` from filesystem
- Save it to localStorage
- Load it from cache using `WickFile.fromWickFile`
- Capture all `[ProjectLoad]` prefixed console logs
- Verify the project loaded successfully

### 2. Use DevTools MCP (Manual)

#### Step 1: Save a project to cache

In the browser console (after loading your app):

```javascript
// Option A: Save JSON object directly
fetch('/test-projects/timeline-script.wick')
  .then(r => r.json())
  .then(p => window.__wickDebug.saveToCache(p, 'my_test_project'));

// Option B: Save JSON string
const projectString = '{"project": {...}}';
window.__wickDebug.saveToCache(projectString, 'my_test_project');
```

#### Step 2: Load from cache

```javascript
// Load from localStorage
window.__wickDebug.loadFromCache('my_test_project', (success) => {
  console.log('Load result:', success);
});

// Or load from IndexedDB (if localforage available)
window.__wickDebug.loadFromIndexedDB('my_test_project', (success) => {
  console.log('Load result:', success);
});
```

## Available __wickDebug Helpers

All helpers log `[ProjectLoad]` prefixed messages for easy filtering.

### `window.__wickDebug.saveToCache(projectJson, key?)`
- Saves project to localStorage
- `projectJson`: JSON object or string
- `key`: Storage key (default: `'wick_cached_project'`)
- Returns: `true` if successful

### `window.__wickDebug.loadFromCache(key?, callback?)`
- Loads project from localStorage
- `key`: Storage key (default: `'wick_cached_project'`)
- `callback`: `(success: boolean) => void`

### `window.__wickDebug.saveToIndexedDB(projectJson, key?)`
- Saves project to IndexedDB via localforage
- Falls back to localStorage if localforage unavailable
- Async function (use `await` or `.then()`)

### `window.__wickDebug.loadFromIndexedDB(key?, callback?)`
- Loads project from IndexedDB via localforage
- Falls back to localStorage if localforage unavailable
- Async function (use `await` or `.then()`)

### `window.__wickDebug.testLoad(projectJson)`
- Directly loads a project JSON object without caching
- Useful for quick testing

## Example: Complete Workflow

### Using Playwright MCP

```typescript
// In a Playwright test
const projectPath = path.join(__dirname, 'test-projects', 'timeline-script.wick');
const projectData = fs.readFileSync(projectPath, 'utf8');

// Save to localStorage
await page.evaluate((data) => {
  localStorage.setItem('wick_cached_project', data);
}, projectData);

// Load from cache
await page.evaluate(() => {
  return new Promise((resolve) => {
    window.__wickDebug.loadFromCache('wick_cached_project', (success) => {
      resolve(success);
    });
  });
});
```

### Using DevTools MCP Console

```javascript
// 1. Load project file via fetch
const response = await fetch('/test-projects/timeline-script.wick');
const projectJson = await response.json();

// 2. Save to cache
window.__wickDebug.saveToCache(projectJson, 'debug_test');

// 3. Clear current project (if needed)
// window.editor?.setupNewProject?.(new window.Wick.Project());

// 4. Load from cache
window.__wickDebug.loadFromCache('debug_test', (success) => {
  if (success) {
    console.log('✅ Project loaded from cache!');
    console.log('Project name:', window.project?.name);
  } else {
    console.error('❌ Failed to load from cache');
  }
});
```

## Monitoring [ProjectLoad] Logs

All operations log with the `[ProjectLoad]` prefix. Filter console logs:

### In DevTools
```javascript
// Filter console to show only [ProjectLoad] logs
// Use DevTools console filter: "[ProjectLoad]"
```

### In Playwright
```typescript
page.on('console', msg => {
  if (msg.text().includes('[ProjectLoad]')) {
    console.log('LOAD LOG:', msg.text());
  }
});
```

## Common Patterns

### Test Multiple Projects

```javascript
// Save multiple projects
['project1.wick', 'project2.wick'].forEach(async (file) => {
  const data = await (await fetch(`/test-projects/${file}`)).json();
  window.__wickDebug.saveToCache(data, `cached_${file}`);
});

// Load a specific one
window.__wickDebug.loadFromCache('cached_project1.wick', console.log);
```

### Simulate File Open Dialog

```javascript
// This simulates what happens when user clicks "Open File" and selects a .wick file
// 1. User selects file -> saved to cache (in real app, this would be done via FileReader)
// 2. Load from cache

// Save (simulating file selection result)
const mockFileContent = '{"project": {...}}';
window.__wickDebug.saveToCache(mockFileContent, 'opened_file');

// Load (what the app would do)
window.__wickDebug.loadFromCache('opened_file', (success) => {
  if (success) {
    // Project is now loaded!
    console.log('Opened project:', window.project.name);
  }
});
```

## Troubleshooting

### Project doesn't load from cache
1. Check console for `[ProjectLoad]` error logs
2. Verify cache key: `localStorage.getItem('wick_cached_project')`
3. Verify Wick engine loaded: `window.Wick?.WickFile`
4. Verify editor available: `window.editor?.setupNewProject`

### IndexedDB not working
- Falls back to localStorage automatically
- Check if localforage is loaded: `window.localforage`

### Cache persists between sessions
- Clear cache: `localStorage.removeItem('wick_cached_project')`
- Or use a unique key per test run







