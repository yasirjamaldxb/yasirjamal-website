import { chromium } from 'playwright';

async function testMobile() {
  const browser = await chromium.launch({ headless: true });
  
  // Test iPhone 14 Viewport (390 x 844)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();
  console.log('Navigating to local preview or live about page on mobile...');
  await page.goto('https://yasirjamaldxb.github.io/yasirjamal-website/about/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);

  // Check for any horizontal overflow (elements wider than 390px causing side scroll)
  const overflowElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const overflowing = [];
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1 || rect.left < -1) {
        // Check if parent has overflow hidden
        let parent = el.parentElement;
        let isClipped = false;
        while (parent && parent !== document.body) {
          const style = window.getComputedStyle(parent);
          if (style.overflow === 'hidden' || style.overflowX === 'hidden') {
            isClipped = true;
            break;
          }
          parent = parent.parentElement;
        }
        if (!isClipped) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: el.className ? String(el.className).slice(0, 80) : '',
            right: rect.right,
            width: rect.width
          });
        }
      }
    });

    const bodyScrollWidth = document.body.scrollWidth;
    const docScrollWidth = document.documentElement.scrollWidth;

    return {
      docWidth,
      bodyScrollWidth,
      docScrollWidth,
      hasHorizontalScroll: bodyScrollWidth > docWidth || docScrollWidth > docWidth,
      overflowing: overflowing.slice(0, 10)
    };
  });

  console.log('Mobile Overflow Audit:', JSON.stringify(overflowElements, null, 2));

  // Take Mobile Full Page Screenshot
  console.log('Taking full page mobile screenshot...');
  await page.screenshot({ path: 'scratch/about_mobile_full.jpg', fullPage: true });

  // Take specific viewport screenshots of key sections:
  // 1. Hero
  await page.screenshot({ path: 'scratch/mobile_hero.jpg' });

  // 2. Who is Yasir Jamal
  await page.evaluate(() => {
    const el = document.getElementById('who-is-yasir-jamal');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/mobile_who_is_yasir.jpg' });

  // 3. Tech Stack / Tools
  await page.evaluate(() => {
    const el = document.getElementById('tech-stack');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/mobile_tools.jpg' });

  // 4. FAQ
  await page.evaluate(() => {
    const el = document.getElementById('faq');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scratch/mobile_faq.jpg' });

  await browser.close();
  console.log('Mobile tests completed successfully!');
}

testMobile().catch(console.error);
