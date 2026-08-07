import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function fixAlOmaidsAndBoostSizes() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'balanced_logos');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Specifically fix Al Omaids (logo-1.webp)
  const alOmaidsPath = path.join(srcDir, 'logo-1.webp');
  if (fs.existsSync(alOmaidsPath)) {
    const fileBuf = fs.readFileSync(alOmaidsPath);
    const dataUrl = `data:image/webp;base64,${fileBuf.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background:transparent;">
          <img id="raw" src="${dataUrl}" style="display:none;" />
          <canvas id="c"></canvas>
        </body>
      </html>
    `);

    const result = await page.evaluate(async () => {
      const img = document.getElementById('raw');
      await new Promise(resolve => {
        if (img.complete) resolve();
        else img.onload = resolve;
      });

      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      const tempC = document.createElement('canvas');
      tempC.width = w;
      tempC.height = h;
      const tCtx = tempC.getContext('2d');
      tCtx.drawImage(img, 0, 0, w, h);

      const imgData = tCtx.getImageData(0, 0, w, h);
      const d = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let count = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const a = d[i+3];

          // If pixel has alpha (white logo mark in logo-1.webp)
          if (a > 15) {
            count++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;

            d[i] = 15;      // R: #0f
            d[i+1] = 23;    // G: #17
            d[i+2] = 42;    // B: #2a
            d[i+3] = 255;   // Solid alpha
          } else {
            d[i+3] = 0;
          }
        }
      }

      if (count === 0) return { error: 'No pixels found in logo-1.webp' };

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      tCtx.putImageData(imgData, 0, 0);

      const c = document.getElementById('c');
      c.width = cropW;
      c.height = cropH;
      const ctx = c.getContext('2d');
      ctx.drawImage(tempC, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      return { cropW, cropH, count };
    });

    console.log('Fixed Al Omaids result:', result);

    const canvas = await page.$('#c');
    if (canvas) {
      const savePath = path.join(outDir, 'al_omaids.png');
      await canvas.screenshot({ path: savePath, omitBackground: true });
      console.log('Saved clean solid black Al Omaids logo to:', savePath);
    }
  }

  await browser.close();
}

fixAlOmaidsAndBoostSizes().catch(console.error);
