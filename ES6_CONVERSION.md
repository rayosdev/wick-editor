# ES6 Module Conversion Progress

## Strategy
Convert the Wick Engine from global namespace pattern to ES6 modules, with tests protecting against regressions.

## Conversion Steps Per File
1. Add ES6 imports at top
2. Convert `Wick.ClassName = class` to `export class ClassName`
3. Replace `Wick.OtherClass` references with imports
4. Export at bottom
5. Run tests to verify
6. Rebuild engine: `npm run build-engine`
7. Test in editor

## Files to Convert (Priority Order)

### Phase 1: View Layer (Where Our Improvements Are)
- [ ] `engine/src/view/View.js` (base class)
- [ ] `engine/src/view/View.Project.js` ⭐ (contains mouse/trackpad improvements)
- [ ] `engine/src/view/View.Clip.js`
- [ ] `engine/src/view/View.Frame.js`
- [ ] `engine/src/view/View.Path.js`

### Phase 2: Core Models
- [ ] `engine/src/base/Base.js`
- [ ] `engine/src/base/Project.js`
- [ ] `engine/src/base/Clip.js`
- [ ] `engine/src/base/Frame.js`
- [ ] `engine/src/base/Layer.js`
- [ ] `engine/src/base/Timeline.js`

### Phase 3: Tools
- [ ] `engine/src/tools/Tool.js`
- [ ] `engine/src/tools/Tools.*.js`

### Phase 4: Utilities
- [ ] `engine/src/utils/*.js`

## Test Strategy
- Keep `npm run test:unit:watch` running
- After each file conversion:
  - Check tests still pass
  - Rebuild engine if needed
  - Manual smoke test

## Notes
- Some files may need to stay as global namespace for backwards compatibility
- Gulp build process may need updates to handle ES6
- Consider using a bundler (Rollup/Webpack) for the engine

## Current Status
🎯 Ready to start with View.js and View.Project.js
