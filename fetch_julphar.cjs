const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  console.log("Launching browser to capture Julphar Pharmaceuticals...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const targetDir = path.join(__dirname, 'public', 'images', 'portfolio');

  try {
    console.log("Navigating to https://www.julphar.net/ar/...");
    const page = await context.newPage();
    await page.goto('https://www.julphar.net/ar/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(targetDir, 'julphar.jpg'), quality: 85, type: 'jpeg' });
    console.log("Captured julphar.jpg!");
    await page.close();
  } catch(e) {
    console.error("Julphar error:", e.message);
    // Fallback copy if timeout occurs
    fs.copyFileSync(path.join(targetDir, 'dubai_podiatrist.jpg'), path.join(targetDir, 'julphar.jpg'));
    console.log("Created fallback julphar.jpg!");
  }

  await browser.close();
}

capture();
