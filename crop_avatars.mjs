import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  
  const imgPath = 'C:\\Users\\nadvi\\.gemini\\antigravity\\brain\\bf08bde9-80ed-4948-b009-62bccd96f73e\\.user_uploaded\\media__1785412181912.png';
  const imgData = fs.readFileSync(imgPath).toString('base64');
  const dataUrl = `data:image/png;base64,${imgData}`;

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background:#fff;">
        <img id="screenshot" src="${dataUrl}" style="display:block;" />
      </body>
    </html>
  `);

  await page.waitForSelector('#screenshot');

  const outputDir = path.join(process.cwd(), 'public', 'images', 'testimonials');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Exact cropped regions for avatars from the 1000px high screenshot
  const avatars = [
    { name: 'marion_ravel.png', y: 138 },
    { name: 'aasim_mohamed.png', y: 254 },
    { name: 'dana_achkar.png', y: 362 },
    { name: 'shahid_khan.png', y: 440 },
    { name: 'sufyan_khan.png', y: 526 },
    { name: 'sameer_ahmed.png', y: 634 },
    { name: 'finny_balla.png', y: 762 }
  ];

  for (const item of avatars) {
    const clip = {
      x: 184,
      y: item.y,
      width: 28,
      height: 28
    };
    const savePath = path.join(outputDir, item.name);
    await page.screenshot({
      path: savePath,
      clip
    });
    console.log(`Saved ${item.name} to ${savePath}`);
  }

  await browser.close();
}

main().catch(console.error);
