import { chromium } from 'playwright';
import fs from 'fs';

async function deepCapture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  console.log('Navigating to https://hunzaglobal.com ...');
  
  await page.goto('https://hunzaglobal.com', { waitUntil: 'networkidle', timeout: 60000 });
  
  console.log('Waiting 10 seconds for all transitions, preloaders, and sliders to finish...');
  await page.waitForTimeout(10000);

  // Inspect any loader or preloader elements, body overflow, and opacity
  const details = await page.evaluate(() => {
    // Remove any preloaders or overlays if present
    const loaders = document.querySelectorAll('.preloader, .loader, #preloader, #loader, .page-loader, .loading-screen, .site-loader');
    loaders.forEach(el => el.remove());

    // Make sure body and html have visible overflow and 100% opacity
    document.documentElement.style.overflow = 'visible';
    document.body.style.overflow = 'visible';
    document.documentElement.style.opacity = '1';
    document.body.style.opacity = '1';

    // Force all elements with opacity < 1 that might be stuck in animation to opacity 1
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.animationPlayState === 'paused') {
        el.style.animationPlayState = 'running';
      }
    });

    return {
      scrollHeight: document.body.scrollHeight,
      clientHeight: document.body.clientHeight,
      docScrollHeight: document.documentElement.scrollHeight,
      sections: document.querySelectorAll('section').length,
      divs: document.querySelectorAll('div').length
    };
  });

  console.log('DOM details after preloader removal:', details);

  // Slowly scroll down step by step and wait at each section
  for (let y = 0; y <= details.docScrollHeight; y += 300) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(250);
  }

  console.log('Scrolled to bottom. Waiting 6 seconds...');
  await page.waitForTimeout(6000);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(3000);

  // Capture Thumbnail (Hero)
  console.log('Capturing Hero thumbnail...');
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal.jpg', fullPage: false });

  // Capture Full Page
  console.log('Capturing Full page...');
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal_full.jpg', fullPage: true });

  await browser.close();
  console.log('Done deep capture!');
}

deepCapture().catch(console.error);
