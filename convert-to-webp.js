const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Folders to scan
const targets = ['./src/assets', './public'];

function convertDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a folder, dive in!
      convertDir(filePath);
    } else {
      const fileExt = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(fileExt)) {
        const outputName = file.replace(fileExt, '.webp');
        const outputPath = path.join(dir, outputName);

        sharp(filePath)
          .webp({ quality: 80 })
          .toFile(outputPath)
          .then(() => {
            console.log(`✅ Converted: ${filePath} -> ${outputName}`);
            // Optional: Uncomment the next line to delete the old file automatically
            // fs.unlinkSync(filePath); 
          })
          .catch(err => console.error(`❌ Error in ${filePath}:`, err));
      }
    }
  });
}

targets.forEach(t => {
  if (fs.existsSync(t)) convertDir(t);
});