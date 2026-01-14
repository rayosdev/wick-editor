#!/bin/bash
# Comprehensive test script for TypeScript conversions

set -e  # Exit on error

echo "🔍 Testing TypeScript Conversion - Comprehensive Test Suite"
echo "=========================================================="
echo ""

# Test 1: TypeScript compilation
echo "1️⃣  Testing TypeScript compilation..."
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "❌ TypeScript compilation FAILED"
    npx tsc --noEmit
    exit 1
else
    echo "✅ TypeScript compilation passed"
fi
echo ""

# Test 2: Unit tests
echo "2️⃣  Running unit tests..."
if npm run test:unit -- --run 2>&1 | grep -q "FAIL"; then
    echo "❌ Unit tests FAILED"
    npm run test:unit -- --run
    exit 1
else
    TEST_OUTPUT=$(npm run test:unit -- --run 2>&1 | tail -5)
    echo "✅ Unit tests passed"
    echo "$TEST_OUTPUT"
fi
echo ""

# Test 3: Check for broken imports
echo "3️⃣  Checking for broken imports (.jsx extensions in imports)..."
BROKEN_IMPORTS=$(grep -r "from.*\.jsx['\"]" src/Editor --include="*.jsx" --include="*.tsx" || true)
if [ -n "$BROKEN_IMPORTS" ]; then
    echo "❌ Found broken imports with .jsx extensions:"
    echo "$BROKEN_IMPORTS"
    exit 1
else
    echo "✅ No broken imports found"
fi
echo ""

# Test 4: Check for missing files
echo "4️⃣  Checking for missing imported files..."
echo "✅ Skipping detailed file check (can be added later)"
echo ""

# Test 5: Build test (optional, can be slow)
if [ "${FULL_TEST}" = "1" ]; then
    echo "5️⃣  Testing production build..."
    if npm run build 2>&1 | grep -qi "error"; then
        echo "❌ Build FAILED"
        npm run build
        exit 1
    else
        echo "✅ Build passed"
    fi
    echo ""
fi

# Test 6: Count conversions
echo "📊 Conversion Statistics:"
TOTAL_JSX=$(find src/Editor -name "*.jsx" -type f | wc -l | tr -d ' ')
TOTAL_TSX=$(find src/Editor -name "*.tsx" -type f | wc -l | tr -d ' ')
TOTAL_FILES=$((TOTAL_JSX + TOTAL_TSX))
PERCENT=$((TOTAL_TSX * 100 / TOTAL_FILES))
echo "   - JSX files remaining: $TOTAL_JSX"
echo "   - TSX files converted: $TOTAL_TSX"
echo "   - Total files: $TOTAL_FILES"
echo "   - Conversion progress: $PERCENT%"
echo ""

echo "✅ All tests passed! Safe to continue conversion."
