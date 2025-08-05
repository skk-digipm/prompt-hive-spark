# Building PromptHive Chrome Extension

## Quick Start

To build and load the PromptHive Chrome extension:

1. **Build the extension:**
   ```bash
   BUILD_TARGET=extension npm run build
   ```

2. **Prepare extension files:**
   ```bash
   node scripts/prepare-extension.js
   ```

3. **Load in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `dist-extension` folder

## Extension Structure

After building, the `dist-extension` folder will contain:

```
dist-extension/
├── manifest.json          # Extension manifest (V3)
├── popup.html             # Extension popup interface
├── popup.js               # Main React app bundle
├── content.js             # Content script for text selection
├── background.js          # Service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── assets/                # CSS and other assets
```

## Features

The Chrome extension includes all web app functionality:

- **Text Selection**: Select text on any webpage to save as prompts
- **Authentication**: Guest mode and Supabase user accounts
- **Prompt Management**: Full CRUD operations for prompts
- **Search & Filter**: Find prompts by content, tags, or categories
- **Analytics Dashboard**: Usage statistics and insights
- **Export**: CSV and JSON export functionality
- **AI Enhancement**: Prompt analysis and improvement suggestions

## Development

For development with hot reloading:

1. Run the web app normally: `npm run dev`
2. For extension testing, build and reload in Chrome after changes

## Permissions

The extension requires:

- **storage**: Save prompts and user data
- **tabs**: Access current tab information
- **activeTab**: Detect text selections
- **host_permissions**: Run on all websites for text capture

## Troubleshooting

**Extension not loading:**
- Ensure `dist-extension` folder contains all required files
- Check Chrome DevTools for any console errors
- Verify manifest.json is valid JSON

**Text selection not working:**
- Check if content script loaded properly
- Look for errors in webpage console
- Ensure site allows content script injection

**Popup not opening:**
- Check popup.html and popup.js are present
- Verify no TypeScript/build errors
- Check extension popup console for errors