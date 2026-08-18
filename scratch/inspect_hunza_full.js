import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  console.log('Navigating to https://hunzaglobal.com ...');
  await page.goto('https://hunzaglobal.com', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const sections = await page.evaluate(() => {
    const textNodes = [];
    document.querySelectorAll('h1, h2, h3, header, footer').forEach(el => {
      textNodes.push({ tag: el.tagName, text: el.innerText.trim().slice(0, 80) });
    });
    return {
      scrollHeight: document.documentElement.scrollHeight,
      headings: textNodes,
      footerPresent: !!document.querySelector('footer')
    };
  });

  console.log('Page structure:', JSON.stringify(sections, null, 2));

  // Let's scroll all the way down slowly
  let y = 0;
  while (y < 20000) {
    y += 400;
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await page.waitForTimeout(200);
    const currH = await page.evaluate(() => document.documentElement.scrollHeight);
    if (y >= currH) {
      break;
    }
  }

  await page.waitForTimeout(4000);
  const finalH = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log('Final document scrollHeight after complete scroll:', finalH);

  // Take screenshot with fullPage
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal_full.jpg', fullPage: true });
  console.log('Saved hunzaglobal_full.jpg');

  // Also take top hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'public/images/portfolio/hunzaglobal.jpg', fullPage: false });
  console.log('Saved hunzaglobal.jpg');

  await browser.close();
}

check().catch(console.error);
