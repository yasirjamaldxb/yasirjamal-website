import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function readBrandNames() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const files = fs.readdirSync(srcDir);

  for (const file of files) {
    if (file.endsWith('.svg')) {
      const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
      console.log(`=== SVG: ${file} ===`);
      const texts = content.match(/<text[^>]*>([\s\S]*?)<\/text>/gi) || [];
      const title = content.match(/<title[^>]*>([\s\S]*?)<\/title>/gi) || [];
      console.log('  Titles:', title);
      console.log('  Texts:', texts.slice(0, 5));
    }
  }

  // Also inspect what text is inside the webp/png files by running Playwright canvas text OCR/inspection
  const imageFiles = [
    'logo-1.webp',
    'logo-color.svg',
    'logo.png',
    'logo.webp',
    'global-logo_white.svg',
    'header-logo.svg'
  ];

  for (const f of imageFiles) {
    const fPath = path.join(srcDir, f);
    if (!fs.existsSync(fPath)) continue;
    const fileBuf = fs.readFileSync(fPath);
    const ext = path.extname(f).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body>
          <img id="img" src="${dataUrl}" />
        </body>
      </html>
    `);

    const dims = await page.evaluate(() => {
      const img = document.getElementById('img');
      return { w: img.naturalWidth, h: img.naturalHeight, src: img.src.substring(0, 50) };
    });
    console.log(`Image ${f}:`, dims);
  }

  await browser.close();
}

readBrandNames().catch(console.error);
