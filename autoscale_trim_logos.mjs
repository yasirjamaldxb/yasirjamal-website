import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function autoscaleTrimLogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'clean_monochrome_logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'balanced_logos');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));
  const logoMetadata = [];

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const imgBuf = fs.readFileSync(srcPath);
    const dataUrl = `data:image/png;base64,${imgBuf.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:0; background:transparent;">
          <img id="src" src="${dataUrl}" style="display:none;" />
          <canvas id="canvas"></canvas>
        </body>
      </html>
    `);

    const cropInfo = await page.evaluate(async () => {
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
      let hasPixels = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 15) { // non-transparent pixel
            hasPixels = true;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (!hasPixels) return null;

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      // Draw tightly cropped canvas
      const canvas = document.getElementById('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(rawCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

      return { cropW, cropH, aspectRatio: cropW / cropH };
    });

    if (!cropInfo) {
      console.warn('No non-transparent pixels found for:', file);
      continue;
    }

    const canvasEl = await page.$('#canvas');
    if (canvasEl) {
      const outPath = path.join(outDir, file);
      await canvasEl.screenshot({ path: outPath, omitBackground: true });
      
      const aspect = cropInfo.aspectRatio;
      let customClass = '';
      
      // Calculate balanced optical size based on logo aspect ratio
      if (aspect > 3.5) {
        // Super wide logo (e.g. Rocket Internet) -> height h-4 sm:h-5, max-w-[130px]
        customClass = 'h-4 sm:h-5 max-w-[130px]';
      } else if (aspect > 2.2) {
        // Wide logo (e.g. Westminster, Filatech) -> height h-5 sm:h-6, max-w-[120px]
        customClass = 'h-5 sm:h-6 max-w-[120px]';
      } else if (aspect > 1.4) {
        // Medium logo (e.g. Namshi, Property Finder) -> height h-6 sm:h-7.5, max-w-[110px]
        customClass = 'h-6 sm:h-7.5 max-w-[110px]';
      } else {
        // Square or vertical logo (e.g. Audi rings, WFP, Lootah) -> height h-8 sm:h-10, max-w-[90px]
        customClass = 'h-8 sm:h-10 max-w-[90px]';
      }

      logoMetadata.push({
        file,
        aspectRatio: aspect.toFixed(2),
        cropW: cropInfo.cropW,
        cropH: cropInfo.cropH,
        customClass
      });

      console.log(`Trimmed ${file} (W:${cropInfo.cropW} H:${cropInfo.cropH} Aspect:${aspect.toFixed(2)}) -> Class: ${customClass}`);
    }
  }

  fs.writeFileSync(path.join(outDir, 'metadata.json'), JSON.stringify(logoMetadata, null, 2));
  await browser.close();
}

autoscaleTrimLogos().catch(console.error);
