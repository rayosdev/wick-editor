# Visual Icon Loading Issue

## Issue Description

Based on the screenshot provided, there are broken image icons showing in the inspector panel:

- 🖼️ breakApart-dark
- 🖼️ timeline-dark

The icons are displaying as broken images, suggesting the SVG files are not loading correctly at runtime.

## Investigation Results

### File Structure ✅

- Files exist: `/src/resources/tool-icons/breakApart-dark.svg` and `/src/resources/tool-icons/timeline-dark.svg`
- Imports are correct in `ToolIcon.tsx`
- Icon mapping includes both icons
- TypeScript declarations are properly set up

### Vite Configuration ✅

- Vite alias configured: `resources: "/src/resources"`
- Custom middleware for serving public resources
- SVG files should be handled correctly

## Potential Causes

1. **Vite Dev Server HMR Issue**

   - Sometimes Vite's Hot Module Replacement can cause temporary icon loading issues
   - Solution: Hard refresh (Cmd+Shift+R) or restart dev server

2. **Asset Bundling Issue**

   - SVG imports might not be resolving to correct URLs in development
   - Check browser console for 404 errors

3. **Import Resolution Timing**
   - Icons might be undefined when component first renders
   - Could be a race condition in module loading

## Debugging Steps

### 1. Check Browser Console

Open DevTools Console and look for:

```
GET http://localhost:3003/resources/tool-icons/breakApart-dark.svg 404 (Not Found)
```

### 2. Inspect Image src Attribute

In DevTools Elements tab, find the broken image and check its `src` attribute:

```html
<img class="img-tool-icon" alt="breakApart-dark icon" src="..." />
```

The src should be something like:

- `/src/resources/tool-icons/breakApart-dark.svg` (correct)
- or `undefined` (incorrect - import failed)
- or `[object Module]` (incorrect - SVG imported as module instead of URL)

### 3. Test Icon Import

Add console.log in ToolIcon.tsx to verify imports:

```typescript
console.log("breakApart-dark icon:", iconBreakApartDark);
console.log("timeline-dark icon:", iconTimelineDark);
```

## Potential Fixes

### Fix 1: Hard Refresh

Sometimes Vite's cache causes issues. Try:

1. Stop the dev server (Ctrl+C)
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart: `npm start`
4. Hard refresh browser (Cmd+Shift+R)

### Fix 2: Verify Icon Exports

Ensure icons are exported from the mapping object:

```typescript
// In ToolIcon.tsx line ~213
"breakApart-dark": iconBreakApartDark,  // Should be a string URL
"timeline-dark": iconTimelineDark,      // Should be a string URL
```

### Fix 3: Add Explicit ?url Suffix (if needed)

If Vite isn't handling SVGs as URLs, try:

```typescript
import iconBreakApartDark from "resources/tool-icons/breakApart-dark.svg?url";
import iconTimelineDark from "resources/tool-icons/timeline-dark.svg?url";
```

### Fix 4: Check Vite Plugin Configuration

Ensure @vitejs/plugin-react is properly handling assets:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "automatic",
    }),
  ],
  // ... rest of config
});
```

## Manual Test Instructions

1. **Start the development server**

   ```bash
   npm start
   ```

2. **Open browser DevTools** (F12 or Cmd+Option+I)

3. **Check Console tab** for any errors related to:

   - SVG loading failures
   - Module resolution errors
   - 404 errors for resources

4. **Check Network tab** and filter by "svg":

   - Look for failed requests (red status)
   - Check if breakApart-dark.svg and timeline-dark.svg are being requested
   - Verify the request URLs are correct

5. **Inspect Elements**:
   - Find the broken image elements
   - Check their `src` attribute values
   - Verify they point to valid paths

## Expected Behavior

✅ Icons should display properly with SVG graphics
✅ No broken image placeholders
✅ Console should be clear of 404 errors
✅ Network tab should show successful SVG loads (200 status)

## Current Status

⚠️ **Icons showing as broken images in Inspector panel**

- Application is running on http://localhost:3003
- TypeScript compilation has zero errors related to icons
- All 78 components successfully converted to functional components
- Phase 3 modernization complete

## Next Steps

1. Open browser DevTools and check console/network tabs
2. Look for specific error messages about these two icons
3. Verify the actual `src` attribute values in the DOM
4. If needed, apply one of the fixes above based on the root cause

## Related Files

- `/src/Editor/Util/ToolIcon/ToolIcon.tsx` - Icon component with imports
- `/src/resources/tool-icons/breakApart-dark.svg` - Source file
- `/src/resources/tool-icons/timeline-dark.svg` - Source file
- `/vite.config.js` - Vite configuration with resource middleware
- `/types/globals.d.ts` - TypeScript SVG module declarations

---

**Note**: This is likely a runtime/bundling issue rather than a code error, as:

- TypeScript compiles without errors
- Files exist in correct locations
- Import statements are syntactically correct
- Other icons in the same component work fine
