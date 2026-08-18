import { chromium } from 'playwright';

async function capturePerfect() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // 2x Retina for crystal-clear text and visuals
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  console.log('Navigating to https://hunzaglobal.com ...');
  await page.goto('https://hunzaglobal.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Disable slider autoplays, fix slide 1 as active, remove any transition overlays
  await page.evaluate(() => {
    // If slick / swiper exists, pause it
    const videos = document.querySelectorAll('video');
    videos.forEach(v => { v.pause(); v.currentTime = 0; });

    // Ensure all images are eagerly loaded
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'eager';
      if (img.dataset && img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset && img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }
    });
  });

  // Slowly scroll all the way down
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= scrollHeight; y += 200) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(100);
  }

  await page.waitForTimeout(3000);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);

  // Capture hero thumbnail
  console.log('Capturing hero thumbnail...');
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal.jpg', fullPage: false });

  // Capture complete full page
  console.log('Capturing full page...');
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal_full.jpg', fullPage: true });

  await browser.close();
  console.log('Finished perfect capture!');
}

capturePerfect().catch(console.error);
