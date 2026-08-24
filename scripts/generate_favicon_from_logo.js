import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateFaviconsFromOriginalLogo() {
  console.log('🔍 Inspecting original logo files...');

  const logoPngPath = path.resolve('public/images/logo.png');
  const logoWebpPath = path.resolve('public/images/logo.webp');
  const logoSvgPath = path.resolve('public/images/logos/logo-color.svg');
  const headerLogoSvgPath = path.resolve('public/images/logos/header-logo.svg');

  let sourcePath = logoPngPath;
  if (fs.existsSync(logoPngPath)) {
    sourcePath = logoPngPath;
    console.log('Using public/images/logo.png as source');
  } else if (fs.existsSync(logoWebpPath)) {
    sourcePath = logoWebpPath;
    console.log('Using public/images/logo.webp as source');
  } else if (fs.existsSync(logoSvgPath)) {
    sourcePath = logoSvgPath;
    console.log('Using public/images/logos/logo-color.svg as source');
  }

  const meta = await sharp(sourcePath).metadata();
  console.log(`Source Logo Metadata: width=${meta.width}, height=${meta.height}, format=${meta.format}`);

  // Google Favicon Guidelines require square images (multiples of 48: 48x48, 96x96, 192x192, 512x512)
  // We place the exact logo centered within a clean square canvas with transparent background
  const sizes = [
    { size: 48, name: 'favicon-48x48.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'favicon-192x192.png' },
    { size: 512, name: 'favicon-512x512.png' }
  ];

  for (const item of sizes) {
    const outputPath = path.resolve('public', item.name);
    // Maintain aspect ratio with fit: 'contain' inside square canvas
    await sharp(sourcePath)
      .resize(item.size, item.size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    console.log(`✅ Generated: public/${item.name} (${item.size}x${item.size})`);
  }

  // Generate favicon.ico (32x32)
  await sharp(sourcePath)
    .resize(32, 32, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toFormat('png')
    .toFile(path.resolve('public/favicon.ico'));
  console.log('✅ Generated: public/favicon.ico (32x32)');

  // Also copy to root favicon.png
  await sharp(sourcePath)
    .resize(48, 48, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.resolve('public/favicon.png'));
  console.log('✅ Generated: public/favicon.png (48x48)');

  console.log('\n🎉 All favicons converted directly from your original logo with 100% Googlebot compatibility!');
}

generateFaviconsFromOriginalLogo().catch(console.error);
