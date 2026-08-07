const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const targetDir = path.join(__dirname, 'public/images');

const targets = [
  { url: 'https://hunzaglobal.com', dest: path.join(targetDir, 'p_hunza.jpg') },
  { url: 'https://alomaids.com', dest: path.join(targetDir, 'p_alomaids.jpg') },
  { url: 'https://noorabudhabi.ae', dest: path.join(targetDir, 'p_noor.jpg') },
  { url: 'https://pawsandplanes.ae/', dest: path.join(targetDir, 'p_paws.jpg') }
];

async function capture() {
  console.log("Launching Playwright Chromium...");
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    locale: 'en-US'
  });

  for (const t of targets) {
    console.log(`Navigating to ${t.url}...`);
    try {
      const page = await context.newPage();
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(4000);
      await page.screenshot({ path: t.dest, type: 'jpeg', quality: 85 });
      const stats = fs.statSync(t.dest);
      console.log(`Saved ${t.dest} (${stats.size} bytes)`);
      await page.close();
    } catch (e) {
      console.error(`Error loading ${t.url}:`, e.message);
    }
  }

  await browser.close();
  console.log("Playwright capture completed!");
}

capture();
