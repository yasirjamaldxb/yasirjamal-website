import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function debugAndFixAllLogos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'balanced_logos');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // List of all 14 distinct logos
  const logos = [
    { src: 'logo_property_finder.png', name: 'property_finder', targetH: 40 },
    { src: 'namshi-logo-vector.svg-.png', name: 'namshi', targetH: 40 },
    { src: 'audi-logo_2016.svg', name: 'audi', targetH: 36 },
    { src: 'lootah-holding-new-logo-1-revised-removebg-preview.png', name: 'lootah_holding', targetH: 36 },
    { src: 'omnicom-logo.svg', name: 'omnicom', targetH: 36 },
    { src: 'julphar_logo.jpg', name: 'julphar', targetH: 38 },
    { src: 'pawsplanes_pr_logo.svg', name: 'paws_and_planes', targetH: 36 },
    { src: 'wfp-logo-vertical-white-en.svg', name: 'wfp', targetH: 48 }, // Make UN WFP distinctly larger!
    { src: 'filatech-uae.svg', name: 'filatech', targetH: 38 },
    { src: 'rocket_internet.png', name: 'rocket_internet', targetH: 32 },
    { src: 'westminster-prperties.png', name: 'westminster', targetH: 38 }, // Fix Westminster!
    { src: 'uae-podiatry_logo.jpg', name: 'uae_podiatry', targetH: 36 },
    { src: 'global-logo_white.svg', name: 'global', targetH: 40 },
    { src: 'header-logo.svg', name: 'al_omaids', targetH: 40 }
  ];

  for (const item of logos) {
    const srcPath = path.join(srcDir, item.src);
    if (!fs.existsSync(srcPath)) {
      console.error('File not found:', srcPath);
      continue;
    }

    const fileBuf = fs.readFileSync(srcPath);
    const ext = path.extname(srcPath).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <body style="margin:0; padding:20px; background:white;">
          <img id="raw" src="${dataUrl}" style="display:block; max-height:200px;" />
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
      tCtx.drawImage(img, 0, 0);

      const imgData = tCtx.getImageData(0, 0, w, h);
      const d = imgData.data;

      // Find non-white non-transparent bounds
      let minX = w, minY = h, maxX = 0, maxY = 0;
      let count = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];

          // Check if pixel is part of logo (not white background and not transparent)
          const isWhite = (r > 220 && g > 220 && b > 220);
          if (a > 20 && !isWhite) {
            count++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      // If all pixels were light/white (e.g. white SVG on transparent background)
      if (count === 0) {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const a = d[i+3];
            if (a > 20) {
              count++;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
      }

      if (count === 0) return { error: 'No logo content found' };

      const cropW = maxX - minX + 1;
      const cropH = maxY - minY + 1;

      // Create high-res target canvas
      const c = document.getElementById('c');
      c.width = cropW;
      c.height = cropH;
      const ctx = c.getContext('2d');

      // Create black silhouette image data
      const croppedData = ctx.createImageData(cropW, cropH);
      const cd = croppedData.data;

      for (let cy = 0; cy < cropH; cy++) {
        for (let cx = 0; cx < cropW; cx++) {
          const ox = minX + cx;
          const oy = minY + cy;
          const oi = (oy * w + ox) * 4;
          const ci = (cy * cropW + cx) * 4;

          const r = d[oi], g = d[oi+1], b = d[oi+2], a = d[oi+3];
          const isWhite = (r > 225 && g > 225 && b > 225);

          if (a > 20 && !isWhite) {
            cd[ci] = 15;      // R: #0f
            cd[ci+1] = 23;    // G: #17
            cd[ci+2] = 42;    // B: #2a
            cd[ci+3] = a;     // Original Alpha
          } else {
            cd[ci+3] = 0;     // Transparent
          }
        }
      }

      ctx.putImageData(croppedData, 0, 0);

      return { cropW, cropH, count };
    });

    if (result.error) {
      console.error(`Error processing ${item.name}: ${result.error}`);
      continue;
    }

    const canvas = await page.$('#c');
    if (canvas) {
      const savePath = path.join(outDir, `${item.name}.png`);
      await canvas.screenshot({ path: savePath, omitBackground: true });
      console.log(`Saved ${item.name}.png (W: ${result.cropW}, H: ${result.cropH}, Pixels: ${result.count})`);
    }
  }

  await browser.close();
}

debugAndFixAllLogos().catch(console.error);
