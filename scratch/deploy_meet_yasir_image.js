import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImg = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e\\.user_uploaded\\media_1787417509557.jpg';

async function processMeetYasirImage() {
  console.log('Processing new Meet Yasir Jamal background image...');

  await sharp(sourceImg)
    .resize(1920, 1080, { fit: 'cover', position: 'right' })
    .jpeg({ quality: 92 })
    .toFile('public/images/yasir_about.jpg');

  await sharp(sourceImg)
    .resize(1920, 1080, { fit: 'cover', position: 'right' })
    .webp({ quality: 90 })
    .toFile('public/images/yasir_about.webp');

  console.log('✓ Successfully updated public/images/yasir_about.webp and public/images/yasir_about.jpg');
}

processMeetYasirImage().catch(err => {
  console.error('Error processing Meet Yasir image:', err);
  process.exit(1);
});
