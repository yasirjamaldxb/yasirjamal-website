import https from 'https';

const url = process.argv[2] || 'https://yasirjamal.com/';
const strategy = process.argv[3] || 'mobile'; // 'mobile' or 'desktop'

console.log(`\n🔍 Querying Google PageSpeed Insights API for: ${url} (${strategy.toUpperCase()})...\n`);

const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;

https.get(apiUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.error('❌ Google PageSpeed API Error:', json.error.message);
        return;
      }

      const categories = json.lighthouseResult.categories;
      const audits = json.lighthouseResult.audits;

      console.log('====================================================');
      console.log(`📊 Google PageSpeed Insights Report (${strategy.toUpperCase()}): ${url}`);
      console.log('====================================================');
      console.log(`🚀 Performance:    ${Math.round(categories.performance.score * 100)} / 100`);
      console.log(`♿ Accessibility:  ${Math.round(categories.accessibility.score * 100)} / 100`);
      console.log(`🛡️ Best Practices: ${Math.round(categories['best-practices'].score * 100)} / 100`);
      console.log(`🔍 SEO:            ${Math.round(categories.seo.score * 100)} / 100`);
      console.log('----------------------------------------------------');
      console.log('⏱️ Core Web Vitals & Speed Metrics:');
      console.log(`   - First Contentful Paint (FCP):  ${audits['first-contentful-paint']?.displayValue}`);
      console.log(`   - Largest Contentful Paint (LCP):  ${audits['largest-contentful-paint']?.displayValue}`);
      console.log(`   - Total Blocking Time (TBT):       ${audits['total-blocking-time']?.displayValue}`);
      console.log(`   - Cumulative Layout Shift (CLS):   ${audits['cumulative-layout-shift']?.displayValue}`);
      console.log(`   - Speed Index:                     ${audits['speed-index']?.displayValue}`);
      console.log('====================================================\n');

    } catch (err) {
      console.error('Failed to parse API response:', err.message);
    }
  });
}).on('error', (err) => {
  console.error('Request failed:', err.message);
});
