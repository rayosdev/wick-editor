# Engine TypeScript Conversion Plan

**Goal:** Convert the Wick Engine from JavaScript to TypeScript while maintaining full compatibility with the frontend.

**Current Status:**
- ✅ Vite build system working
- ✅ 1 file already TypeScript (`Wick.ts`)
- ⏳ 112 JavaScript files need conversion

---

## 🎯 **Conversion Strategy**

### Phase 1: Setup & Configuration
1. **Update Vite config** for TypeScript compilation
2. **Enhance TypeScript config** for better type checking
3. **Add type definitions** for external libraries
4. **Test build pipeline** with mixed JS/TS files

### Phase 2: Core Files First
Convert in order of dependency:
1. **Core classes** (`Wick.ts` ✅, `Color.js`, `FileCache.js`)
2. **Base classes** (`WickObject.js`, `WickObjectCache.js`)
3. **Project structure** (`Project.js`, `Timeline.js`, `Frame.js`)
4. **Tools** (`Tool.js`, `Brush.js`, `Pencil.js`)

### Phase 3: Remaining Files
5. **GUI components** (timeline, layers, etc.)
6. **Utilities** (export, import, etc.)
7. **View components** (canvas, rendering)

### Phase 4: Testing & Validation
8. **Run all tests** to ensure compatibility
9. **Fix any type errors**
10. **Update build scripts**

---

## 🔧 **Technical Approach**

### File Conversion Process
```bash
# For each file:
1. Rename: file.js → file.ts
2. Add type annotations
3. Fix any TypeScript errors
4. Test build
5. Update imports in other files
```

### Type Safety Strategy
- **Gradual typing**: Start with `any` types, refine over time
- **Interface definitions**: Create interfaces for complex objects
- **External library types**: Add `@types/` packages where needed
- **Strict mode**: Enable gradually (currently `strict: false`)

### Build System Updates
- **Vite**: Already supports TypeScript out of the box
- **tsconfig.json**: Update for better type checking
- **Import resolution**: Ensure `.ts` files are resolved correctly

---

## 📋 **File Conversion Priority**

### High Priority (Core Engine)
```
src/Wick.ts ✅ (already done)
src/Color.js → Color.ts
src/FileCache.js → FileCache.ts
src/WickObject.js → WickObject.ts
src/WickObjectCache.js → WickObjectCache.ts
src/Project.js → Project.ts
src/Timeline.js → Timeline.ts
src/Frame.js → Frame.ts
```

### Medium Priority (Tools & Interaction)
```
src/tools/Tool.js → Tool.ts
src/tools/Brush.js → Brush.ts
src/tools/Pencil.js → Pencil.ts
src/tools/Eraser.js → Eraser.ts
src/tools/Fill.js → Fill.ts
src/tools/Text.js → Text.ts
```

### Lower Priority (GUI & Utilities)
```
src/gui/*.js → *.ts
src/export/*.js → *.ts
src/import/*.js → *.ts
src/view/*.js → *.ts
```

---

## 🧪 **Testing Strategy**

### Automated Testing
- **Build tests**: Ensure Vite builds successfully
- **E2E tests**: Run existing Playwright tests
- **Unit tests**: Run engine-specific tests
- **Type checking**: `tsc --noEmit` for type validation

### Manual Testing
- **Frontend integration**: Load editor, test all tools
- **Drawing functionality**: Brush, pencil, eraser work
- **Project operations**: Save, load, export work
- **Performance**: No regression in build time

---

## 📊 **Success Criteria**

### ✅ **Must Have**
- [ ] All 112 JS files converted to TS
- [ ] Vite build succeeds without errors
- [ ] All existing tests pass
- [ ] Frontend loads and functions normally
- [ ] No runtime errors in browser

### 🎯 **Nice to Have**
- [ ] Strict type checking enabled
- [ ] Better IDE support and autocomplete
- [ ] Reduced runtime errors
- [ ] Improved code maintainability

---

## 🚀 **Implementation Steps**

### Step 1: Update Build Configuration
```bash
# Update vite.config.cjs for better TypeScript support
# Update tsconfig.json for stricter checking
# Test build with current mixed JS/TS setup
```

### Step 2: Convert Core Files (Batch 1)
```bash
# Convert 5-10 core files at a time
# Test build after each batch
# Fix any import/export issues
```

### Step 3: Convert Tools (Batch 2)
```bash
# Convert all tool files
# Test drawing functionality
# Ensure tool settings work
```

### Step 4: Convert Remaining Files (Batch 3)
```bash
# Convert GUI and utility files
# Final testing and cleanup
# Enable stricter type checking
```

---

## ⚠️ **Potential Challenges**

### Type Definition Complexity
- **Wick objects**: Complex inheritance hierarchies
- **Paper.js integration**: External library types
- **Canvas operations**: Browser API types

### Import/Export Issues
- **Circular dependencies**: May need refactoring
- **Module resolution**: Ensure Vite handles TS correctly
- **Global variables**: `window.Wick` exposure

### Performance Considerations
- **Build time**: TypeScript compilation adds overhead
- **Bundle size**: Type definitions may increase size
- **Development speed**: Better IDE support vs compilation time

---

## 📈 **Expected Benefits**

### Developer Experience
- **Better IDE support**: Autocomplete, refactoring
- **Type safety**: Catch errors at compile time
- **Documentation**: Types serve as inline docs
- **Refactoring**: Safer code changes

### Code Quality
- **Reduced bugs**: Type checking catches errors
- **Better maintainability**: Clear interfaces
- **Easier onboarding**: Types explain code structure
- **Future-proofing**: Easier to add new features

---

## 🎯 **Next Steps**

1. **Start with configuration updates**
2. **Convert 5-10 core files as proof of concept**
3. **Test build and frontend integration**
4. **Continue with systematic conversion**
5. **Enable stricter type checking gradually**

**Estimated Time:** 2-3 days for full conversion
**Risk Level:** Low (Vite handles TS well, gradual conversion)
**Impact:** High (better code quality, maintainability)

---

**Ready to begin TypeScript conversion! 🚀**
