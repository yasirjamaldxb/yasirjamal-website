import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function fixWestminster() {
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
        <img id="src" src="${dataUrl}" style="display:none;" />
        <canvas id="canvas"></canvas>
      </body>
    </html>
  `);

  await page.evaluate(async () => {
    const img = document.getElementById('src');
    await new Promise(resolve => {
      if (img.complete) resolve();
      else img.onload = resolve;
    });

    const rawCanvas = document.createElement('canvas');
    const rawCtx = rawCanvas.getContext('2d');
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    rawCanvas.width = w;
    rawCanvas.height = h;
    rawCtx.drawImage(img, 0, 0);

    const imgData = rawCtx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let minX = w, minY = h, maxX = 0, maxY = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 30 || (r > 240 && g > 240 && b > 240)) {
        data[i + 3] = 0;
      } else {
        data[i] = 15;
        data[i + 1] = 23;
        data[i + 2] = 42;
        data[i + 3] = 255;
      }
    }

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        if (data[idx + 3] > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;

    const canvas = document.getElementById('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    tempCanvas.getContext('2d').putImageData(imgData, 0, 0);

    ctx.drawImage(tempCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
  });

  const canvasEl = await page.$('#canvas');
  if (canvasEl) {
    await canvasEl.screenshot({ path: path.join(outDir, 'westminster.png'), omitBackground: true });
    console.log('Fixed and trimmed westminster.png!');
  }

  await browser.close();
}

fixWestminster().catch(console.error);
