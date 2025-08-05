# PromptHive Chrome Extension

PromptHive is now available as a Chrome extension! Save, organize, and enhance your AI prompts directly from any webpage with intelligent text selection and categorization.

## Features

- **Text Selection Capture**: Select any text on any webpage and save it as a prompt
- **AI-Powered Analysis**: Automatic categorization and tagging of saved prompts
- **Authentication**: Guest mode and full user accounts with Supabase
- **Prompt Management**: Create, edit, delete, and organize prompts
- **Smart Search & Filtering**: Find prompts by tags, categories, or content
- **Analytics Dashboard**: Track usage, popular tags, and reuse rates
- **Export Functionality**: Export your prompts to CSV or JSON
- **Version History**: Track changes to your prompts over time

## Installation

### Option 1: Build from Source

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build:extension`
4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `dist-extension` folder

### Option 2: Load Unpacked (Development)

1. Download the `dist-extension` folder
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist-extension` folder

## Usage

### Saving Prompts from Webpages

1. Select any text on a webpage (minimum 10 characters)
2. A "Save to PromptHive" button will appear
3. Click the button to save the selected text as a prompt
4. The prompt will be automatically categorized based on the source website

### Managing Prompts

1. Click the PromptHive extension icon in your Chrome toolbar
2. The popup will show your saved prompts and management interface
3. Use the search bar to find specific prompts
4. Filter by categories or tags using the filter dropdown
5. Click on any prompt to view details, edit, or see version history

### Dashboard & Analytics

1. Navigate to the Dashboard tab in the extension popup
2. View statistics about your prompt usage
3. See most used tags and categories
4. Track reuse rates and activity over time

### Guest Mode vs Authenticated Use

- **Guest Mode**: Prompts are saved locally and will persist until browser data is cleared
- **Authenticated**: Sign up for a free account to sync prompts across devices and access advanced features

## Permissions

The extension requires the following permissions:

- **Storage**: To save your prompts locally and sync with Supabase
- **Tabs**: To access the current tab's URL and title for prompt metadata
- **ActiveTab**: To detect text selections on the current page
- **Host Permissions**: To run content scripts on all websites for text selection

## Privacy

- Your prompts are stored securely with Supabase (for authenticated users) or locally (for guests)
- No browsing data is collected beyond what you explicitly save as prompts
- Source URLs are only stored as metadata for the prompts you choose to save

## Technical Details

- Built with React, TypeScript, and Tailwind CSS
- Uses Manifest V3 for modern Chrome extension standards
- Supabase backend for authentication and data storage
- Content script for text selection detection
- Service worker for background processing

## Support

If you encounter any issues or have feature requests, please open an issue on the GitHub repository.