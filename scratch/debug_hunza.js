import { chromium } from 'playwright';

async function testHunza() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  console.log('Navigating to https://hunzaglobal.com ...');
  
  await page.goto('https://hunzaglobal.com', { waitUntil: 'load', timeout: 60000 });
  console.log('Page loaded. Waiting 5s...');
  await page.waitForTimeout(5000);

  // Check page title and scrollHeight
  const info = await page.evaluate(() => {
    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      docHeight: document.documentElement.scrollHeight,
      imagesCount: document.images.length,
      imagesLoaded: Array.from(document.images).filter(img => img.complete && img.naturalHeight > 0).length
    };
  });
  console.log('Page info before scroll:', info);

  // Slowly scroll down step by step to trigger all animations / Elementor / lazyload
  console.log('Scrolling down slowly...');
  await page.evaluate(async () => {
    const totalHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    for (let y = 0; y <= totalHeight; y += 250) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 200));
    }
  });

  console.log('Reached bottom. Waiting 5s for lazy assets & animations...');
  await page.waitForTimeout(5000);

  const infoAfter = await page.evaluate(() => {
    return {
      scrollHeight: document.body.scrollHeight,
      docHeight: document.documentElement.scrollHeight,
      imagesCount: document.images.length,
      imagesLoaded: Array.from(document.images).filter(img => img.complete && img.naturalHeight > 0).length
    };
  });
  console.log('Page info after scroll:', infoAfter);

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);

  // Thumbnail (Hero only - 1440x900)
  console.log('Taking thumbnail...');
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal.jpg', fullPage: false });

  // Full page (entire document)
  console.log('Taking full page...');
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal_full.jpg', fullPage: true });

  await browser.close();
  console.log('Finished debug_hunza!');
}

testHunza().catch(console.error);
