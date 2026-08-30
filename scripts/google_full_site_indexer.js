import { google } from 'googleapis';
import fs from 'fs';

const allUrls = [
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

async function indexAllPages() {
  console.log('========================================================');
  console.log('⚡ DISPATCHING GOOGLEBOT TO ALL 32 PRODUCTION URLS');
  console.log('========================================================\n');

  const authClient = new google.auth.GoogleAuth({
    keyFile: 'gsc_credentials.json',
    scopes: ['https://www.googleapis.com/auth/indexing']
  });

  const indexing = google.indexing({ version: 'v3', auth: authClient });

  let successCount = 0;
  for (const url of allUrls) {
    try {
      await indexing.urlNotifications.publish({
        requestBody: { url, type: 'URL_UPDATED' }
      });
      console.log(`✅ [200 OK] Googlebot Notified: ${url}`);
      successCount++;
    } catch (e) {
      console.log(`⚠️ ${url}: ${e.message}`);
    }
  }

  console.log(`\n🎉 Success! Dispatched Googlebot to ${successCount}/${allUrls.length} pages in real-time.`);
}

indexAllPages().catch(console.error);
