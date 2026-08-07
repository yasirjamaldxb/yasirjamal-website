const https = require('https');

const baseUrl = 'https://lawngreen-toad-836930.hostingersite.com';

const routesToTest = [
  '/',
  '/about/',
  '/portfolio/',
  '/portfolio/alston-clayden/',
  '/portfolio/alomaids/',
  '/portfolio/westminster-properties/',
  '/portfolio/skylynx/',
  '/portfolio/dubai-podiatrist/',
  '/portfolio/noor-abu-dhabi/',
  '/portfolio/paws-and-planes/',
  '/web-design-dubai/',
  '/ecommerce-web-design-dubai/',
  '/mobile-app-development/',
  '/blog/',
  '/blog/generative-engine-optimization-geo-ai-search/',
  '/blog/modern-web-design-trends-2026/',
  '/blog/astro-vs-wordpress-speed-performance-guide/',
  '/blog/dubai-technical-seo-audit-ranking-guide/',
  '/blog/conversion-rate-optimization-cro-lead-generation/',
  '/blog/sub-second-ecommerce-architecture-gcc-scaling/',
  '/blog/hiring-freelance-web-designer-vs-agency-dubai/',
  '/quote/',
  '/privacy-policy/',
  '/terms/',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/llms-full.txt'
];

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message, body: '' });
    });
  });
}

async function runScan() {
  console.log('🔍 STARTING COMPREHENSIVE PRE-LAUNCH SCAN FOR YASIRJAMAL.COM...\n');
  const results = [];
  let passedCount = 0;
  let issueCount = 0;

  for (const route of routesToTest) {
    const fullUrl = baseUrl + route;
    const res = await fetchUrl(fullUrl);
    
    const is200 = res.status === 200;
    const titleMatch = res.body.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'N/A';
    const hasMetaDesc = /<meta\s+name=["']description["']/i.test(res.body);
    const hasSchema = /<script\s+type=["']application\/ld\+json["']/i.test(res.body);

    const issues = [];
    if (!is200) issues.push(`HTTP Status ${res.status}`);
    if (res.body.includes('Neil Patel')) issues.push('Contains Neil Patel reference');
    if (route === '/privacy-policy/' && res.body.toLowerCase().includes('uae law')) issues.push('Privacy policy mentions UAE law');
    if (route === '/terms/' && res.body.toLowerCase().includes('uae law')) issues.push('Terms mentions UAE law');

    if (is200 && issues.length === 0) {
      passedCount++;
      console.log(`✅ [200 OK] ${route.padEnd(55)} | Title: "${title.slice(0, 45)}..." | Meta: ${hasMetaDesc ? 'YES' : 'NO'} | Schema: ${hasSchema ? 'YES' : 'NO'}`);
    } else {
      issueCount++;
      console.log(`❌ [ISSUE]  ${route.padEnd(55)} | Issues: ${issues.join(', ')}`);
    }
  }

  console.log(`\n==================================================`);
  console.log(`📊 PRE-LAUNCH SCAN AUDIT SUMMARY:`);
  console.log(`Total Routes Scanned: ${routesToTest.length}`);
  console.log(`Passed Routes (200 OK & 0 Directives Broken): ${passedCount}`);
  console.log(`Issues Found: ${issueCount}`);
  console.log(`==================================================\n`);
}

runScan();
