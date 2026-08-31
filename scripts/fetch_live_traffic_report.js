import { google } from 'googleapis';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

const searchconsole = google.searchconsole({
  version: 'v1',
  auth
});

async function getTrafficReport() {
  console.log('========================================================================');
  console.log('📊 LIVE GOOGLE SEARCH CONSOLE TRAFFIC REPORT (yasirjamal.com)');
  console.log('========================================================================\n');

  const today = new Date();
  const endDate = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];
  const startDate = new Date(today.setDate(today.getDate() - 28)).toISOString().split('T')[0];

  console.log(`📅 Report Window: Last 28 Days (${startDate} to ${endDate})\n`);

  // 1. Overall Performance
  const overall = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['date']
    }
  });

  let totalClicks = 0;
  let totalImpressions = 0;
  let avgPositionSum = 0;
  const rows = overall.data.rows || [];
  rows.forEach(r => {
    totalClicks += r.clicks;
    totalImpressions += r.impressions;
    avgPositionSum += r.position;
  });
  const avgPos = rows.length ? (avgPositionSum / rows.length).toFixed(1) : 'N/A';
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0;

  console.log('📈 OVERALL METRICS:');
  console.log(`   • Total Google Impressions: ${totalImpressions.toLocaleString()}`);
  console.log(`   • Total Organic Clicks:     ${totalClicks.toLocaleString()}`);
  console.log(`   • Average Click-Through Rate: ${avgCtr}%`);
  console.log(`   • Average Google Position:  ${avgPos}\n`);

  // 2. UAE (ARE) Specific Performance
  const uae = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensionFilterGroups: [{
        filters: [{ dimension: 'country', operator: 'equals', expression: 'are' }]
      }]
    }
  });
  const uaeRow = uae.data.rows?.[0] || { clicks: 0, impressions: 0, position: 0, ctr: 0 };
  console.log('🇦🇪 UAE (ARE) METRICS:');
  console.log(`   • UAE Impressions: ${uaeRow.impressions.toLocaleString()}`);
  console.log(`   • UAE Clicks:       ${uaeRow.clicks.toLocaleString()}`);
  console.log(`   • UAE Average Position: ${uaeRow.position ? uaeRow.position.toFixed(1) : 'N/A'}\n`);

  // 3. Top Keywords / Queries in UAE
  const uaeQueries = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      dimensionFilterGroups: [{
        filters: [{ dimension: 'country', operator: 'equals', expression: 'are' }]
      }],
      rowLimit: 15
    }
  });

  console.log('🔍 TOP QUERIES IN UAE (DUBAI SEARCHES):');
  (uaeQueries.data.rows || []).forEach((q, i) => {
    console.log(`   ${i + 1}. "${q.keys[0]}" -> Impressions: ${q.impressions} | Clicks: ${q.clicks} | Pos: ${q.position.toFixed(1)}`);
  });

  // 4. Top Performing Pages
  const topPages = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 10
    }
  });

  console.log('\n📄 TOP PAGES BY IMPRESSIONS:');
  (topPages.data.rows || []).forEach((p, i) => {
    console.log(`   ${i + 1}. ${p.keys[0].replace('https://yasirjamal.com', '')} -> Imp: ${p.impressions} | Clicks: ${p.clicks}`);
  });
}

getTrafficReport().catch(console.error);
