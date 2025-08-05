#!/bin/bash

echo "🔧 Building PromptHive Chrome Extension..."

# Build the extension
echo "📦 Building React app for extension..."
BUILD_TARGET=extension npm run build

# Prepare extension files
echo "🎯 Preparing extension files..."
node scripts/prepare-extension.js

echo "✅ Extension built successfully!"
echo ""
echo "📂 Extension files are in: dist-extension/"
echo ""
echo "🚀 To load in Chrome:"
echo "   1. Open chrome://extensions/"
echo "   2. Enable 'Developer mode'"
echo "   3. Click 'Load unpacked'"
echo "   4. Select the 'dist-extension' folder"
echo ""
echo "🌟 Features included:"
echo "   • Text selection capture on any website"
echo "   • Full prompt management (CRUD operations)"
echo "   • Guest mode & user authentication"
echo "   • Search, filter, and export functionality"
echo "   • Analytics dashboard"
echo "   • AI-powered prompt enhancement"
echo ""