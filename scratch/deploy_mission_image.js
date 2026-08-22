import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const sourceImg = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e\\.user_uploaded\\media_1787416519268.jpg';

async function processMissionImage() {
  console.log('Processing new mission image for About page...');

  await sharp(sourceImg)
    .resize(1920, 1080, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 92 })
    .toFile('public/images/yasir_mission.jpg');

  await sharp(sourceImg)
    .resize(1920, 1080, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toFile('public/images/yasir_mission.webp');

  console.log('✓ Successfully created public/images/yasir_mission.webp and public/images/yasir_mission.jpg');
}

processMissionImage().catch(err => {
  console.error('Error processing mission image:', err);
  process.exit(1);
});
