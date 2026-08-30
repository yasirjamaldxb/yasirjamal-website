import { google } from 'googleapis';
import fs from 'fs';

const creds = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;

const targetUrls = [
  'https://yasirjamal.com/',
  'https://yasirjamal.com/about/',
  'https://yasirjamal.com/portfolio/',
  'https://yasirjamal.com/blog/',
  'https://yasirjamal.com/blog/tmd-hosting-review/',
  'https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/',
  'https://yasirjamal.com/blog/speed-up-gohighlevel-funnels-custom-css-guide/',
  'https://yasirjamal.com/blog/astro-vs-wordpress-speed-performance-guide/',
  'https://yasirjamal.com/blog/hiring-freelance-web-designer-vs-agency-dubai/',
  'https://yasirjamal.com/blog/modern-web-design-trends-2026/',
  'https://yasirjamal.com/blog/conversion-rate-optimization-cro-lead-generation/',
  'https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/'
];

async function run() {
  console.log('Testing Indexing API with OAuth tokens...');
  const token = JSON.parse(fs.readFileSync('gbp_token.json', 'utf8'));

  const oauth2 = new google.auth.OAuth2(
    creds.client_id,
    creds.client_secret,
    'http://localhost:3000/oauth2callback'
  );
  oauth2.setCredentials(token);

  const indexing = google.indexing({ version: 'v3', auth: oauth2 });

  for (const u of targetUrls) {
    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: { url: u, type: 'URL_UPDATED' }
      });
      console.log(`✅ [200 OK] Published: ${u}`);
    } catch (e) {
      console.log(`⚠️ ${u}: ${e.message}`);
    }
  }
}

run().catch(console.error);
