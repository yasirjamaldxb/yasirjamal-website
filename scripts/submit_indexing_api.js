import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/indexing']
});

const indexing = google.indexing({ version: 'v3', auth });

const urlsToPing = [
  'https://yasirjamal.com/blog/gohighlevel-for-real-estate-agents-review/',
  'https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/',
  'https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/',
  'https://yasirjamal.com/blog/tmd-hosting-review/',
  'https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/'
];

async function pingIndexing() {
  console.log('Sending direct URL publish notifications to Google Indexing API...');
  for (const url of urlsToPing) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED'
        }
      });
      console.log(`✅ Google Indexing API acknowledged: ${url} (Time: ${res.data.urlNotificationMetadata?.latestUpdate?.notifyTime})`);
    } catch (e) {
      console.log(`ℹ️ Indexing API notice for ${url}: ${e.message}`);
    }
  }
}

pingIndexing().catch(console.error);
