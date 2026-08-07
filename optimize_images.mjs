import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = 'public/images';

const filesToOptimize = [
  { input: 'hero_v3.jpg', output: 'hero_v3.webp', width: 1200, quality: 82 },
  { input: 'bento_launch.jpg', output: 'bento_launch.webp', width: 800, quality: 80 },
  { input: 'p_hunza_v2.jpg', output: 'p_hunza_v2.webp', width: 1000, quality: 80 },
  { input: 'p_alomaids_v2.jpg', output: 'p_alomaids_v2.webp', width: 1000, quality: 80 },
  { input: 'p_noor_v2.jpg', output: 'p_noor_v2.webp', width: 1000, quality: 80 },
  { input: 'p_paws_v2.jpg', output: 'p_paws_v2.webp', width: 1000, quality: 80 },
  { input: 'real_hero_portrait.jpg', output: 'real_hero_portrait.webp', width: 800, quality: 82 },
  { input: 'yasir_about.jpg', output: 'yasir_about.webp', width: 800, quality: 80 },
  { input: 'logo.png', output: 'logo.webp', width: 180, quality: 85 }
];

async function run() {
  console.log('Optimizing images to WebP for Google PageSpeed 100...');
  for (const item of filesToOptimize) {
    const inputPath = path.join(imagesDir, item.input);
    const outputPath = path.join(imagesDir, item.output);

    if (fs.existsSync(inputPath)) {
      const beforeSize = fs.statSync(inputPath).size;
      await sharp(inputPath)
        .resize({ width: item.width, withoutEnlargement: true })
        .webp({ quality: item.quality, effort: 6 })
        .toFile(outputPath);
      const afterSize = fs.statSync(outputPath).size;
      console.log(`✓ ${item.input} (${Math.round(beforeSize/1024)}KB) -> ${item.output} (${Math.round(afterSize/1024)}KB) [${Math.round((1 - afterSize/beforeSize)*100)}% savings]`);
    }
  }

  // Optimize balanced logos
  const logosDir = path.join(imagesDir, 'balanced_logos');
  if (fs.existsSync(logosDir)) {
    const logoFiles = fs.readdirSync(logosDir).filter(f => f.endsWith('.png'));
    for (const logoFile of logoFiles) {
      const lInput = path.join(logosDir, logoFile);
      const lOutput = path.join(logosDir, logoFile.replace('.png', '.webp'));
      await sharp(lInput)
        .resize({ width: 240, withoutEnlargement: true })
        .webp({ quality: 85, effort: 6 })
        .toFile(lOutput);
      console.log(`✓ Logo: ${logoFile} -> WebP optimized`);
    }
  }

  console.log('All images optimized successfully!');
}

run().catch(console.error);
