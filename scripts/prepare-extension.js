const fs = require('fs');
const path = require('path');

// Copy manifest and popup.html to dist-extension
const distDir = path.resolve(__dirname, '../dist-extension');

// Ensure dist-extension directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

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

// Create icons directory and copy icons
const iconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// Copy existing PNG icons from public/icons
const publicIconsDir = path.resolve(__dirname, '../public/icons');
if (fs.existsSync(publicIconsDir)) {
  const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
  iconFiles.forEach(iconFile => {
    const sourcePath = path.join(publicIconsDir, iconFile);
    const targetPath = path.join(iconsDir, iconFile);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

console.log('Extension prepared in dist-extension/ directory');
console.log('To load in Chrome:');
console.log('1. Open Chrome and go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked" and select the dist-extension folder');