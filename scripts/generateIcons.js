import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const svgPath = path.resolve('public/favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generatePngIcons() {
  try {
    // 1. Generate PWA 192x192 PNG Icon
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(path.resolve('public/pwa-192x192.png'));
    console.log('✅ Generated public/pwa-192x192.png');

    // 2. Generate PWA 512x512 PNG Icon
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.resolve('public/pwa-512x512.png'));
    console.log('✅ Generated public/pwa-512x512.png');

    // 3. Generate Apple Touch Icon 180x180 PNG
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.resolve('public/apple-touch-icon.png'));
    console.log('✅ Generated public/apple-touch-icon.png');

    // 4. Generate Maskable Icon 512x512 PNG
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(path.resolve('public/maskable-icon-512x512.png'));
    console.log('✅ Generated public/maskable-icon-512x512.png');

    // 5. Generate Favicon 64x64 PNG
    await sharp(svgBuffer)
      .resize(64, 64)
      .png()
      .toFile(path.resolve('public/favicon.png'));
    console.log('✅ Generated public/favicon.png');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generatePngIcons();
