import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function processAll18Logos() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'balanced_logos');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const logoMasterList = [
    { src: 'Logo_Property_Finder.png', name: 'property_finder', alt: 'Property Finder', class: 'h-6 sm:h-7 max-w-[125px]' },
    { src: 'namshi-logo-vector.svg-.png', name: 'namshi', alt: 'Namshi', class: 'h-6 sm:h-7 max-w-[115px]' },
    { src: 'audi-logo_2016.svg', name: 'audi', alt: 'Audi', class: 'h-5.5 sm:h-6.5 max-w-[115px]' },
    { src: 'logo.png', name: 'mark_williams', alt: 'Mark Williams Executive Search', class: 'h-5.5 sm:h-6.5 max-w-[130px]' },
    { src: 'logo-color.svg', name: 'noor_abu_dhabi', alt: 'Noor Abu Dhabi', class: 'h-6 sm:h-7.5 max-w-[125px]' },
    { src: 'lootah-holding-new-logo-1-revised-removebg-preview.png', name: 'lootah_holding', alt: 'Lootah Holding', class: 'h-5 sm:h-6 max-w-[130px]' },
    { src: 'omnicom-logo.svg', name: 'omnicom', alt: 'Omnicom Media Group', class: 'h-4.5 sm:h-5.5 max-w-[130px]' },
    { src: 'Julphar_logo.jpg', name: 'julphar', alt: 'Julphar Gulf Pharmaceutical Industries', class: 'h-5.5 sm:h-6.5 max-w-[135px]' },
    { src: 'global-logo_white.svg', name: 'hunza_global', alt: 'Hunza Global Ventures', class: 'h-6 sm:h-7.5 max-w-[120px]' },
    { src: 'header-logo.svg', name: 'prime_middle_east', alt: 'Prime Middle East', class: 'h-6 sm:h-7.5 max-w-[120px]' },
    { src: 'logo-1.webp', name: 'al_omaids', alt: 'Al Omaids', class: 'h-6 sm:h-7.5 max-w-[120px]' },
    { src: 'pawsplanes_pr_logo.svg', name: 'paws_and_planes', alt: 'Paws & Planes UAE', class: 'h-5 sm:h-6 max-w-[130px]' },
    { src: 'wfp-logo-vertical-white-en.svg', name: 'wfp', alt: 'United Nations WFP', class: 'h-9 sm:h-11 max-w-[100px]' },
    { src: 'filatech-uae.svg', name: 'filatech', alt: 'Filatech UAE', class: 'h-6 sm:h-7 max-w-[130px]' },
    { src: 'rocket_internet.png', name: 'rocket_internet', alt: 'Rocket Internet', class: 'h-3.5 sm:h-4.5 max-w-[135px]' },
    { src: 'westminster-prperties.png', name: 'westminster', alt: 'Westminster Properties', class: 'h-6 sm:h-7 max-w-[135px]' },
    { src: 'uae-podiatry_logo.jpg', name: 'uae_podiatry', alt: 'UAE Podiatry', class: 'h-6 sm:h-7 max-w-[130px]' }
  ];

  for (const item of logoMasterList) {
    let srcPath = path.join(srcDir, item.src);
    if (!fs.existsSync(srcPath)) continue;

    const fileBuf = fs.readFileSync(srcPath);
    const ext = path.extname(item.src).toLowerCase();
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
    const dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

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

      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      const scale = Math.min(1.0, 600 / Math.max(origW, origH));
      const w = Math.round(origW * scale);
      const h = Math.round(origH * scale);

      const tempC = document.createElement('canvas');
      tempC.width = w;
      tempC.height = h;
      const tCtx = tempC.getContext('2d');
      tCtx.drawImage(img, 0, 0, w, h);

      const imgData = tCtx.getImageData(0, 0, w, h);
      const d = imgData.data;

      // First pass: identify non-white logo pixels
      let minX = w, minY = h, maxX = 0, maxY = 0;
      let count = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = d[i], g = d[i+1], b = d[i+2], a = d[i+3];
          const isWhiteBg = (r > 220 && g > 220 && b > 220) || a < 15;

          if (!isWhiteBg) {
            count++;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            d[i] = 15;
            d[i+1] = 23;
            d[i+2] = 42;
            d[i+3] = 255;
          } else {
            d[i+3] = 0;
          }
        }
      }

      // Second pass: if count is 0, it means logo is white text on transparent background (e.g. Westminster, WFP, Omnicom, Prime)
      if (count === 0) {
        // Re-read original
        tCtx.drawImage(img, 0, 0, w, h);
        const origImgData = tCtx.getImageData(0, 0, w, h);
        const od = origImgData.data;

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const a = od[i+3];

            if (a > 15) { // Any non-transparent pixel
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

    if (result.error) {
      console.error(`Error processing ${item.name}: ${result.error}`);
      continue;
    }

    const canvas = await page.$('#c');
    if (canvas) {
      const savePath = path.join(outDir, `${item.name}.png`);
      await canvas.screenshot({ path: savePath, omitBackground: true });
      console.log(`Generated ${item.name}.png (${item.alt}) -> W:${result.cropW} H:${result.cropH}`);
    }
  }

  await browser.close();
}

processAll18Logos().catch(console.error);
