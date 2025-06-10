# Wick Editor Upgrade and Migration Plan

This document outlines the steps to upgrade the Wick Editor from its current stack (React 16, Electron 7, react-scripts) to a modern stack (React 18, latest Electron, Vite).

Follow these phases in order. Do not skip steps.

---

### Phase 0: Pre-Migration Strengthening (Safety Net)

*This is the most critical phase for a smooth transition. The goal is to build a safety net of tests and static typing that will catch regressions during the upgrade.*

- [ ] **1. Set Up a Test Runner:**
    - [ ] Choose and install a modern test runner. Since the goal is to move to Vite, `vitest` is a natural choice.
    - [ ] Configure the test runner to work with the existing `react-scripts` setup for now.

- [ ] **2. Write Critical Unit & Integration Tests:**
    - [ ] Identify the most critical parts of the application. Good candidates are:
        - The Wick Engine's core rendering logic.
        - Timeline state management.
        - Asset import/export functionality (images, audio).
        - Project saving and loading (`.wick` file handling).
    - [ ] Write high-level integration tests for these features. The goal is to verify that these features still work after each major upgrade step.

- [ ] **3. Introduce TypeScript:**
    - [ ] Add TypeScript to the project (`npm install --save-dev typescript @types/node @types/react @types/react-dom @types/jest`).
    - [ ] Create a `tsconfig.json` file. A basic one from `npx tsc --init` is a good start. Configure it to allow JS files (`"allowJs": true`).
    - [ ] Start by converting a few non-critical utility files from `.js` to `.ts` to ensure the setup works.
    - [ ] **Goal:** Do not block the migration on converting the entire app. Use TypeScript to your advantage for *new* code and for files you have to refactor heavily anyway (like `electron.js`).

---

### Phase 1: Migrate Build System to Vite

*Replace `react-scripts` with `Vite` for a much faster development experience and modern build system.*

- [ ] **1. Remove `react-scripts`:**
    - [ ] `npm uninstall react-scripts`

- [ ] **2. Install Vite:**
    - [ ] `npm install --save-dev vite @vitejs/plugin-react`

- [ ] **3. Create `vite.config.js`:**
    - [ ] Create a `vite.config.js` file in the project root.
    - [ ] Add a basic configuration to use the React plugin and set the build directory to `build`.

- [ ] **4. Update `index.html`:**
    - [ ] Move `public/index.html` to the project root.
    - [ ] Update the path to your main script file. Change `<script src="%PUBLIC_URL%/..."></script>` to `<script type="module" src="/src/index.js"></script>` (or wherever your entry point is).
    - [ ] Update any other `%PUBLIC_URL%` placeholders.

- [ ] **5. Update `package.json` Scripts:**
    - [ ] `"start": "vite"`
    - [ ] `"build": "npm run build-engine && vite build"` (or integrate the engine build into Vite's config).
    - [ ] `"test": "vitest"`

- [ ] **6. Validate the Dev Server:**
    - [ ] Run `npm start`. The app should launch and run in the browser (without Electron). Fix any issues until it does.

---

### Phase 2: Upgrade Electron

*Upgrade Electron to the latest version and refactor for modern security practices.*

- [ ] **1. Update Packages:**
    - [ ] `npm install --save-dev electron electron-builder`

- [ ] **2. Refactor for Context Isolation:**
    - [ ] Create a new `preload.js` script. This will be the bridge between the main process and the renderer (your React app).
    - [ ] In your main Electron file (`public/electron.js`), find where the `BrowserWindow` is created. Add the `preload` script to the `webPreferences`:
      ```javascript
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        contextIsolation: true, // This is the default and recommended
        nodeIntegration: false // This is the default and recommended
      }
      ```
    - [ ] **Important:** Move any code that uses `fs`, `path`, or other Node.js modules out of your React components.
    - [ ] For every piece of Node functionality the renderer needs (e.g., opening a file dialog), you must:
        1.  Create an `ipcMain.handle(...)` in your main Electron file.
        2.  Expose that handler to the renderer via `contextBridge.exposeInMainWorld(...)` in `preload.js`.
        3.  Call the exposed function from your React code (e.g., `window.myApi.openFile()`).

- [ ] **3. Test in Electron:**
    - [ ] Run the app with your electron start command (`npm run electron-dev-macos` or similar).
    - [ ] Verify that the app loads and that all interactions with the backend (like saving/loading) work through the new IPC bridge.

---

### Phase 3: Audit and Upgrade Dependencies

*Update the ecosystem of libraries to be compatible with modern React.*

- [ ] **1. Audit `package.json`:**
    - [ ] For every dependency, especially the `react-*` ones, check if its current version is compatible with React 18.
    - [ ] Pay special attention to:
        - `react-dnd` (will need a major upgrade)
        - `rc-slider`
        - `react-hotkeys`
        - `react-ace`
        - `classnames` (check for updates)
    - [ ] Create a list of packages that need to be updated or replaced.

- [ ] **2. Upgrade Packages Incrementally:**
    - [ ] Upgrade one package at a time.
    - [ ] After each upgrade, run your test suite (`npm test`) and manually test the relevant feature in the app.

---

### Phase 4: Upgrade React

*The final step. Upgrade React itself.*

- [ ] **1. Update React Packages:**
    - [ ] `npm install react@latest react-dom@latest`

- [ ] **2. Update to `createRoot` API:**
    - [ ] In your application's entry point (`src/index.js` or similar), change the `ReactDOM.render` call to the new `createRoot` API.

- [ ] **3. Full Regression Test:**
    - [ ] Run your full test suite (`npm test`). Fix any failing tests.
    - [ ] Manually perform a full test of the application. Go through every feature, button, and interaction. Pay close attention to state updates, rendering, and timeline behavior.
    - [ ] Once all tests pass and the app is stable, merge the `upgrade` branch back into your main branch.

- [ ] **4. Celebrate!**
    - [ ] You have successfully modernized a complex application. 