import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  console.log('Launching browser in full desktop window...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--window-size=1920,1080',
      '--disable-features=IsolateOrigins,site-per-process'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960, deviceScaleFactor: 2 });

  // Emulate realistic User Agent
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  );

  console.log('Navigating to https://baanpaa.com/ ...');
  await page.goto('https://baanpaa.com/', {
    waitUntil: 'networkidle2',
    timeout: 90000
  });

  console.log('Injecting CSS to eliminate any lazy-load hiding restrictions...');
  await page.evaluate(() => {
    // 1. Remove lazyload CSS restrictions
    const style = document.createElement('style');
    style.innerHTML = `
      *, *:before, *:after {
        animation: none !important;
        transition: none !important;
      }
      .e-con.e-parent, .e-con.e-parent * {
        background-image: inherit !important;
      }
      [data-lazyloaded="0"], .e-lazyloaded {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);

    // 2. Add e-lazyloaded to all containers
    document.querySelectorAll('.e-con').forEach((el) => {
      el.classList.add('e-lazyloaded');
      el.classList.add('e-no-lazyload');
    });

    // 3. Trigger all lazyloaded images
    document.querySelectorAll('img').forEach((img) => {
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.loading = 'eager';
      img.decoding = 'sync';
    });
  });

  console.log('Performing step-by-step human scroll down...');
  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  console.log(`Document total height: ${totalHeight}px`);

  for (let y = 0; y <= totalHeight; y += 300) {
    await page.evaluate((pos) => window.scrollTo(0, pos), y);
    await new Promise((r) => setTimeout(r, 200));
  }

  // Scroll back to top
  await page.evaluate(() => window.scrollTo(0, 0));

  console.log('Waiting 8 seconds for all fonts, CSS backgrounds, and images to settle...');
  await page.evaluate(async () => {
    // Wait for fonts
    await document.fonts.ready;

    // Preload & verify all image elements
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    );
  });

  await new Promise((r) => setTimeout(r, 6000));

  const outputDir = path.resolve('public/images/portfolio');

  console.log('Taking full page screenshot...');
  await page.screenshot({
    path: path.join(outputDir, 'baanpaa_full.jpg'),
    fullPage: true,
    type: 'jpeg',
    quality: 94
  });

  console.log('Taking top hero viewport screenshot...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, 'baanpaa.jpg'),
    type: 'jpeg',
    quality: 94
  });

  console.log('Taking middle section screenshot...');
  await page.evaluate(() => window.scrollTo(0, 800));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, 'baanpaa-2.jpg'),
    type: 'jpeg',
    quality: 94
  });

  console.log('Taking lower section screenshot...');
  await page.evaluate(() => window.scrollTo(0, 1650));
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: path.join(outputDir, 'baanpaa-3.jpg'),
    type: 'jpeg',
    quality: 94
  });

  console.log('Successfully completed advanced capture!');
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
