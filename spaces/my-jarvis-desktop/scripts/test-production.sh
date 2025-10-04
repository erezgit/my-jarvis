#!/bin/bash
# Production Build Verification Script
# Run this before pushing any changes that affect gitignore or dependencies

set -e

echo "🔍 Testing production build integrity..."

# 1. Build production app
echo "📦 Building production app..."
npm run build:mac

# 2. Check required files exist in build
echo "🔎 Verifying critical files are packaged..."
REQUIRED_FILES=(
    "dist/mac-arm64/MyJarvisDesktop.app/Contents/Resources/claude-webui-server"
    "dist/mac-arm64/MyJarvisDesktop.app/Contents/Resources/claude-webui-server/cli/electron-node.cjs"
    "dist/mac-arm64/MyJarvisDesktop.app/Contents/Resources/claude-webui-server/node_modules"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -e "$file" ]; then
        echo "❌ CRITICAL: Missing required file: $file"
        echo "🚨 Production build will fail!"
        exit 1
    else
        echo "✅ Found: $file"
    fi
done

# 3. Test backend server starts
echo "🚀 Testing backend server startup..."
cd dist/mac-arm64/MyJarvisDesktop.app/Contents/Resources/claude-webui-server
timeout 10s node cli/electron-node.cjs --port 8082 &
SERVER_PID=$!
sleep 3

# Test if server responds
if curl -f http://127.0.0.1:8082/api/projects >/dev/null 2>&1; then
    echo "✅ Backend server responds correctly"
    kill $SERVER_PID 2>/dev/null || true
else
    echo "❌ Backend server failed to start or respond"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

cd - >/dev/null

echo "🎉 Production build verification PASSED"
echo "✅ Safe to commit and push changes"