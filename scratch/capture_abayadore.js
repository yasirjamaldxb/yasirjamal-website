import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureAbayadore() {
  console.log('Launching Chrome to capture clean Abaya Dore (https://abayadore.com/)...');
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

  const targetUrl = 'https://abayadore.com/';
  console.log(`Navigating to ${targetUrl}...`);

  try {
    await page.goto(targetUrl, {
      waitUntil: 'networkidle2',
      timeout: 90000
    });
  } catch (e) {
    console.log('Navigation warning:', e.message);
  }

  // Dismiss / close all popups, newsletter overlays, and cookie banners
  const removeAllPopups = async () => {
    return await page.evaluate(() => {
      // 1. Click close / accept / dismiss buttons
      const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"], span[role="button"], svg, [aria-label*="close" i], [aria-label*="Close" i]'));
      buttons.forEach(b => {
        const text = (b.innerText || b.textContent || b.getAttribute('aria-label') || '').trim().toLowerCase();
        if (
          text.includes('close') ||
          text.includes('dismiss') ||
          text.includes('no thanks') ||
          text.includes('not now') ||
          text.includes('accept') ||
          text.includes('agree') ||
          text.includes('got it') ||
          text === '✕' ||
          text === '×' ||
          text === 'x'
        ) {
          try { b.click(); } catch(e) {}
        }
      });

      // 2. Selectively find and remove popup / modal / newsletter / cookie overlay elements
      const selectorsToRemove = [
        '#onetrust-consent-sdk',
        '#onetrust-banner-sdk',
        '.onetrust-pc-dark-filter',
        '.cookie-banner',
        '.cookie-notice',
        '.cookie-consent',
        '.modal-backdrop',
        '.modal',
        '.popup',
        '.popup-overlay',
        '.newsletter-popup',
        '.newsletter-modal',
        '[class*="newsletter"]',
        '[id*="newsletter"]',
        '[class*="klaviyo"]',
        '[id*="klaviyo"]',
        '[class*="privy"]',
        '[id*="privy"]',
        '[class*="om-holder"]',
        '[class*="cookie"]',
        '[id*="cookie"]',
        '[class*="popup"]',
        '[id*="popup"]',
        '[class*="modal"]',
        '[id*="modal"]',
        '[aria-modal="true"]',
        '[role="dialog"]',
        '[role="alertdialog"]'
      ];

      selectorsToRemove.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => {
            const style = window.getComputedStyle(el);
            if (
              style.position === 'fixed' || 
              style.position === 'sticky' || 
              style.position === 'absolute' || 
              parseInt(style.zIndex, 10) > 50
            ) {
              el.remove();
            }
          });
        } catch(e) {}
      });

      // 3. Ensure body and html scrolling is completely enabled
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.documentElement.classList.remove('modal-open', 'cookie-open', 'no-scroll');
      document.body.classList.remove('modal-open', 'cookie-open', 'no-scroll');
    });
  };

  console.log('Removing initial popups and overlays...');
  await removeAllPopups();

  // Inject CSS to unhide all lazy-loaded images and disable transition pauses
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      img[loading="lazy"], img[data-src], img[data-lazy], img[data-srcset] {
        opacity: 1 !important;
        visibility: visible !important;
      }
      [class*="klaviyo"], [id*="klaviyo"], .newsletter-popup, [class*="popup"], [class*="cookie"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  });

  // Smoothly scroll down the entire page to trigger all lazy-loaded lookbook images
  console.log('Scrolling entire page to force full image and lookbook loading...');
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
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

  console.log('Waiting 30 seconds for all images, typography, and lookbooks to fully render...');
  await new Promise((r) => setTimeout(r, 30000));

  // Secondary cleanup pass right before screenshot
  console.log('Performing final popup and modal cleanup pass...');
  await removeAllPopups();
  await new Promise((r) => setTimeout(r, 2000));

  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      bodyWidth: document.body.scrollWidth
    };
  });

  console.log('Abaya Dore page ready for clean screenshot:', pageInfo);

  const outputPath = path.resolve('public/images/portfolio/abayadore_full.jpg');
  const mainPath = path.resolve('public/images/portfolio/abayadore.jpg');
  
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

  console.log('✓ Successfully captured 100% clean Abaya Dore full-page screenshot!');
  await browser.close();
}

captureAbayadore().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
