import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const CREDENTIALS_PATH = process.env.GSC_KEY_PATH || path.resolve(process.cwd(), 'gsc_credentials.json');

function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`\n⚠️ Google Search Console credentials file not found at:\n   ${CREDENTIALS_PATH}\n`);
    console.log('To authenticate Google Search Console:');
    console.log('1. Go to Google Cloud Console (console.cloud.google.com).');
    console.log('2. Enable "Google Search Console API".');
    console.log('3. Create a Service Account, download the JSON key, and save it as "gsc_credentials.json" in this directory.');
    console.log('4. In Google Search Console (search.google.com/search-console), go to Settings > Users and Permissions and add the Service Account email as "Full" or "Owner".\n');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: [
      'https://www.googleapis.com/auth/webmasters',
      'https://www.googleapis.com/auth/webmasters.readonly'
    ]
  });

  return auth;
}

export async function listProperties() {
  const auth = getAuthClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth });
  
  console.log('🔍 Fetching Google Search Console properties...\n');
  const res = await searchconsole.sites.list();
  console.log('Verified Properties:');
  console.table(res.data.siteEntry || []);
  return res.data.siteEntry;
}

export async function getSearchPerformance(siteUrl = 'sc-domain:yasirjamal.com', days = 28) {
  const auth = getAuthClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  console.log(`\n📊 Querying Search Analytics for ${siteUrl} (${startDate} to ${endDate})...\n`);

  const res = await searchconsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 25
    }
  });

  console.log('Top Search Queries:');
  console.table(res.data.rows?.map(r => ({
    Query: r.keys?.[0],
    Clicks: r.clicks,
    Impressions: r.impressions,
    CTR: `${((r.ctr || 0) * 100).toFixed(1)}%`,
    AvgPosition: r.position?.toFixed(1)
  })) || []);

  return res.data.rows;
}

export async function inspectUrl(siteUrl = 'https://yasirjamal.com/', inspectionUrl = 'https://yasirjamal.com/') {
  const auth = getAuthClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  console.log(`\n🔍 Inspecting URL Indexing Status: ${inspectionUrl}...\n`);

  const res = await searchconsole.urlInspection.index.inspect({
    requestBody: {
      siteUrl,
      inspectionUrl
    }
  });

  const result = res.data.inspectionResult;
  console.log('====================================================');
  console.log(`URL: ${inspectionUrl}`);
  console.log(`Coverage State:     ${result?.indexStatusResult?.coverageState}`);
  console.log(`Indexing State:     ${result?.indexStatusResult?.indexingState}`);
  console.log(`RobotsTxt Status:   ${result?.indexStatusResult?.robotsTxtState}`);
  console.log(`Mobile Usability:   ${result?.mobileUsabilityResult?.verdict || 'PASSED'}`);
  console.log(`Rich Results:       ${result?.richResultsResult?.verdict || 'PASSED'}`);
  console.log('====================================================\n');

  return result;
}

const command = process.argv[2] || 'list';
const arg1 = process.argv[3];
const arg2 = process.argv[4];

if (command === 'list') {
  listProperties().catch(console.error);
} else if (command === 'performance') {
  getSearchPerformance(arg1 || 'sc-domain:yasirjamal.com', arg2 ? parseInt(arg2) : 28).catch(console.error);
} else if (command === 'inspect') {
  inspectUrl(arg1 || 'https://yasirjamal.com/', arg2 || 'https://yasirjamal.com/').catch(console.error);
}
