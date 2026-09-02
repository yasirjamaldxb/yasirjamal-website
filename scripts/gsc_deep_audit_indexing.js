import { google } from 'googleapis';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly', 'https://www.googleapis.com/auth/webmasters']
});

const searchconsole = google.searchconsole({
  version: 'v1',
  auth
});

async function runAudit() {
  console.log('========================================================================');
  console.log('🔍 GOOGLE SEARCH CONSOLE DEEP INDEXING & CRAWL AUDIT');
  console.log('========================================================================\n');

  // 1. List sitemaps
  console.log('1️⃣ Checking Sitemaps in GSC...');
  try {
    const sitemaps = await searchconsole.sitemaps.list({
      siteUrl: 'sc-domain:yasirjamal.com'
    });
    console.log('Sitemaps:', JSON.stringify(sitemaps.data, null, 2));
  } catch (err) {
    console.log('Sitemaps error:', err.message);
  }

  // 2. Query all crawled pages and search analytics
  console.log('\n2️⃣ Querying Search Analytics to discover indexed vs non-indexed URLs...');
  const today = new Date();
  const endDate = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  const startDate = new Date(today.setDate(today.getDate() - 90)).toISOString().split('T')[0];

  const pagesRes = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 500
    }
  });

  console.log(`Found ${(pagesRes.data.rows || []).length} pages receiving search impressions/clicks over 90 days.`);
  
  // 3. Inspect sitemap.xml on the local build and compare against live
  const sitemapPath = 'public/sitemap-0.xml';
  let sitemapUrls = [];
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const matches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
    sitemapUrls = matches.map(m => m.replace(/<\/?loc>/g, ''));
    console.log(`\nLocal sitemap has ${sitemapUrls.length} production URLs.`);
  }

  const result = {
    sitemapUrls,
    searchAnalyticsPages: (pagesRes.data.rows || []).map(r => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position
    }))
  };

  fs.writeFileSync('scripts/deep_indexing_audit_dump.json', JSON.stringify(result, null, 2));
  console.log('Audit data saved to scripts/deep_indexing_audit_dump.json');
}

runAudit().catch(console.error);
