### UPGRADE_PLAN

Goal: Upgrade to modern React + TypeScript with a Playwright safety net to verify parity at every step.

---

### Status seed (done)

- [x] Add `.nvmrc` pinned to `12.22.12`
- [x] Add Playwright (`@playwright/test`), `playwright.config.ts`, tests in `tests/`, npm scripts

Quick run (Windows, nvm-windows):

```bash
nvm install 12.22.12
nvm use 12.22.12
npm ci
npx playwright install chromium
npm run test:e2e
```

---

### Establish baseline on legacy stack (Node 12)

- [ ] Use Node `12.22.12` (`nvm install 12.22.12 && nvm use 12.22.12`)
- [ ] Install deps: `npm ci`
- [ ] Install browser: `npx playwright install chromium`
- [ ] Choose package manager (prefer npm). If choosing npm, consider removing `yarn.lock` (keep `package-lock.json`).
- [ ] Run baseline e2e: `npm run test:e2e` (expect green)
- [ ] Run headed/UI: `npm run test:e2e:headed` / `npm run test:e2e:ui`
- [ ] Commit baseline (tests in `tests/` + green run evidence)
- [ ] Verify dev server and engine build
  - [ ] `npm start` serves UI at `http://localhost:3000`
  - [ ] Build engine: `npm run build-engine` (or `build-engine-windows`) and confirm files appear under `public/corelibs/wick-engine/`
  - [ ] Smoke open Electron (optional): `npm run electron-dev-windows`
- [ ] Record environment
  - [ ] Output `node -v`, `npm -v`, OS in commit/PR description
  - [ ] Save failing/succeeding Playwright trace if any

Two-terminal workflow (recommended):

1) Terminal A (legacy server on Node 12)

```bash
nvm use 12.22.12
npm start
```

2) Terminal B (tests, can be Node 18 or 12)

```bash
# Optionally: nvm use 18.20.3
npm run test:e2e
```


---

### Phase 1 — Introduce TypeScript (incremental)

- [ ] Install TS deps:
  - `npm i -D typescript @types/react @types/react-dom @types/classnames @types/underscore`
- [x] Add `tsconfig.json` (initially):
  - `compilerOptions`: `{ target: "ES2020", module: "ESNext", jsx: "react-jsx", allowJs: true, checkJs: false, skipLibCheck: true, strict: false, noEmit: true }`
  - `include`: `["src", "tests"]`
- [x] Convert a small leaf component to `.tsx` (`MenuBarIconButton.tsx`)
- [x] Ensure type-check passes (`npm run typecheck`)
- [ ] E2E green: `npm run test:e2e`
- [ ] Add ESLint + Prettier for TS
  - [ ] `npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-prettier prettier`
  - [ ] Add `.eslintrc` extending `plugin:@typescript-eslint/recommended` and `prettier`
  - [ ] Add scripts: `lint`, `lint:fix`, `format`
  - [ ] Optional: add `husky` + `lint-staged` for pre-commit
- [ ] TypeScript configuration hardening (incremental)
  - [ ] `esModuleInterop: true`, `isolatedModules: true`, `resolveJsonModule: true`
  - [ ] Path aliases if useful (configure in `tsconfig.json`)
  - [ ] Create a `types/` folder for ambient declarations

---

### Phase 2 — Upgrade React to 17

- [ ] `npm i react@17 react-dom@17`
- [ ] Resolve deprecations/warnings if any
- [ ] E2E green
- [ ] Enable StrictMode to surface legacy patterns
  - [ ] Wrap root in `<React.StrictMode>`
  - [ ] Audit for legacy lifecycle methods (`componentWillMount`, `componentWillReceiveProps`, etc.)
  - [ ] Replace with safe alternatives or prefix with `UNSAFE_` as a stopgap

---

### Phase 3 — Upgrade React to 18

- [ ] `npm i react@18 react-dom@18`
- [ ] Defer `createRoot` change in `src/index` until bundler is updated (Phase 4)
- [ ] E2E green
- [ ] Third-party compatibility review
  - [ ] `react-dnd` and `react-dnd-html5-backend` compatible with React 18
  - [ ] `react-modal`, `react-toastify`, `react-ace`, `rc-slider`, `react-dropzone` compatibility notes
  - [ ] Plan targeted upgrades if required

---

### Phase 4 — Bundler: CRA 2 → CRA 5 (Node 18)

- [ ] Switch Node: `nvm install 18.20.3 && nvm use 18.20.3`
- [ ] Replace `node-sass` with `sass`:
  - `npm remove node-sass && npm i -D sass`
- [ ] Upgrade `react-scripts` to `5`: `npm i -D react-scripts@5`
- [ ] If necessary, add Webpack 5 polyfills/fallbacks for Node builtins (crypto/path/stream) via CRACO or shims
- [ ] Update `src/index` to React 18 `createRoot`
- [ ] Ensure dev/build scripts still work
- [ ] E2E green
- [ ] Service worker and static assets
  - [ ] Confirm service worker behavior (currently unregistered). Remove legacy CRA 2 `serviceWorker.js` if unused
  - [ ] Validate `%PUBLIC_URL%` paths in `public/index.html` still resolve
- [ ] ESLint and browserslist updates
  - [ ] Align ESLint with CRA 5 rules, resolve plugin conflicts
  - [ ] Update `browserslist` targets if needed
- [ ] Normalize package manager
  - [ ] Remove `yarn.lock` if standardizing on npm
  - [ ] `npm ci` green on Node 18

---

### Phase 5 — Harden TypeScript

- [ ] Enable stricter compiler options (`strict: true`, incrementally)
- [ ] Convert remaining components to `.tsx`
- [ ] Remove `allowJs`
- [ ] E2E green
- [ ] Enable strict flags gradually
  - [ ] `strict: true`, `noImplicitAny: true`
  - [ ] `strictNullChecks: true`, `noUncheckedIndexedAccess: true` (optional)
  - [ ] `noImplicitThis: true`, `exactOptionalPropertyTypes: true` (optional)
- [ ] Migrate large class components
  - [ ] Identify largest components (`Editor.jsx`, `EditorCore.jsx`)
  - [ ] Split into smaller presentational components where feasible
  - [ ] Consider Hooks migration where low-risk; otherwise add TS types to classes

---

### Phase 6 — Strengthen Playwright coverage

- [ ] Menu flows: open settings, new/open/save
- [ ] Timeline presence and basic interaction
- [ ] Outliner toggle behavior
- [ ] Canvas renders and basic action
- [ ] Add CI (e.g., GitHub Actions) to run Playwright on PRs
- [ ] Stabilize selectors
  - [ ] Add `data-testid` attributes to critical elements to reduce brittleness
  - [ ] Create a selector helper map used by tests
- [ ] Expand projects and devices
  - [ ] Add mobile viewport project (e.g., iPhone 12) to config
  - [ ] Optionally enable Firefox/WebKit projects for parity checks
- [ ] Improve observability
  - [ ] Keep trace on failure, upload as CI artifact
  - [ ] Store screenshots/videos on failure
- [ ] CI integration
  - [ ] Add GitHub Actions workflow: Node setup, cache, install browsers, run tests headless
  - [ ] Badge in `README.md`

---

### Phase 7 — Optional: Migrate CRA → Vite

- [ ] Create Vite config (React + TS)
- [ ] Wire Electron dev/build if needed (`public/electron.js` and electron-builder expectations)
- [ ] Adjust asset paths expected by Electron/electron-builder
- [ ] E2E green
- [ ] Vite specifics
  - [ ] `vite.config.ts` with React plugin and aliasing
  - [ ] Migrate environment variables from CRA conventions
  - [ ] Ensure `public/` assets copying and `%PUBLIC_URL%` equivalents
- [ ] Electron compatibility
  - [ ] Dev: open Electron against Vite dev server URL
  - [ ] Build: ensure output paths match `electron-builder` expectations

---

### Finalize

- [ ] Update `README.md` with new commands and Node policy
- [ ] Tag a release; archive legacy instructions
- [ ] Dependency audit
  - [ ] `npm audit fix` (review criticals manually)
  - [ ] Review and update key libraries:
    - [ ] `react-dnd` + backend
    - [ ] `react-modal`
    - [ ] `react-toastify`
    - [ ] `react-ace`
    - [ ] `rc-slider`
    - [ ] `react-dropzone`
    - [ ] `bootstrap` (consider v5)
- [ ] Code quality
  - [ ] Add `npm run lint` and gate CI on lint pass
  - [ ] Enforce formatting with Prettier (optional pre-commit hook)


---

### Useful commands

- **Run dev + tests (current CRA)**
  - `npm start` (dev server)
  - `npm run test:e2e` (CI-friendly)
  - `npm run test:e2e:headed` / `npm run test:e2e:ui`
- **Switch Node**
  - `nvm use 12.22.12` (legacy)
  - `nvm use 18.20.3` (modern)

