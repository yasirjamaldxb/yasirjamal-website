import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function analyzeRankings() {
  console.log('🔍 Querying daily ranking trends from Google Search Console API...\n');

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. Daily Trend
  const dailyRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date'],
      rowLimit: 30
    }
  });

  console.log('📅 Day-by-Day Performance (Past 30 Days):');
  console.table(dailyRes.data.rows?.map(r => ({
    Date: r.keys[0],
    Clicks: r.clicks,
    Impressions: r.impressions,
    CTR: ((r.ctr || 0) * 100).toFixed(1) + '%',
    AvgPosition: r.position?.toFixed(1)
  })));

  // 2. Query breakdown
  const queryRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 50
    }
  });

  console.log('\n🎯 Query-by-Query Positions:');
  console.table(queryRes.data.rows?.map(r => ({
    Query: r.keys[0],
    Clicks: r.clicks,
    Impressions: r.impressions,
    Position: r.position?.toFixed(1)
  })));

  // 3. Inspect Homepage
  const inspectRes = await sc.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl: 'https://yasirjamal.com/',
      siteUrl: 'sc-domain:yasirjamal.com'
    }
  });

  console.log('\n📄 Homepage Live Googlebot Status:');
  console.log('Coverage State:', inspectRes.data.inspectionResult?.indexStatusResult?.coverageState);
  console.log('Last Crawl Time:', inspectRes.data.inspectionResult?.indexStatusResult?.lastCrawlTime);
  console.log('Crawled As:', inspectRes.data.inspectionResult?.indexStatusResult?.crawledAs);
  console.log('RobotsTxt:', inspectRes.data.inspectionResult?.indexStatusResult?.robotsTxtState);
}

analyzeRankings().catch(console.error);
