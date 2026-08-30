import { google } from 'googleapis';
import fs from 'fs';

// 1. Setup GSC Auth for actual search query tracking
const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

const sc = google.searchconsole({ version: 'v1', auth });

const trackedKeywords = [
  'freelance web designer dubai',
  'web design dubai',
  'web designer dubai',
  'ecommerce web developer dubai',
  'shopify developer dubai',
  'senior product designer dubai',
  'astro vs wordpress',
  'tmd hosting review',
  'gohighlevel free trial'
];

async function runRankTracker() {
  console.log('========================================================');
  console.log('🎯 DAILY GOOGLE SEARCH RANK TRACKER & SERP MONITOR');
  console.log('========================================================\n');

  try {
    const today = new Date();
    const endDate = new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0];
    const startDate = new Date(today.setDate(today.getDate() - 28)).toISOString().split('T')[0];

    const res = await sc.searchanalytics.query({
      siteUrl: 'sc-domain:yasirjamal.com',
      requestBody: {
        startDate: startDate,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 25
      }
    });

    console.log(`📊 LIVE RANKINGS & IMPRESSIONS ON GOOGLE (${startDate} to ${endDate}):\n`);
    
    if (res.data.rows && res.data.rows.length > 0) {
      res.data.rows.forEach((row, i) => {
        const query = row.keys[0];
        const clicks = row.clicks;
        const impressions = row.impressions;
        const ctr = (row.ctr * 100).toFixed(1);
        const position = row.position.toFixed(1);

        const badge = parseFloat(position) <= 3 ? '🥇 Top 3' : (parseFloat(position) <= 10 ? '🟢 Page 1' : '🟡 Page 2+');

        console.log(`${i + 1}. [${badge}] "${query}"`);
        console.log(`   Position: #${position} | Clicks: ${clicks} | Impressions: ${impressions} | CTR: ${ctr}%\n`);
      });
    } else {
      console.log('No keyword data found in the requested range.');
    }

  } catch (err) {
    console.error('❌ Rank Tracker Error:', err.message);
  }

  console.log('========================================================');
}

runRankTracker().catch(console.error);
