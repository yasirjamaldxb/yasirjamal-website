import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function fixWhiteOnTransparentLogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'balanced_logos');

  const srcPath = path.join(srcDir, 'westminster-prperties.png');
  const fileBuf = fs.readFileSync(srcPath);
  const dataUrl = `data:image/png;base64,${fileBuf.toString('base64')}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:transparent;">
        <img id="img" src="${dataUrl}" style="display:none;" />
        <canvas id="c"></canvas>
      </body>
    </html>
  `);

  const result = await page.evaluate(async () => {
    const img = document.getElementById('img');
    await new Promise(resolve => {
      if (img.complete) resolve();
      else img.onload = resolve;
    });

    const w = img.naturalWidth;
    const h = img.naturalHeight;

    const tempC = document.createElement('canvas');
    tempC.width = w;
    tempC.height = h;
    const tCtx = tempC.getContext('2d');
    tCtx.drawImage(img, 0, 0);

    const imgData = tCtx.getImageData(0, 0, w, h);
    const d = imgData.data;

    let minX = w, minY = h, maxX = 0, maxY = 0;
    let count = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const a = d[i+3];

        if (a > 15) { // Non-transparent pixel (white logo text)
          count++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          // Convert white pixel to solid dark slate #0f172a
          d[i] = 15;     // R
          d[i+1] = 23;   // G
          d[i+2] = 42;   // B
          // keep alpha d[i+3] as is
        }
      }
    }

    if (count === 0) return { error: 'No pixels found' };

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

  console.log('Fixed Westminster result:', result);

  const canvas = await page.$('#c');
  if (canvas) {
    const savePath = path.join(outDir, 'westminster.png');
    await canvas.screenshot({ path: savePath, omitBackground: true });
    console.log('Saved clean black Westminster Properties logo to:', savePath);
  }

  await browser.close();
}

fixWhiteOnTransparentLogos().catch(console.error);
