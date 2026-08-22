import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const heroSource = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e\\hero_studio_luxury_1787415394724.jpg';
const aboutSource = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e\\about_design_workspace_1787415418794.jpg';

async function processImages() {
  console.log('Processing non-portrait hero and about assets...');

  // 1. Hero Image: Deploy to public/images/hero_v3.webp and public/images/hero_v3.jpg
  await sharp(heroSource)
    .resize(1920, 1080, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile('public/images/hero_v3.jpg');

  await sharp(heroSource)
    .resize(1920, 1080, { fit: 'cover' })
    .webp({ quality: 88 })
    .toFile('public/images/hero_v3.webp');

  console.log('✓ Hero background updated (non-portrait Dubai design studio overlooking Burj Khalifa)');

  // 2. About Image: Deploy to public/images/yasir_about.webp and public/images/yasir_about.jpg
  await sharp(aboutSource)
    .resize(1600, 1000, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile('public/images/yasir_about.jpg');

  await sharp(aboutSource)
    .resize(1600, 1000, { fit: 'cover' })
    .webp({ quality: 88 })
    .toFile('public/images/yasir_about.webp');

  console.log('✓ About / Meet Yasir section updated (non-portrait architectural design workspace)');
}

processImages().catch(err => {
  console.error('Error processing assets:', err);
  process.exit(1);
});
