import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function identifyLogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const files = [
    'logo-1.webp',
    'logo-color.svg',
    'logo.png',
    'logo.webp',
    'global-logo_white.svg',
    'header-logo.svg'
  ];

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) continue;

    const fileBuf = fs.readFileSync(filePath);
    const ext = path.extname(file).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="background:#0f172a; padding:40px; text-align:center;">
          <h2 style="color:white; font-family:sans-serif;">${file}</h2>
          <img src="${dataUrl}" style="max-height:150px; background:white; padding:20px; border-radius:8px;" />
        </body>
      </html>
    `);

    const outPng = path.join(process.cwd(), 'public', 'images', `debug_${file.replace(/[^a-z0-9]/gi, '_')}.png`);
    await page.screenshot({ path: outPng });
    console.log(`Saved screenshot for identification: ${file} -> ${outPng}`);
  }

  await browser.close();
}

identifyLogos().catch(console.error);
