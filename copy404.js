// This script copies index.html to 404.html after build for GitHub Pages SPA routing.
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');
const notFoundFile = path.join(distDir, '404.html');

if (fs.existsSync(indexFile)) {
  fs.copyFileSync(indexFile, notFoundFile);
  console.log('404.html created for GitHub Pages SPA support.');
} else {
  console.error('index.html not found in dist/. Build first!');
}
