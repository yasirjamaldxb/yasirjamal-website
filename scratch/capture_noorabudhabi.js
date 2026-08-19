import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function capture() {
  console.log('Launching browser to capture Noor Abu Dhabi...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--ignore-certificate-errors'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  );

  const targetUrl = 'https://noorabudhabi.ae/';
  console.log(`Navigating to ${targetUrl}...`);

  try {
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  // Inject CSS to unhide any lazy-loaded elements or CSS animations
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      img[loading="lazy"], img[data-src], img[data-lazy] {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Smoothly scroll down the entire page to trigger all IntersectionObservers and lazy loads
  console.log('Scrolling entire page to force full asset loading...');
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
          window.scrollTo(0, 0); // Scroll back to top
          resolve();
        }
      }, 150);
    });
  });

  // Wait 5 seconds after scrolling to ensure everything renders crisply
  console.log('Waiting for final visual stabilization...');
  await new Promise((r) => setTimeout(r, 5000));

  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      bodyWidth: document.body.scrollWidth
    };
  });

  console.log('Page ready:', pageInfo);

  const outputPath = path.resolve('public/images/portfolio/noor_abu_dhabi_full.jpg');
  console.log(`Capturing full page screenshot to ${outputPath}...`);

  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'jpeg',
    quality: 90
  });

  console.log('Screenshot captured successfully!');

  // Also capture a cover thumbnail
  const coverPath = path.resolve('public/images/portfolio/noorabudhabi.jpg');
  await page.screenshot({
    path: coverPath,
    clip: {
      x: 0,
      y: 0,
      width: 1440,
      height: 900
    },
    type: 'jpeg',
    quality: 90
  });
  console.log('Cover thumbnail captured successfully!');

  await browser.close();
}

capture().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
