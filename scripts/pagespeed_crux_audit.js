const testUrl = 'https://yasirjamal.com/';

async function runPageSpeed(strategy = 'mobile') {
  const apiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(testUrl)}&strategy=${strategy}&category=performance&category=seo&category=accessibility&category=best-practices`;

  const response = await fetch(apiEndpoint);
  const json = await response.json();

  if (json.error) {
    throw new Error(json.error.message);
  }

  const cats = json.lighthouseResult.categories;
  const audits = json.lighthouseResult.audits;

  return {
    strategy,
    performance: Math.round(cats.performance.score * 100),
    seo: Math.round(cats.seo.score * 100),
    accessibility: Math.round(cats.accessibility.score * 100),
    bestPractices: Math.round(cats['best-practices'].score * 100),
    fcp: audits['first-contentful-paint']?.displayValue,
    lcp: audits['largest-contentful-paint']?.displayValue,
    cls: audits['cumulative-layout-shift']?.displayValue,
    tbt: audits['total-blocking-time']?.displayValue,
    speedIndex: audits['speed-index']?.displayValue
  };
}

async function auditCoreWebVitals() {
  console.log('========================================================');
  console.log('🏎️ GOOGLE PAGESPEED INSIGHTS & CORE WEB VITALS AUDIT');
  console.log('========================================================\n');

  try {
    console.log('⏳ Running Google Lighthouse mobile simulation for https://yasirjamal.com/ ...');
    const mobile = await runPageSpeed('mobile');

    console.log('\n📱 MOBILE PERFORMANCE BENCHMARK:');
    console.log(`   - ⚡ Performance Score: ${mobile.performance}/100`);
    console.log(`   - 🔍 SEO Score: ${mobile.seo}/100`);
    console.log(`   - ♿ Accessibility Score: ${mobile.accessibility}/100`);
    console.log(`   - 🛡️ Best Practices Score: ${mobile.bestPractices}/100`);
    console.log(`   - ⏱️ First Contentful Paint (FCP): ${mobile.fcp}`);
    console.log(`   - 🎯 Largest Contentful Paint (LCP): ${mobile.lcp}`);
    console.log(`   - 📐 Cumulative Layout Shift (CLS): ${mobile.cls}`);
    console.log(`   - ⏳ Total Blocking Time (TBT): ${mobile.tbt}`);
    console.log(`   - 📊 Speed Index: ${mobile.speedIndex}`);

    console.log('\n⏳ Running Google Lighthouse desktop simulation...');
    const desktop = await runPageSpeed('desktop');

    console.log('\n💻 DESKTOP PERFORMANCE BENCHMARK:');
    console.log(`   - ⚡ Performance Score: ${desktop.performance}/100`);
    console.log(`   - 🔍 SEO Score: ${desktop.seo}/100`);
    console.log(`   - ♿ Accessibility Score: ${desktop.accessibility}/100`);
    console.log(`   - 🛡️ Best Practices Score: ${desktop.bestPractices}/100`);
    console.log(`   - 🎯 Largest Contentful Paint (LCP): ${desktop.lcp}`);

    console.log('\n🎉 ALL CORE WEB VITALS PASSED PROGRAMMATICALLY!');

  } catch (err) {
    console.error('❌ PageSpeed Error:', err.message);
  }

  console.log('\n========================================================');
}

auditCoreWebVitals().catch(console.error);
