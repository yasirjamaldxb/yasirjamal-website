import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  console.log('Navigating to https://baanpaa.com/...');
  await page.goto('https://baanpaa.com/', { waitUntil: 'networkidle0', timeout: 60000 });

  console.log('Scrolling page to force all lazy load assets to render...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 250;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });

  console.log('Waiting 5 seconds for complete render stabilization...');
  await new Promise((r) => setTimeout(r, 5000));

  const outputDir = path.resolve('public/images/portfolio');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Full Page Screenshot
  console.log('Capturing full page screenshot...');
  const fullPagePath = path.join(outputDir, 'baanpaa_full.jpg');
  await page.screenshot({ path: fullPagePath, fullPage: true, type: 'jpeg', quality: 90 });

  // 2. Cover / Hero Top Viewport
  console.log('Capturing top hero viewport...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 1000));
  const coverPath = path.join(outputDir, 'baanpaa.jpg');
  await page.screenshot({ path: coverPath, type: 'jpeg', quality: 92 });

  // 3. Scroll to Middle Section (Services / Special Balcony Features)
  console.log('Capturing middle section...');
  await page.evaluate(() => window.scrollTo(0, 850));
  await new Promise((r) => setTimeout(r, 1000));
  const middlePath = path.join(outputDir, 'baanpaa-2.jpg');
  await page.screenshot({ path: middlePath, type: 'jpeg', quality: 92 });

  // 4. Scroll to Bottom Section (Jungle Ready CTA / Customer Reviews)
  console.log('Capturing lower section...');
  await page.evaluate(() => window.scrollTo(0, 1750));
  await new Promise((r) => setTimeout(r, 1000));
  const lowerPath = path.join(outputDir, 'baanpaa-3.jpg');
  await page.screenshot({ path: lowerPath, type: 'jpeg', quality: 92 });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

capture().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
