import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runLighthouseAudit(url = 'https://yasirjamal.com/', isMobile = true) {
  console.log(`\n🚀 Launching Google Lighthouse Engine for: ${url} (${isMobile ? 'MOBILE' : 'DESKTOP'})...\n`);
  
  let chrome;
  try {
    chrome = await chromeLauncher.launch({ 
      chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
    });

    const flags = {
      logLevel: 'error',
      output: 'json',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: chrome.port,
      formFactor: isMobile ? 'mobile' : 'desktop',
      screenEmulation: isMobile ? { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false } : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      throttlingMethod: isMobile ? 'simulate' : 'provided'
    };

    const runnerResult = await lighthouse(url, flags);
    const categories = runnerResult.lhr.categories;
    const audits = runnerResult.lhr.audits;

    console.log('====================================================');
    console.log(`📊 Google Lighthouse Audit Result: ${url} (${isMobile ? 'MOBILE' : 'DESKTOP'})`);
    console.log('====================================================');
    console.log(`🚀 Performance:    ${Math.round((categories.performance?.score || 0) * 100)} / 100`);
    console.log(`♿ Accessibility:  ${Math.round((categories.accessibility?.score || 0) * 100)} / 100`);
    console.log(`🛡️ Best Practices: ${Math.round((categories['best-practices']?.score || 0) * 100)} / 100`);
    console.log(`🔍 SEO:            ${Math.round((categories.seo?.score || 0) * 100)} / 100`);
    console.log('----------------------------------------------------');
    console.log('⏱️ Core Web Vitals & Real Performance Metrics:');
    console.log(`   - First Contentful Paint (FCP):  ${audits['first-contentful-paint']?.displayValue || 'N/A'}`);
    console.log(`   - Largest Contentful Paint (LCP):  ${audits['largest-contentful-paint']?.displayValue || 'N/A'}`);
    console.log(`   - Total Blocking Time (TBT):       ${audits['total-blocking-time']?.displayValue || 'N/A'}`);
    console.log(`   - Cumulative Layout Shift (CLS):   ${audits['cumulative-layout-shift']?.displayValue || 'N/A'}`);
    console.log(`   - Speed Index:                     ${audits['speed-index']?.displayValue || 'N/A'}`);
    console.log('====================================================\n');
  } catch (err) {
    console.error('Audit error:', err.message);
  } finally {
    if (chrome) {
      try {
        await chrome.kill();
      } catch (e) {}
    }
  }
}

const targetUrl = process.argv[2] || 'https://yasirjamal.com/';
const mode = process.argv[3] || 'mobile';

runLighthouseAudit(targetUrl, mode === 'mobile').catch(console.error);
