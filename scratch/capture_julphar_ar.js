import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureJulpharArabic() {
  console.log('Launching Chrome to capture Julphar Arabic (https://www.julphar.net/ar/)...');
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
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  );

  const targetUrl = 'https://www.julphar.net/ar/';
  console.log(`Navigating to ${targetUrl}...`);

  try {
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 90000
    });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  // Dismiss cookies or overlays if any
  try {
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button, a'));
      const acceptBtn = buttons.find(b => 
        b.textContent.includes('Accept') || 
        b.textContent.includes('موافق') || 
        b.textContent.includes('قبول') ||
        b.id.includes('cookie') ||
        b.className.includes('cookie')
      );
      if (acceptBtn) acceptBtn.click();
    });
  } catch (err) {
    console.log('No cookie overlay found.');
  }

  // Inject CSS to ensure all Arabic RTL elements, fonts, and images render immediately
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
  console.log('Scrolling entire page to force full Arabic asset and image loading...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 350;
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

  console.log('Waiting 60 seconds (1 minute) for all dynamic assets, Arabic typography, and imagery to fully load and settle...');
  await new Promise((r) => setTimeout(r, 60000));

  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      bodyWidth: document.body.scrollWidth,
      dir: document.documentElement.dir || document.body.dir
    };
  });

  console.log('Page ready:', pageInfo);

  const outputPath = path.resolve('public/images/portfolio/julphar_ar_full.jpg');
  const mainPath = path.resolve('public/images/portfolio/julphar.jpg');
  
  console.log(`Capturing full page screenshot to ${outputPath} and ${mainPath}...`);

  await page.screenshot({
    path: outputPath,
    fullPage: true,
    type: 'jpeg',
    quality: 92
  });

  await page.screenshot({
    path: mainPath,
    fullPage: true,
    type: 'jpeg',
    quality: 92
  });

  console.log('✓ Successfully captured Julphar Arabic full-page screenshot after 1 minute full load!');
  await browser.close();
}

captureJulpharArabic().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
