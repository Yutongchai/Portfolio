/**
 * resize-images.js
 * Downsizes oversized source images to appropriate display dimensions.
 * Run with: node scripts/resize-images.js
 * Requires: sharp (already installed for convert-to-webp.js)
 */
const sharp = require('../node_modules/sharp');
const path = require('path');
const fs = require('fs');

// Normalize to forward slashes — Sharp's libvips has issues with Windows backslashes
const fwd = (p) => p.replace(/\\/g, '/');

const ROOT = fwd(path.resolve(__dirname, '..'));

const tasks = [
  // ─── Card images in src/assets/ (displayed ~810×540 on desktop) ────────────
  {
    src: `${ROOT}/src/assets/Engagement.webp`,
    out: `${ROOT}/src/assets/Engagement.webp`,
    width: 1000,          // 1000px wide ≈ 1.23× retina of 810 display width
    quality: 72,
    label: 'PLAY (Engagement)',
  },
  {
    src: `${ROOT}/src/assets/learn.webp`,
    out: `${ROOT}/src/assets/learn.webp`,
    width: 1000,
    quality: 72,
    label: 'LEARN (learn)',
  },
  {
    src: `${ROOT}/src/assets/Valued.webp`,
    out: `${ROOT}/src/assets/Valued.webp`,
    width: 1000,
    quality: 72,
    label: 'LEAD (Valued)',
  },

  // ─── Hero background (displayed ≈ full viewport, max 1920px wide) ──────────
  {
    src: `${ROOT}/public/connect.webp`,
    out: `${ROOT}/public/connect.webp`,
    width: 1920,
    quality: 75,
    label: 'Hero /connect.webp',
  },

  // ─── Logos (tiny display sizes — significant savings even at 2× DPR) ───────
  {
    src: `${ROOT}/public/beige2.webp`,
    out: `${ROOT}/public/beige2.webp`,
    width: 300,           // footer logo displayed ~150px, 2× for retina
    quality: 85,
    label: 'Footer logo (/beige2.webp)',
  },
  {
    src: `${ROOT}/public/black.webp`,
    out: `${ROOT}/public/black.webp`,
    width: 80,            // header icon displayed 34-40px, 2× for retina
    quality: 85,
    label: 'Header logo (/black.webp)',
  },
];

(async () => {
  let totalSaved = 0;

  for (const task of tasks) {
    try {
      // Read via Node's fs first — bypasses OneDrive native-lib file lock
      const inputBuf = fs.readFileSync(task.src);
      const meta = await sharp(inputBuf).metadata();
      const originalWidth = meta.width;

      if (originalWidth <= task.width) {
        console.log(`⏭  ${task.label}: already ${originalWidth}px wide — skipped`);
        continue;
      }

      const before = inputBuf.length;

      // Resize preserving aspect ratio, encode as webp into a Buffer,
      // then write directly — avoids native file-open locking (OneDrive)
      const outputBuffer = await sharp(inputBuf)
        .resize({ width: task.width, withoutEnlargement: true })
        .webp({ quality: task.quality })
        .toBuffer();

      fs.writeFileSync(task.out, outputBuffer);

      const after = outputBuffer.length;
      const savedKiB = ((before - after) / 1024).toFixed(0);
      const pct = ((1 - after / before) * 100).toFixed(0);
      totalSaved += (before - after);

      console.log(
        `✅ ${task.label}: ${(before / 1024).toFixed(0)} KiB → ${(after / 1024).toFixed(0)} KiB  (-${savedKiB} KiB / ${pct}%)`
      );
    } catch (err) {
      console.error(`❌ ${task.label}:`, err.message);
    }
  }

  console.log(`\n🎉 Total saved: ${(totalSaved / 1024 / 1024).toFixed(1)} MiB`);
})();
