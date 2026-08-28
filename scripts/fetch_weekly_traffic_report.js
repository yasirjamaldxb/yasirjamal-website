import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters', 'https://www.googleapis.com/auth/webmasters.readonly']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function getWeeklyReport() {
  let output = '';
  function log(msg) {
    output += msg + '\n';
  }

  log('========================================================');
  log('📊 GOOGLE SEARCH CONSOLE - WEEKLY TRAFFIC & RANKINGS REPORT');
  log('========================================================\n');

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() - 1);
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 8);

  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];

  log(`Analyzing GSC Date Range: ${startStr} to ${endStr}\n`);

  // 1. Overall Summary
  const overallRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: startStr,
      endDate: endStr,
      aggregationType: 'auto'
    }
  });

  const summary = overallRes.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  log('📈 OVERALL 7-DAY PERFORMANCE:');
  log(`   - Total Clicks: ${summary.clicks || 0}`);
  log(`   - Total Impressions: ${summary.impressions || 0}`);
  log(`   - Average CTR: ${((summary.ctr || 0) * 100).toFixed(2)}%`);
  log(`   - Average Position: ${(summary.position || 0).toFixed(1)}`);
  log('--------------------------------------------------------\n');

  // 2. Top Search Queries
  const queryRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: startStr,
      endDate: endStr,
      dimensions: ['query'],
      rowLimit: 25
    }
  });

  log('🔑 TOP SEARCH QUERIES THIS WEEK:');
  if (queryRes.data.rows && queryRes.data.rows.length > 0) {
    queryRes.data.rows.forEach((row, i) => {
      const q = row.keys[0];
      const clicks = row.clicks;
      const impr = row.impressions;
      const ctr = (row.ctr * 100).toFixed(1);
      const pos = row.position.toFixed(1);
      log(`   ${i + 1}. "${q}" | Clicks: ${clicks} | Impr: ${impr} | CTR: ${ctr}% | Pos: #${pos}`);
    });
  } else {
    log('   No query rows returned for this specific 7-day slice.');
  }
  log('--------------------------------------------------------\n');

  // 3. Top Pages
  const pageRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: startStr,
      endDate: endStr,
      dimensions: ['page'],
      rowLimit: 20
    }
  });

  log('📄 TOP PERFORMING PAGES THIS WEEK:');
  if (pageRes.data.rows && pageRes.data.rows.length > 0) {
    pageRes.data.rows.forEach((row, i) => {
      const page = row.keys[0].replace('https://yasirjamal.com', '');
      const clicks = row.clicks;
      const impr = row.impressions;
      const ctr = (row.ctr * 100).toFixed(1);
      const pos = row.position.toFixed(1);
      log(`   ${i + 1}. ${page || '/'} | Clicks: ${clicks} | Impr: ${impr} | CTR: ${ctr}% | Pos: #${pos}`);
    });
  } else {
    log('   No page rows returned for this specific 7-day slice.');
  }
  log('--------------------------------------------------------\n');

  // 4. Also fetch last 28 days for historical context
  const start28 = new Date(today);
  start28.setDate(today.getDate() - 29);
  const start28Str = start28.toISOString().split('T')[0];

  const res28 = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate: start28Str,
      endDate: endStr,
      aggregationType: 'auto'
    }
  });
  const sum28 = res28.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  log('📅 28-DAY AGGREGATE BASELINE:');
  log(`   - 28-Day Clicks: ${sum28.clicks || 0}`);
  log(`   - 28-Day Impressions: ${sum28.impressions || 0}`);
  log(`   - 28-Day Avg Position: ${(sum28.position || 0).toFixed(1)}`);
  log('========================================================\n');

  fs.writeFileSync('scripts/traffic_output.txt', output, 'utf8');
}

getWeeklyReport().catch(err => {
  fs.writeFileSync('scripts/traffic_output.txt', 'Error: ' + err.stack, 'utf8');
});
