import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function extractVisualTexts() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 1600 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const files = fs.readdirSync(srcDir).filter(f => {
    return fs.statSync(path.join(srcDir, f)).isFile() && !f.endsWith('.zip');
  });

  const logoItems = files.map(file => {
    const fPath = path.join(srcDir, file);
    const fileBuf = fs.readFileSync(fPath);
    const ext = path.extname(file).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;
    return { file, dataUrl };
  });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="background:#f8fafc; font-family:sans-serif; padding:40px;">
        <h1 style="color:#0f172a;">All Client Logos Identification Grid</h1>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px;">
          ${logoItems.map(item => `
            <div style="background:white; padding:20px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
              <div style="background:#0f172a; padding:20px; border-radius:8px; margin-bottom:10px; display:flex; align-items:center; justify-content:center; min-height:80px;">
                <img src="${item.dataUrl}" style="max-height:60px; max-width:100%; object-fit:contain; filter: brightness(0) invert(1);" />
              </div>
              <strong style="color:#0f172a; font-size:13px; word-break:break-all;">${item.file}</strong>
            </div>
          `).join('')}
        </div>
      </body>
    </html>
  `);

  const outPath = path.join(process.cwd(), 'public', 'images', 'logo_catalog_audit.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved catalog audit screenshot to:', outPath);

  await browser.close();
}

extractVisualTexts().catch(console.error);
