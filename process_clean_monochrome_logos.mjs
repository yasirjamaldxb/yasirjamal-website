import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function processLogosClean() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const srcDir = path.join(process.cwd(), 'public', 'images', 'logos');
  const outDir = path.join(process.cwd(), 'public', 'images', 'clean_monochrome_logos');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const logoFiles = [
    { filename: 'logo_property_finder.png', name: 'property_finder' },
    { filename: 'namshi-logo-vector.svg-.png', name: 'namshi' },
    { filename: 'audi-logo_2016.svg', name: 'audi' },
    { filename: 'lootah-holding-new-logo-1-revised-removebg-preview.png', name: 'lootah_holding' },
    { filename: 'omnicom-logo.svg', name: 'omnicom' },
    { filename: 'julphar_logo.jpg', name: 'julphar' },
    { filename: 'pawsplanes_pr_logo.svg', name: 'paws_and_planes' },
    { filename: 'wfp-logo-vertical-white-en.svg', name: 'wfp' },
    { filename: 'filatech-uae.svg', name: 'filatech' },
    { filename: 'rocket_internet.png', name: 'rocket_internet' },
    { filename: 'westminster-prperties.png', name: 'westminster' },
    { filename: 'uae-podiatry_logo.jpg', name: 'uae_podiatry' },
    { filename: 'global-logo_white.svg', name: 'global' },
    { filename: 'header-logo.svg', name: 'al_omaids' }
  ];

  for (const item of logoFiles) {
    const srcPath = path.join(srcDir, item.filename);
    if (!fs.existsSync(srcPath)) continue;

    let mime = item.filename.endsWith('.svg') ? 'image/svg+xml' : item.filename.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    let dataUrl;

    if (item.filename.endsWith('.svg')) {
      let content = fs.readFileSync(srcPath, 'utf8');
      // If SVG has white fill or stroke, change to solid dark slate #0f172a / black
      content = content
        .replace(/fill=["']#(?:fff|ffffff)["']/gi, 'fill="#0f172a"')
        .replace(/fill=["']white["']/gi, 'fill="#0f172a"')
        .replace(/stroke=["']#(?:fff|ffffff)["']/gi, 'stroke="#0f172a"')
        .replace(/stroke=["']white["']/gi, 'stroke="#0f172a"');
      
      // If fill is omitted or currentColor, ensure fill="#0f172a"
      dataUrl = `data:image/svg+xml;base64,${Buffer.from(content).toString('base64')}`;

      await page.setContent(`
        <!DOCTYPE html>
        <html>
          <body style="margin:0; padding:10px; background:transparent;">
            <div id="target" style="display:inline-block;">
              <img id="img" src="${dataUrl}" style="height:48px; width:auto; max-width:200px; display:block; filter: brightness(0);" />
            </div>
          </body>
        </html>
      `);

      const target = await page.$('#target');
      if (target) {
        await target.screenshot({ path: path.join(outDir, `${item.name}.png`), omitBackground: true });
        console.log(`Saved transparent monochrome SVG logo: ${item.name}.png`);
      }
    } else {
      // JPG / PNG: threshold canvas pixels
      const fileBuf = fs.readFileSync(srcPath);
      dataUrl = `data:${mime};base64,${fileBuf.toString('base64')}`;

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

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;

        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // If background is white (r>230, g>230, b>230) or transparent (a<20), make transparent
          if (a < 20 || (r > 230 && g > 230 && b > 230)) {
            data[i + 3] = 0;
          } else {
            // Turn logo artwork pixels into solid dark slate #0f172a with preserved alpha
            data[i] = 15;      // R (#0f)
            data[i + 1] = 23;  // G (#17)
            data[i + 2] = 42;  // B (#2a)
          }
        }

        ctx.putImageData(imageData, 0, 0);
      });

      const canvasEl = await page.$('#canvas');
      if (canvasEl) {
        await canvasEl.screenshot({ path: path.join(outDir, `${item.name}.png`), omitBackground: true });
        console.log(`Saved transparent monochrome bitmap logo: ${item.name}.png`);
      }
    }
  }

  await browser.close();
}

processLogosClean().catch(console.error);
