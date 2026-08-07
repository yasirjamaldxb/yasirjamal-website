import { chromium } from 'playwright';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targets = [
  { url: 'https://alomaids.com', name: 'p_alomaids_mobile' },
  { url: 'https://hunzaglobal.com', name: 'p_hunza_mobile' },
  { url: 'https://noorabudhabi.ae', name: 'p_noor_mobile' },
  { url: 'https://pawsandplanes.ae/', name: 'p_paws_mobile' }
];

async function capture() {
  console.log("Launching Chromium browser for mobile screenshots (390x844)...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 780 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
  });

  const outputDir = path.join(__dirname, 'public/images');

  for (const t of targets) {
    try {
      console.log(`Opening mobile view for ${t.url}...`);
      const page = await context.newPage();
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(3000);
      const tempJpg = path.join(outputDir, `${t.name}_temp.jpg`);
      const finalWebp = path.join(outputDir, `${t.name}.webp`);

      await page.screenshot({ path: tempJpg, fullPage: false, type: 'jpeg', quality: 90 });
      console.log(`Captured mobile screenshot for ${t.url}`);

      // Compress with sharp to WebP
      await sharp(tempJpg)
        .resize({ width: 500, withoutEnlargement: true })
        .webp({ quality: 82, effort: 6 })
        .toFile(finalWebp);

      if (fs.existsSync(tempJpg)) fs.unlinkSync(tempJpg);
      console.log(`✓ Saved ${t.name}.webp successfully!`);
      await page.close();
    } catch (err) {
      console.error(`Error capturing mobile ${t.url}:`, err.message);
    }
  }

  await browser.close();
  console.log("Mobile screenshots capture completed!");
}

capture().catch(console.error);
