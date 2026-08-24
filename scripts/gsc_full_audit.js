import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function runFullAudit() {
  console.log('====================================================');
  console.log('🚀 GOOGLE SEARCH CONSOLE DEEP SEO & SETTINGS AUDIT');
  console.log('====================================================\n');

  // 1. Check Sites
  console.log('1️⃣ Verified Properties & Permission Levels:');
  const sitesRes = await sc.sites.list();
  console.table(sitesRes.data.siteEntry || []);

  // 2. Check Sitemaps
  console.log('\n2️⃣ Sitemaps Status & Indexing Health:');
  const sitemapsRes = await sc.sitemaps.list({ siteUrl: 'sc-domain:yasirjamal.com' });
  console.table(sitemapsRes.data.sitemap?.map(s => ({
    Path: s.path,
    LastSubmitted: s.lastSubmitted,
    LastDownloaded: s.lastDownloaded,
    Errors: s.errors,
    Warnings: s.warnings,
    IsPending: s.isPending
  })) || []);

  // 3. Inspect Core Priority URLs
  const urlsToInspect = [
    'https://yasirjamal.com/',
    'https://yasirjamal.com/about/',
    'https://yasirjamal.com/portfolio/',
    'https://yasirjamal.com/blog/',
    'https://yasirjamal.com/portfolio/julphar/'
  ];

  console.log('\n3️⃣ Real-Time Googlebot URL Inspection & Indexing State:');
  for (const url of urlsToInspect) {
    try {
      const inspectRes = await sc.urlInspection.index.inspect({
        requestBody: {
          siteUrl: 'sc-domain:yasirjamal.com',
          inspectionUrl: url
        }
      });
      const res = inspectRes.data.inspectionResult?.indexStatusResult;
      console.log(`\n📄 URL: ${url}`);
      console.log(`   • Coverage State:      ${res?.coverageState || 'UNKNOWN'}`);
      console.log(`   • Indexing State:      ${res?.indexingState || 'UNKNOWN'}`);
      console.log(`   • RobotsTxt:           ${res?.robotsTxtState || 'UNKNOWN'}`);
      console.log(`   • User Canonical:      ${res?.userCanonical || 'NOT SPECIFIED'}`);
      console.log(`   • Google Canonical:    ${res?.googleCanonical || 'NOT DETECTED'}`);
      console.log(`   • Last Crawl Time:     ${res?.lastCrawlTime || 'NOT YET CRAWLED'}`);
    } catch (err) {
      console.error(`❌ Error inspecting ${url}:`, err.message);
    }
  }

  // 4. Device Performance Breakdown
  console.log('\n4️⃣ Search Performance by Device:');
  const deviceRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: '2026-05-26',
      endDate: '2026-08-24',
      dimensions: ['device']
    }
  });
  console.table(deviceRes.data.rows?.map(r => ({
    Device: r.keys[0],
    Clicks: r.clicks,
    Impressions: r.impressions,
    CTR: ((r.ctr || 0) * 100).toFixed(1) + '%',
    AvgPosition: r.position?.toFixed(1)
  })) || []);

  // 5. Country Breakdown
  console.log('\n5️⃣ Search Performance by Top Countries:');
  const countryRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: '2026-05-26',
      endDate: '2026-08-24',
      dimensions: ['country'],
      rowLimit: 5
    }
  });
  console.table(countryRes.data.rows?.map(r => ({
    Country: r.keys[0],
    Clicks: r.clicks,
    Impressions: r.impressions,
    CTR: ((r.ctr || 0) * 100).toFixed(1) + '%',
    AvgPosition: r.position?.toFixed(1)
  })) || []);

  console.log('\n====================================================');
  console.log('✅ AUDIT COMPLETE');
  console.log('====================================================\n');
}

runFullAudit().catch(console.error);
