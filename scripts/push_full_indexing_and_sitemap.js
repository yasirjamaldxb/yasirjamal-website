import { google } from 'googleapis';
import fs from 'fs';
import dns from 'dns';
import https from 'https';

dns.setDefaultResultOrder('ipv4first');

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: [
    'https://www.googleapis.com/auth/indexing',
    'https://www.googleapis.com/auth/webmasters'
  ]
});

const indexing = google.indexing({ version: 'v3', auth });
const searchconsole = google.searchconsole({ version: 'v1', auth });

const sitemapUrls = [
  "https://yasirjamal.com/",
  "https://yasirjamal.com/web-design-dubai/",
  "https://yasirjamal.com/about/",
  "https://yasirjamal.com/portfolio/",
  "https://yasirjamal.com/portfolio/julphar/",
  "https://yasirjamal.com/portfolio/westminster-properties/",
  "https://yasirjamal.com/portfolio/alston-clayden/",
  "https://yasirjamal.com/portfolio/skylynx/",
  "https://yasirjamal.com/portfolio/dubai-podiatrist/",
  "https://yasirjamal.com/portfolio/alomaids/",
  "https://yasirjamal.com/portfolio/abayadore/",
  "https://yasirjamal.com/portfolio/hunza-global/",
  "https://yasirjamal.com/portfolio/markwilliams/",
  "https://yasirjamal.com/portfolio/fila-tech/",
  "https://yasirjamal.com/portfolio/noor-abu-dhabi/",
  "https://yasirjamal.com/portfolio/paws-and-planes/",
  "https://yasirjamal.com/portfolio/baanpaa/",
  "https://yasirjamal.com/blog/",
  "https://yasirjamal.com/blog/answer-engine-optimization-aeo-chatgpt-search-dubai/",
  "https://yasirjamal.com/blog/what-is-webmcp-agentic-web-design-guide/",
  "https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/",
  "https://yasirjamal.com/blog/gohighlevel-for-real-estate-agents-review/",
  "https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/",
  "https://yasirjamal.com/blog/speed-up-gohighlevel-funnels-custom-css-guide/",
  "https://yasirjamal.com/blog/sub-second-ecommerce-architecture-gcc-scaling/",
  "https://yasirjamal.com/blog/astro-vs-wordpress-speed-performance-guide/",
  "https://yasirjamal.com/blog/conversion-rate-optimization-cro-lead-generation/",
  "https://yasirjamal.com/blog/dubai-technical-seo-audit-ranking-guide/",
  "https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/",
  "https://yasirjamal.com/blog/hiring-freelance-web-designer-vs-agency-dubai/",
  "https://yasirjamal.com/blog/modern-web-design-trends-2026/",
  "https://yasirjamal.com/blog/tmd-hosting-review/",
  "https://yasirjamal.com/design-system/",
  "https://yasirjamal.com/privacy-policy/",
  "https://yasirjamal.com/terms/"
];

async function runPush() {
  console.log('========================================================================');
  console.log('🚀 DISPATCHING GOOGLE INDEXING API & SITEMAP RE-SUBMISSION');
  console.log('========================================================================\n');

  // 1. Submit Sitemaps to GSC
  console.log('1️⃣ Submitting Sitemaps to Google Search Console...');
  try {
    await searchconsole.sitemaps.submit({
      siteUrl: 'sc-domain:yasirjamal.com',
      feedpath: 'https://yasirjamal.com/sitemap.xml'
    });
    console.log('   ✅ sitemap.xml submitted successfully');

    await searchconsole.sitemaps.submit({
      siteUrl: 'sc-domain:yasirjamal.com',
      feedpath: 'https://yasirjamal.com/sitemap-0.xml'
    });
    console.log('   ✅ sitemap-0.xml submitted successfully');
  } catch (err) {
    console.log('   ⚠️ Sitemap submission notice:', err.message);
  }

  // 2. Push Batch to Google Indexing API
  console.log('\n2️⃣ Pushing real-time URL_UPDATED notifications to Googlebot...');
  for (let i = 0; i < sitemapUrls.length; i++) {
    const url = sitemapUrls[i];
    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED'
        }
      });
      console.log(`   [${i + 1}/${sitemapUrls.length}] ✅ Googlebot Notified: ${url}`);
    } catch (err) {
      console.log(`   [${i + 1}/${sitemapUrls.length}] ⚠️ Notice for ${url}:`, err.message);
    }
  }

  // 3. IndexNow Global Ping
  console.log('\n3️⃣ Broadcasting to IndexNow Global Network (Bing, Copilot, ChatGPT)...');
  const indexNowPayload = JSON.stringify({
    host: 'yasirjamal.com',
    key: '64a78d2b9ef14c33842c9431e56b820a',
    keyLocation: 'https://yasirjamal.com/64a78d2b9ef14c33842c9431e56b820a.txt',
    urlList: sitemapUrls
  });

  const req = https.request({
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(indexNowPayload)
    }
  }, (res) => {
    console.log(`   ✅ IndexNow Status: ${res.statusCode} Accepted`);
    console.log('\n🎉 Real-time multi-engine indexing push complete!\n');
  });

  req.on('error', (err) => {
    console.log('   ⚠️ IndexNow notice:', err.message);
  });

  req.write(indexNowPayload);
  req.end();
}

runPush().catch(console.error);
