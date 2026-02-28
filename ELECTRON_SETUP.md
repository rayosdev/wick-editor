# Electron Setup

The `_electronDependencies_DORMANT` block was removed from `package.json` during dependency cleanup.

If you need to restore Electron packaging support, add these packages back to `dependencies` or `devDependencies` as appropriate:

- `electron`
- `electron-builder`
- `electron-builder-notarize`
- `electron-is-dev`
- `electron-notarize`
- `electron-osx-sign`
- `electron-packager`
- `electron-updater`

Then add this postinstall script back to `package.json` scripts:

- `"postinstall": "electron-builder install-app-deps"`

Finally run:

```bash
npm install
```
