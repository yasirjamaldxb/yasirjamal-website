import puppeteer from 'puppeteer-core';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testRender() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:4321/#about', { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
  
  const aboutElem = await page.$('#about');
  if (aboutElem) {
    await aboutElem.screenshot({ path: 'scratch/about_section_preview.jpg' });
    console.log('✓ Captured scratch/about_section_preview.jpg');
  } else {
    console.log('Element #about not found');
  }

  await browser.close();
}

testRender().catch(console.error);
