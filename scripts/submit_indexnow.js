import https from 'https';

const indexNowKey = '64a78d2b9ef14c33842c9431e56b820a';
const host = 'yasirjamal.com';
const keyLocation = `https://${host}/${indexNowKey}.txt`;

const urlList = [
  'https://yasirjamal.com/',
  'https://yasirjamal.com/about/',
  'https://yasirjamal.com/portfolio/',
  'https://yasirjamal.com/portfolio/julphar/',
  'https://yasirjamal.com/portfolio/abayadore/',
  'https://yasirjamal.com/portfolio/hunza-global/',
  'https://yasirjamal.com/portfolio/markwilliams/',
  'https://yasirjamal.com/portfolio/fila-tech/',
  'https://yasirjamal.com/portfolio/alston-clayden/',
  'https://yasirjamal.com/portfolio/alomaids/',
  'https://yasirjamal.com/portfolio/westminster-properties/',
  'https://yasirjamal.com/portfolio/skylynx/',
  'https://yasirjamal.com/portfolio/dubai-podiatrist/',
  'https://yasirjamal.com/portfolio/noor-abu-dhabi/',
  'https://yasirjamal.com/portfolio/paws-and-planes/',
  'https://yasirjamal.com/portfolio/baanpaa/',
  'https://yasirjamal.com/blog/',
  'https://yasirjamal.com/blog/what-is-webmcp-agentic-web-design-guide/',
  'https://yasirjamal.com/blog/gohighlevel-for-real-estate-agents-review/',
  'https://yasirjamal.com/blog/tmd-hosting-review/',
  'https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/',
  'https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/',
  'https://yasirjamal.com/blog/speed-up-gohighlevel-funnels-custom-css-guide/',
  'https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/',
  'https://yasirjamal.com/blog/astro-vs-wordpress-speed-performance-guide/',
  'https://yasirjamal.com/blog/hiring-freelance-web-designer-vs-agency-dubai/',
  'https://yasirjamal.com/blog/modern-web-design-trends-2026/',
  'https://yasirjamal.com/blog/sub-second-ecommerce-architecture-gcc-scaling/',
  'https://yasirjamal.com/blog/dubai-technical-seo-audit-ranking-guide/',
  'https://yasirjamal.com/blog/conversion-rate-optimization-cro-lead-generation/',
  'https://yasirjamal.com/privacy-policy/',
  'https://yasirjamal.com/terms/'
];

async function submitIndexNow() {
  console.log('========================================================');
  console.log('🚀 SUBMITTING ALL 34 PAGES TO INDEXNOW (BING / COPILOT / CHATGPT)');
  console.log('========================================================\n');

  const payload = JSON.stringify({
    host: host,
    key: indexNowKey,
    keyLocation: keyLocation,
    urlList: urlList
  });

  const endpoints = [
    { host: 'api.indexnow.org', path: '/indexnow' },
    { host: 'www.bing.com', path: '/indexnow' }
  ];

  for (const ep of endpoints) {
    await new Promise((resolve) => {
      const req = https.request({
        hostname: ep.host,
        path: ep.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 202) {
            console.log(`✅ [${ep.host}] Successfully submitted ${urlList.length} URLs (Status: ${res.statusCode} Accepted)`);
          } else {
            console.log(`⚠️ [${ep.host}] Response ${res.statusCode}: ${body}`);
          }
          resolve();
        });
      });

      req.on('error', (err) => {
        console.error(`❌ [${ep.host}] Request failed: ${err.message}`);
        resolve();
      });

      req.write(payload);
      req.end();
    });
  }

  console.log('\n🎉 IndexNow submission completed! Search engines notified instantly.');
}

submitIndexNow().catch(console.error);
