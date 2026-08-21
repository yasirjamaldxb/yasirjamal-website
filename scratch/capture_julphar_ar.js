import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureJulpharClean() {
  console.log('Launching Chrome to capture clean Julphar Arabic (https://www.julphar.net/ar/)...');
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

  // Helper function to thoroughly dismiss & remove all cookie banners, modals, popups, backdrops
  const removeAllPopupsAndCookies = async () => {
    return await page.evaluate(() => {
      // 1. Click all accept / close / dismiss buttons
      const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"], span[role="button"]'));
      buttons.forEach(b => {
        const text = (b.innerText || b.textContent || '').trim().toLowerCase();
        if (
          text.includes('accept') ||
          text.includes('agree') ||
          text.includes('ok') ||
          text.includes('got it') ||
          text.includes('i agree') ||
          text.includes('موافق') ||
          text.includes('قبول') ||
          text.includes('اوافق') ||
          text.includes('إغلاق') ||
          text.includes('close') ||
          text === '✕' ||
          text === '×'
        ) {
          try { b.click(); } catch(e) {}
        }
      });

      // 2. Selectively find and remove popup / cookie / modal DOM nodes
      const selectorsToRemove = [
        '#onetrust-consent-sdk',
        '#onetrust-banner-sdk',
        '.onetrust-pc-dark-filter',
        '.cookie-banner',
        '.cookie-notice',
        '.cookie-consent',
        '.cookie-law-info',
        '#cookie-law-info-bar',
        '.cc-banner',
        '.cc-window',
        '.cookie-alert',
        '#cookie-bar',
        '.modal-backdrop',
        '.modal',
        '.popup',
        '.popup-overlay',
        '.ui-dialog',
        '[class*="cookie"]',
        '[id*="cookie"]',
        '[class*="popup"]',
        '[id*="popup"]',
        '[class*="modal"]',
        '[id*="modal"]',
        '[class*="gdpr"]',
        '[id*="gdpr"]',
        '[class*="consent"]',
        '[id*="consent"]',
        '[aria-modal="true"]',
        '[role="dialog"]',
        '[role="alertdialog"]'
      ];

      selectorsToRemove.forEach(sel => {
        try {
          document.querySelectorAll(sel).forEach(el => {
            // Check if element is a fixed or absolute overlay/banner, or high z-index
            const style = window.getComputedStyle(el);
            if (
              style.position === 'fixed' || 
              style.position === 'sticky' || 
              style.position === 'absolute' || 
              parseInt(style.zIndex, 10) > 100
            ) {
              el.remove();
            }
          });
        } catch(e) {}
      });

      // 3. Remove any remaining fixed/floating bottom or top bars that contain typical cookie terms
      const allFixed = Array.from(document.querySelectorAll('*')).filter(el => {
        try {
          const style = window.getComputedStyle(el);
          return (style.position === 'fixed' || style.position === 'sticky') && parseInt(style.zIndex, 10) > 50;
        } catch(e) { return false; }
      });

      allFixed.forEach(el => {
        const text = (el.innerText || '').toLowerCase();
        if (
          text.includes('cookie') || 
          text.includes('cookies') || 
          text.includes('ملفات تعريف الارتباط') || 
          text.includes('سياسة الخصوصية') ||
          text.includes('privacy policy')
        ) {
          el.remove();
        }
      });

      // 4. Ensure body and html scrolling is completely unblocked
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.documentElement.classList.remove('modal-open', 'cookie-open', 'no-scroll');
      document.body.classList.remove('modal-open', 'cookie-open', 'no-scroll');
    });
  };

  console.log('Removing cookie notices, popups, and dialogs...');
  await removeAllPopupsAndCookies();

  // Inject CSS to unhide all lazy-loaded elements and stop endless transition delays
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
      #onetrust-consent-sdk, .cookie-banner, .cookie-notice, [class*="cookie"] {
        display: none !important;
        opacity: 0 !important;
        pointer-events: none !important;
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

  console.log('Waiting 60 seconds (1 minute) for all dynamic assets, Arabic typography, and imagery to fully settle...');
  await new Promise((r) => setTimeout(r, 60000));

  // Final cleanup pass to make sure no late-appearing popups exist
  console.log('Performing final popup and cookie banner cleanup pass...');
  await removeAllPopupsAndCookies();

  // Wait 2 seconds
  await new Promise((r) => setTimeout(r, 2000));

  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      scrollHeight: document.body.scrollHeight,
      bodyWidth: document.body.scrollWidth
    };
  });

  console.log('Page ready for clean screenshot:', pageInfo);

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

  console.log('✓ Successfully captured 100% clean Julphar Arabic full-page screenshot without popups/cookies!');
  await browser.close();
}

captureJulpharClean().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
