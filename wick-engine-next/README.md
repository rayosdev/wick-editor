# wick-engine-next

`wick-engine-next` is a measured rewrite of the Wick Engine focused on compatibility first.

It is designed to be a stand-in replacement while we modernize architecture in small, safe steps.

## Approach

1. Bundle the existing engine runtime as the baseline behavior.
2. Install a typed compatibility kernel on top of the runtime.
3. Introduce module overrides behind explicit API paths (for incremental rewrites).

## Architecture

- `src/kernel/wickCompatKernel.ts`: rewrite orchestrator and install flow.
- `src/kernel/apiRegistry.ts`: API-path override registry.
- `src/kernel/wrapLegacy.ts`: wrappers for compatibility hooks (project tracking and callback bridges).
- `src/contracts/editorSurface.ts`: API contract used by the editor.
- `src/browser-standin.ts`: browser entry that installs the bridge and exposes `window.Wick`.

## Build and Test

```bash
npm run typecheck
npm run test
npm run build
```

Output bundle:

- `dist/wickengine.js`

## Drop-In Behavior

`dist/wickengine.js` keeps `window.Wick` available and adds `window.Wick.__compat` with:

- `mode`: bridge mode identifier
- `rewriteVersion`: rewrite layer version
- `legacyVersion`: underlying engine version
- `registerOverride(path, value)`: register replacement implementation for a specific API path
- `resolve(path)`: inspect active implementation for a path
- `getMissingSurface()`: report editor API gaps

## Current Scope

This is a compatibility bridge, not a full replacement of engine internals yet. The rewrite path is module-by-module:

1. Replace isolated services (autosave/export helpers).
2. Replace model classes while preserving serialized project compatibility.
3. Retire legacy modules once all contract tests pass.
