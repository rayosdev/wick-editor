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

---

### Phase 1 — Introduce TypeScript (incremental)

- [ ] Install TS deps:
  - `npm i -D typescript @types/react @types/react-dom @types/classnames @types/underscore`
- [ ] Add `tsconfig.json` (initially):
  - `compilerOptions`: `{ target: "ES2020", module: "ESNext", jsx: "react-jsx", allowJs: true, checkJs: false, skipLibCheck: true, strict: false, noEmit: true }`
  - `include`: `["src", "tests"]`
- [ ] Convert a small leaf component to `.tsx`
- [ ] Ensure type-check passes; app builds
- [ ] E2E green: `npm run test:e2e`

---

### Phase 2 — Upgrade React to 17

- [ ] `npm i react@17 react-dom@17`
- [ ] Resolve deprecations/warnings if any
- [ ] E2E green

---

### Phase 3 — Upgrade React to 18

- [ ] `npm i react@18 react-dom@18`
- [ ] Defer `createRoot` change in `src/index` until bundler is updated (Phase 4)
- [ ] E2E green

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

---

### Phase 5 — Harden TypeScript

- [ ] Enable stricter compiler options (`strict: true`, incrementally)
- [ ] Convert remaining components to `.tsx`
- [ ] Remove `allowJs`
- [ ] E2E green

---

### Phase 6 — Strengthen Playwright coverage

- [ ] Menu flows: open settings, new/open/save
- [ ] Timeline presence and basic interaction
- [ ] Outliner toggle behavior
- [ ] Canvas renders and basic action
- [ ] Add CI (e.g., GitHub Actions) to run Playwright on PRs

---

### Phase 7 — Optional: Migrate CRA → Vite

- [ ] Create Vite config (React + TS)
- [ ] Wire Electron dev/build if needed (`public/electron.js` and electron-builder expectations)
- [ ] Adjust asset paths expected by Electron/electron-builder
- [ ] E2E green

---

### Finalize

- [ ] Update `README.md` with new commands and Node policy
- [ ] Tag a release; archive legacy instructions

---

### Useful commands

- **Run dev + tests (current CRA)**
  - `npm start` (dev server)
  - `npm run test:e2e` (CI-friendly)
  - `npm run test:e2e:headed` / `npm run test:e2e:ui`
- **Switch Node**
  - `nvm use 12.22.12` (legacy)
  - `nvm use 18.20.3` (modern)

