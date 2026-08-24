import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function findAllIndexedPages() {
  console.log('🔍 Querying all historical and currently indexed pages from Google Search Console...\n');

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const res = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 500
    }
  });

  const pages = res.data.rows?.map(r => ({
    url: r.keys[0],
    clicks: r.clicks,
    impressions: r.impressions,
    avgPos: r.position?.toFixed(1)
  })) || [];

  console.log(`Found ${pages.length} URLs in Google Search Console:\n`);
  console.table(pages);

  // Check each URL status on live production
  console.log('\n🔍 Testing HTTP Status Code on live https://yasirjamal.com for each URL:\n');
  const results = [];

  for (const p of pages) {
    try {
      const response = await fetch(p.url, { method: 'HEAD', redirect: 'manual' });
      const status = response.status;
      const location = response.headers.get('location') || '';
      results.push({
        url: p.url,
        status,
        location,
        clicks: p.clicks,
        impressions: p.impressions
      });
      console.log(`[${status}] ${p.url} ${location ? '-> ' + location : ''}`);
    } catch (e) {
      console.error(`[ERR] ${p.url}: ${e.message}`);
    }
  }

  fs.writeFileSync('gsc_pages_audit.json', JSON.stringify(results, null, 2));
  console.log('\n✅ Saved results to gsc_pages_audit.json');
}

findAllIndexedPages().catch(console.error);
