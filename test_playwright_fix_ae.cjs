const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const targetDir = path.join(__dirname, 'public/images');

const targets = [
  { url: 'https://noorabudhabi.ae', dest: path.join(targetDir, 'p_noor_v2.jpg') },
  { url: 'https://pawsandplanes.ae/', dest: path.join(targetDir, 'p_paws_v2.jpg') }
];

async function capture() {
  console.log("Capturing Noor Abu Dhabi and Paws & Planes with domcontentloaded...");
  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  for (const t of targets) {
    console.log(`Navigating to ${t.url}...`);
    try {
      const page = await context.newPage();
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(4000);
      await page.screenshot({ path: t.dest, type: 'jpeg', quality: 85 });
      const stats = fs.statSync(t.dest);
      console.log(`Successfully saved ${t.dest} (${stats.size} bytes)`);
      await page.close();
    } catch (e) {
      console.error(`Error loading ${t.url}:`, e.message);
    }
  }

  await browser.close();
  console.log("AE domain captures complete!");
}

capture();
