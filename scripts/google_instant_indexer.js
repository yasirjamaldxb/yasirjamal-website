import { google } from 'googleapis';
import fs from 'fs';

const targetUrls = [
  'https://yasirjamal.com/',
  'https://yasirjamal.com/about/',
  'https://yasirjamal.com/portfolio/',
  'https://yasirjamal.com/portfolio/julphar/',
  'https://yasirjamal.com/portfolio/abayadore/',
  'https://yasirjamal.com/portfolio/westminster-properties/',
  'https://yasirjamal.com/portfolio/markwilliams/',
  'https://yasirjamal.com/portfolio/noor-abu-dhabi/',
  'https://yasirjamal.com/blog/',
  'https://yasirjamal.com/blog/tmd-hosting-review/',
  'https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/',
  'https://yasirjamal.com/blog/speed-up-gohighlevel-funnels-custom-css-guide/',
  'https://yasirjamal.com/blog/astro-vs-wordpress-speed-performance-guide/',
  'https://yasirjamal.com/blog/hiring-freelance-web-designer-vs-agency-dubai/',
  'https://yasirjamal.com/blog/modern-web-design-trends-2026/',
  'https://yasirjamal.com/blog/conversion-rate-optimization-cro-lead-generation/',
  'https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/',
  'https://yasirjamal.com/blog/what-is-webmcp-agentic-web-design-guide/',
  'https://yasirjamal.com/blog/sub-second-ecommerce-architecture-gcc-scaling/',
  'https://yasirjamal.com/blog/dubai-technical-seo-audit-ranking-guide/',
  'https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/'
];

async function runGoogleIndexer() {
  console.log('========================================================');
  console.log('⚡ GOOGLE INSTANT INDEXING API (DIRECT CRAWLER PUSH)');
  console.log('========================================================\n');

  let authClient = null;

  // Use service account credentials or OAuth
  if (fs.existsSync('gsc_credentials.json')) {
    authClient = new google.auth.GoogleAuth({
      keyFile: 'gsc_credentials.json',
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
  }

  const indexing = google.indexing({ version: 'v3', auth: authClient });

  for (const url of targetUrls) {
    try {
      const response = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
      console.log(`✅ [200 OK] Published URL_UPDATED for: ${url}`);
      console.log(`   Notification Time: ${response.data.urlNotificationMetadata?.latestUpdate?.notifyTime || 'Just now'}`);
    } catch (e) {
      console.log(`⚠️ ${url} -> ${e.message}`);
    }
  }

  console.log('\n🎉 Google Indexing API execution finished!');
}

runGoogleIndexer().catch(console.error);
