import sharp from 'sharp';
import fs from 'fs';

const sourceImg = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e\\.user_uploaded\\media_1787417509557.jpg';

async function composeBanner() {
  console.log('Composing uncropped, full-body portrait banner...');

  // The source is 1024 x 571
  // We will resize the source proportionally to height 800 (width = 800 * 1024 / 571 = 1434)
  const portraitResized = await sharp(sourceImg)
    .resize(1434, 800, { fit: 'contain' })
    .toBuffer();

  // Create a 2400 x 800 dark canvas
  // Composite the portrait on the right side (left offset = 2400 - 1434 = 966)
  // And apply a smooth horizontal gradient overlay on the left to seamlessly blend the text area
  
  // Create SVG gradient mask for seamless left blend
  const blendSvg = Buffer.from(`
    <svg width="2400" height="800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fadeLeft" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#050811" stop-opacity="1" />
          <stop offset="45%" stop-color="#050811" stop-opacity="0.95" />
          <stop offset="65%" stop-color="#050811" stop-opacity="0.5" />
          <stop offset="85%" stop-color="#050811" stop-opacity="0.1" />
          <stop offset="100%" stop-color="#050811" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="fadeTopBottom" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#050811" stop-opacity="0.4" />
          <stop offset="15%" stop-color="#050811" stop-opacity="0" />
          <stop offset="85%" stop-color="#050811" stop-opacity="0" />
          <stop offset="100%" stop-color="#050811" stop-opacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="2400" height="800" fill="url(#fadeLeft)" />
      <rect width="2400" height="800" fill="url(#fadeTopBottom)" />
    </svg>
  `);

  // Background base
  const bg = await sharp({
    create: {
      width: 2400,
      height: 800,
      channels: 3,
      background: { r: 5, g: 8, b: 17 } // #050811
    }
  }).jpeg().toBuffer();

  const finalComposite = await sharp(bg)
    .composite([
      {
        input: portraitResized,
        left: 966,
        top: 0
      },
      {
        input: blendSvg,
        left: 0,
        top: 0
      }
    ]);

  await finalComposite
    .clone()
    .jpeg({ quality: 94 })
    .toFile('public/images/yasir_about.jpg');

  await finalComposite
    .clone()
    .webp({ quality: 92 })
    .toFile('public/images/yasir_about.webp');

  console.log('✓ Successfully created uncropped high-resolution yasir_about.webp and yasir_about.jpg!');
}

composeBanner().catch(err => {
  console.error('Error composing banner:', err);
  process.exit(1);
});
