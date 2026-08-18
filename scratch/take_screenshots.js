import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const targets = [
    {
      name: 'hunzaglobal',
      url: 'https://hunzaglobal.com',
      thumbOut: 'public/images/portfolio/hunzaglobal.jpg',
      fullOut: 'public/images/portfolio/hunzaglobal_full.jpg'
    },
    {
      name: 'paws_and_planes',
      url: 'https://pawsandplanes.ae/',
      thumbOut: 'public/images/p_paws_v2.jpg',
      fullOut: 'public/images/portfolio/paws_and_planes_full.jpg'
    }
  ];

  for (const t of targets) {
    console.log(`Navigating to ${t.url}...`);
    const page = await context.newPage();
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      console.log(`Loaded DOM for ${t.name}, waiting for networkidle and lazy images...`);
      await page.waitForTimeout(4000);

      // Auto-scroll through the entire page to trigger lazy loading of all images
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 150);
        });
      });

      // Wait 3 seconds at bottom for everything to render
      await page.waitForTimeout(3000);

      // Scroll back to top
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(2000);

      // 1. Take Hero / Thumbnail Screenshot (top viewport only)
      console.log(`Capturing thumbnail for ${t.name} -> ${t.thumbOut}`);
      await page.screenshot({ path: t.thumbOut, fullPage: false });

      // 2. Take Full Page Screenshot for detail page
      console.log(`Capturing full page for ${t.name} -> ${t.fullOut}`);
      await page.screenshot({ path: t.fullOut, fullPage: true });

      console.log(`Done for ${t.name}`);
    } catch (err) {
      console.error(`Error processing ${t.name}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

capture();
