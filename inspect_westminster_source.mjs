import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function inspectWestminster() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const srcPath = path.join(process.cwd(), 'public', 'images', 'logos', 'westminster-prperties.png');
  const fileBuf = fs.readFileSync(srcPath);
  const dataUrl = `data:image/png;base64,${fileBuf.toString('base64')}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:20px; background:#1e293b;">
        <img id="img" src="${dataUrl}" style="max-width:400px; border:1px solid red;" />
        <canvas id="c"></canvas>
      </body>
    </html>
  `);

  const info = await page.evaluate(async () => {
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

    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    let alphaCount = 0;
    const pixelSamples = [];

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
      if (a > 0) {
        alphaCount++;
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
        if (g < minG) minG = g;
        if (g > maxG) maxG = g;
        if (b < minB) minB = b;
        if (b > maxB) maxB = b;
        if (pixelSamples.length < 20 && (r < 250 || g < 250 || b < 250)) {
          pixelSamples.push({ r, g, b, a });
        }
      }
    }

    return { w, h, alphaCount, minR, maxR, minG, maxG, minB, maxB, pixelSamples };
  });

  console.log('Westminster inspection results:', info);
  await browser.close();
}

inspectWestminster().catch(console.error);
