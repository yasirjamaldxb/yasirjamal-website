const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function capture() {
  console.log("Launching browser to capture primemiddle-east, abayadore, and hunzaglobal...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  const targetDir = path.join(__dirname, 'public', 'images', 'portfolio');

  // 1. Prime Middle East
  try {
    console.log("Navigating to https://www.primemiddle-east.com/...");
    const page1 = await context.newPage();
    await page1.goto('https://www.primemiddle-east.com/', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page1.waitForTimeout(2500);
    await page1.screenshot({ path: path.join(targetDir, 'primemiddleeast.jpg'), quality: 85, type: 'jpeg' });
    console.log("Captured primemiddleeast.jpg!");
    await page1.close();
  } catch(e) {
    console.error("Prime Middle East error:", e.message);
  }

  // 2. Abaya Dore
  try {
    console.log("Navigating to http://abayadore.com/...");
    const page2 = await context.newPage();
    await page2.goto('http://abayadore.com/', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page2.waitForTimeout(2500);
    await page2.screenshot({ path: path.join(targetDir, 'abayadore.jpg'), quality: 85, type: 'jpeg' });
    console.log("Captured abayadore.jpg!");
    await page2.close();
  } catch(e) {
    console.error("Abaya Dore error:", e.message);
  }

  // 3. Hunza Global
  try {
    console.log("Navigating to https://hunzaglobal.com...");
    const page3 = await context.newPage();
    await page3.goto('https://hunzaglobal.com', { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page3.waitForTimeout(2500);
    await page3.screenshot({ path: path.join(targetDir, 'hunzaglobal.jpg'), quality: 85, type: 'jpeg' });
    console.log("Captured hunzaglobal.jpg!");
    await page3.close();
  } catch(e) {
    console.error("Hunza Global error:", e.message);
  }

  await browser.close();
  console.log("Done capturing all 3 screenshot assets!");
}

capture();
