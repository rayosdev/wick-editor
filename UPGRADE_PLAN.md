# Wick Editor Upgrade and Migration Plan

This document outlines the steps to upgrade the Wick Editor from its current stack (React 16, Electron 7, react-scripts) to a modern stack (React 18, latest Electron, Vite).

Follow these phases in order. Do not skip steps. The plan has been revised multiple times as we've uncovered dependency conflicts. The latest science shows that we **must** upgrade React *before* we can install a modern testing framework.

---

### Phase 1: Migrate Build System to Vite & Upgrade Node.js (COMPLETE)

*The first step is to remove the dependency on `react-scripts`, which is preventing us from upgrading Node.js. We will switch to `Vite` and move to the latest LTS version of Node.js.*

- [x] **1. Switch to a Modern Node.js Version:**
    - [x] Before proceeding, switch your environment to the latest Node.js LTS version (e.g., `nvm use 20`). This will be the version used for the remainder of the upgrade.
    - [x] Remove the `engines` field from `package.json` and delete the `.npmrc` file, as they enforce the old Node.js v12.

- [x] **2. Remove `react-scripts`:**
    - [x] `npm uninstall react-scripts`

- [x] **3. Install Vite:**
    - [x] `npm install --save-dev vite @vitejs/plugin-react`

- [x] **4. Create `vite.config.js`:**
    - [x] Create a `vite.config.js` file in the project root.
    - [x] Add a basic configuration to use the React plugin and set the build directory to `build`.

- [x] **5. Update `index.html`:**
    - [x] Move `public/index.html` to the project root.
    - [x] Update the path to your main script file. Change `<script src="%PUBLIC_URL%/..."></script>` to `<script type="module" src="/src/index.js"></script>` (or wherever your entry point is).
    - [x] Update any other `%PUBLIC_URL%` placeholders.

- [x] **6. Update `package.json` Scripts:**
    - [x] `"start": "vite"`
    - [x] `"build": "npm run build-engine && vite build"` (or integrate the engine build into Vite's config).

- [x] **7. Validate the Dev Server:**
    - [x] Run `npm start`. The app should launch and run in the browser (without Electron). Fix any issues until it does. This will likely involve replacing `node-sass` with `sass`.

---

### Phase 2: Upgrade React

*The original plan to add tests first was not feasible. We must upgrade React to version 18 before modern testing libraries can be installed.*

- [ ] **1. Update React Packages:**
    - [ ] Install the latest versions of React: `npm install react@latest react-dom@latest`.

- [ ] **2. Update to `createRoot` API:**
    - [ ] In your application's entry point (`src/index.js`), find the `ReactDOM.render(...)` call.
    - [ ] Replace it with the new `createRoot` API.
      ```javascript
      // Before:
      // ReactDOM.render(<Editor />, document.getElementById('root'));

      // After:
      import { createRoot } from 'react-dom/client';
      const container = document.getElementById('root');
      const root = createRoot(container);
      root.render(<Editor />);
      ```

- [ ] **3. Full Manual Regression Test:**
    - [ ] This is now our "safety net". Since we can't rely on automated tests yet, we must do this manually.
    - [ ] Run `npm start`.
    - [ ] Go through every single feature in the editor. Create shapes, add frames, use the timeline, add sound, draw with the brush, use the inspector, open and save files.
    - [ ] Document any visual glitches or runtime errors you see in the browser console. Fix them before proceeding. Pay special attention to libraries like `react-dnd` and `rc-slider` which are likely to have issues.

---

### Phase 3: Set Up Testing (Safety Net)

*Now that React is upgraded, we can finally install a modern test runner.*

- [ ] **1. Set Up Vitest:**
    - [ ] Install the test runner: `npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom`.
    - [ ] Update your `vite.config.js` to configure `vitest` and remove the temporary React babel config if it's no longer needed.
    - [ ] Add `"test": "vitest"` to your `package.json` scripts.

- [ ] **2. Write Critical Unit & Integration Tests:**
    - [ ] Now, build the safety net we originally wanted. Write tests for the most critical parts of the application you identified during the manual regression test.

---

### Phase 4: Upgrade Electron

*Upgrade Electron to the latest version and refactor for modern security practices.*

- [ ] **1. Update Packages:**
    - [ ] `npm install --save-dev electron electron-builder`

- [ ] **2. Refactor for Context Isolation:**
    - [ ] Create a new `preload.js` script to act as the bridge between the main process and the renderer.
    - [ ] Update your main Electron file to use the `preload` script and ensure `contextIsolation` is enabled.
    - [ ] Refactor all Node.js API usage (e.g., `fs`, `path`) out of the renderer and into the main process, exposing functionality to the renderer via the `contextBridge` and IPC.

- [ ] **3. Test in Electron:**
    - [ ] Run the app with your electron start command.
    - [ ] Verify that the app loads and that all backend interactions work through the new IPC bridge.

---

### Phase 5: Audit and Upgrade Dependencies

*Update the ecosystem of libraries to be compatible with modern React.*

- [ ] **1. Audit `package.json`:**
    - [ ] For every dependency, especially the `react-*` ones, check if its current version is compatible with React 18.
    - [ ] Pay special attention to `react-dnd`, `rc-slider`, `react-hotkeys`, `react-ace`, etc.
    - [ ] Create a list of packages that need to be updated or replaced.

- [ ] **2. Upgrade Packages Incrementally:**
    - [ ] Upgrade one package at a time.
    - [ ] After each upgrade, run your test suite (`npm test`) and manually test the relevant feature in the app.

---

- [ ] **Celebrate!**
    - [ ] You have successfully modernized a complex application. 