# TypeScript Migration

This project has been migrated from JavaScript to TypeScript in non-strict mode. This allows for a gradual transition to TypeScript while maintaining compatibility with the existing JavaScript codebase.

## Configuration

### TypeScript Configuration (`tsconfig.json`)
- **Non-strict mode**: `strict: false` allows for optional typing
- **JavaScript compatibility**: `allowJs: true` supports mixed JS/TS files
- **JSX support**: `jsx: "react-jsx"` for React components
- **Path mapping**: Maintains existing import aliases for `Editor/*`, `resources/*`, and `Wick/*`

### Build Configuration
- **Vite**: Updated to handle TypeScript with proper esbuild configuration
- **Type checking**: New `npm run type-check` script for TypeScript validation
- **Asset handling**: Configured to handle TypeScript, TSX, and module declarations

## Type Definitions

### Global Types (`src/types/`)
- `global.d.ts`: Global window extensions and module declarations
- `editor.d.ts`: Editor-specific interfaces and component types

### Window Extensions
The following properties are now properly typed on the global `window` object:
- `window.Wick`: Wick Engine API
- `window.paper`: Paper.js library
- `window.project`: Current project reference
- File handling APIs (`saveFileFromWick`, `createFileInput`, etc.)
- Electron API extensions

## Development

### Scripts
- `npm start`: Start development server (Vite with TypeScript support)
- `npm run build`: Build project (includes TypeScript compilation)
- `npm run type-check`: Run TypeScript type checking without emitting files

### Gradual Migration Approach
1. **Phase 1**: ✅ Basic TypeScript setup with non-strict mode
2. **Phase 2**: Add type annotations to core components as needed
3. **Phase 3**: Gradually enable stricter type checking
4. **Phase 4**: Full strict mode migration (future goal)

## Benefits
- **Improved Developer Experience**: Better IntelliSense and auto-completion
- **Early Error Detection**: TypeScript catches potential runtime errors at compile time
- **Better Refactoring**: Safe renaming and code restructuring
- **Documentation**: Types serve as inline documentation
- **Gradual Adoption**: Non-strict mode allows incremental improvement

## Notes
- The build process remains the same - Vite handles TypeScript compilation automatically
- JavaScript files can coexist with TypeScript files during the migration
- The project maintains full backward compatibility with existing JavaScript code
- Type errors are reported but don't block the build process in non-strict mode
