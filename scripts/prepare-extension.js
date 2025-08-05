const fs = require('fs');
const path = require('path');

// Copy manifest and popup.html to dist-extension
const distDir = path.resolve(__dirname, '../dist-extension');

// Copy manifest.json
fs.copyFileSync(
  path.resolve(__dirname, '../public/manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy popup.html
fs.copyFileSync(
  path.resolve(__dirname, '../public/popup.html'),
  path.join(distDir, 'popup.html')
);

// Create icons directory and placeholder icons
const iconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Create simple SVG icons (you can replace with actual PNG icons later)
const createIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#3b82f6"/>
</svg>
`;

// For now, create SVG files (Chrome accepts SVG icons)
fs.writeFileSync(path.join(iconsDir, 'icon16.svg'), createIcon(16));
fs.writeFileSync(path.join(iconsDir, 'icon48.svg'), createIcon(48));
fs.writeFileSync(path.join(iconsDir, 'icon128.svg'), createIcon(128));

// Update manifest to use SVG icons
const manifestPath = path.join(distDir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.action.default_icon = {
  "16": "icons/icon16.svg",
  "48": "icons/icon48.svg", 
  "128": "icons/icon128.svg"
};

manifest.icons = {
  "16": "icons/icon16.svg",
  "48": "icons/icon48.svg",
  "128": "icons/icon128.svg"
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('Extension prepared in dist-extension/ directory');
console.log('To load in Chrome:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the dist-extension folder');