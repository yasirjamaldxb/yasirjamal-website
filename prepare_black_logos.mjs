import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function processLogosToBlack() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'logos_black');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = [
    'audi-logo_2016.svg',
    'filatech-uae.svg',
    'global-logo_white.svg',
    'header-logo.svg',
    'julphar_logo.jpg',
    'logo-1.webp',
    'logo-color.svg',
    'logo.png',
    'logo.webp',
    'logo_property_finder.png',
    'lootah-holding-new-logo-1-revised-removebg-preview.png',
    'namshi-logo-vector.svg-.png',
    'omnicom-logo.svg',
    'pawsplanes_pr_logo.svg',
    'rocket_internet.png',
    'uae-podiatry_logo.jpg',
    'westminster-prperties.png',
    'wfp-logo-vertical-white-en.svg'
  ];

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) {
      console.warn('File not found:', filePath);
      continue;
    }

    const imgBuffer = fs.readFileSync(filePath);
    const mimeType = file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mimeType};base64,${imgBuffer.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background:transparent;">
          <div id="container" style="display:inline-block; padding:10px;">
            <img id="logo" src="${dataUrl}" style="display:block; max-height:80px; max-width:240px; width:auto; height:auto; filter: brightness(0); object-fit:contain;" />
          </div>
        </body>
      </html>
    `);

    const container = await page.$('#container');
    const outName = file.replace(/\.[^.]+$/, '') + '_black.png';
    const outPath = path.join(outDir, outName);

    if (container) {
      await container.screenshot({ path: outPath, omitBackground: true });
      console.log(`Processed solid black logo: ${outName}`);
    }
  }

  await browser.close();
}

processLogosToBlack().catch(console.error);
