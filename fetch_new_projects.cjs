const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  console.log("Launching browser to capture markwilliams.ae and fila-tech.store...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const targetDir = path.join(__dirname, 'public', 'images', 'portfolio');

  try {
    // 1. Mark Williams
    console.log("Navigating to https://markwilliams.ae...");
    const page1 = await context.newPage();
    await page1.goto('https://markwilliams.ae', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page1.waitForTimeout(3000);
    await page1.screenshot({ path: path.join(targetDir, 'markwilliams.jpg'), quality: 85, type: 'jpeg' });
    console.log("Captured markwilliams.jpg!");
    await page1.close();
  } catch(e) {
    console.error("Markwilliams error:", e.message);
  }

  try {
    // 2. FILA Tech Store
    console.log("Navigating to https://fila-tech.store...");
    const page2 = await context.newPage();
    await page2.goto('https://fila-tech.store', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page2.waitForTimeout(3000);
    await page2.screenshot({ path: path.join(targetDir, 'filatech.jpg'), quality: 85, type: 'jpeg' });
    console.log("Captured filatech.jpg!");
    await page2.close();
  } catch(e) {
    console.error("Fila tech error:", e.message);
  }

  await browser.close();
  console.log("Done capturing screenshot assets!");
}

capture();
