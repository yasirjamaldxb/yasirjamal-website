import { google } from 'googleapis';
import fs from 'fs';

const credentials = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;
const token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  'http://localhost:3000/oauth2callback'
);

oauth2Client.setCredentials(token);

const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: oauth2Client });
const propertyId = '298105942'; // yasirjamal.com

async function runGA4Dashboard() {
  console.log('========================================================');
  console.log('📊 GOOGLE ANALYTICS 4 (GA4) - LIVE PRODUCTION DASHBOARD');
  console.log('========================================================\n');

  // 1. Realtime Active Users (Last 30 mins)
  try {
    const realtimeRes = await analyticsdata.properties.runRealtimeReport({
      property: `properties/${propertyId}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'unifiedScreenName' }, { name: 'country' }, { name: 'city' }]
      }
    });

    console.log('🔴 REAL-TIME ACTIVE USERS (Last 30 Minutes):');
    if (realtimeRes.data.rows && realtimeRes.data.rows.length > 0) {
      realtimeRes.data.rows.forEach(r => {
        console.log(`   - 👤 ${r.metricValues[0].value} user(s) in ${r.dimensionValues[2].value}, ${r.dimensionValues[1].value} on page: "${r.dimensionValues[0].value}"`);
      });
    } else {
      console.log('   ℹ️ 0 active visitors in the last 30 minutes.');
    }
  } catch (e) {
    console.log(`   Realtime check: ${e.message}`);
  }
  console.log('--------------------------------------------------------\n');

  // 2. 7-Day Performance Overview
  try {
    const overviewRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'engagementRate' },
          { name: 'userEngagementDuration' }
        ]
      }
    });

    const row = overviewRes.data.rows?.[0];
    if (row) {
      const activeUsers = row.metricValues[0].value;
      const newUsers = row.metricValues[1].value;
      const sessions = row.metricValues[2].value;
      const views = row.metricValues[3].value;
      const engRate = (parseFloat(row.metricValues[4].value) * 100).toFixed(1);
      const avgDurationSec = sessions > 0 ? (parseFloat(row.metricValues[5].value) / sessions).toFixed(0) : 0;

      console.log('📈 7-DAY ENGAGEMENT OVERVIEW:');
      console.log(`   - Total Active Users: ${activeUsers}`);
      console.log(`   - New Visitors: ${newUsers}`);
      console.log(`   - Total Sessions: ${sessions}`);
      console.log(`   - Total Pageviews: ${views}`);
      console.log(`   - Engagement Rate: ${engRate}%`);
      console.log(`   - Avg Session Duration: ${avgDurationSec} seconds`);
    }
  } catch (e) {
    console.log(`   Overview check: ${e.message}`);
  }
  console.log('--------------------------------------------------------\n');

  // 3. Traffic Acquisition Sources (Last 7 Days)
  try {
    const sourceRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }
    });

    console.log('🌐 TRAFFIC SOURCES & REFERRALS (Last 7 Days):');
    if (sourceRes.data.rows && sourceRes.data.rows.length > 0) {
      sourceRes.data.rows.forEach((r, i) => {
        const src = r.dimensionValues[0].value;
        const sess = r.metricValues[0].value;
        const users = r.metricValues[1].value;
        const eng = (parseFloat(r.metricValues[2].value) * 100).toFixed(1);
        console.log(`   ${i + 1}. [${src}] → Sessions: ${sess} | Users: ${users} | Engagement: ${eng}%`);
      });
    } else {
      console.log('   No source data recorded in this period.');
    }
  } catch (e) {
    console.log(`   Source check: ${e.message}`);
  }
  console.log('--------------------------------------------------------\n');

  // 4. Top Landing Pages (Last 7 Days)
  try {
    const pagesRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 15
      }
    });

    console.log('📄 TOP VISITED PAGES (Last 7 Days):');
    if (pagesRes.data.rows && pagesRes.data.rows.length > 0) {
      pagesRes.data.rows.forEach((r, i) => {
        const path = r.dimensionValues[0].value;
        const views = r.metricValues[0].value;
        const users = r.metricValues[1].value;
        console.log(`   ${i + 1}. ${path} → Views: ${views} | Users: ${users}`);
      });
    }
  } catch (e) {
    console.log(`   Pages check: ${e.message}`);
  }
  console.log('--------------------------------------------------------\n');

  // 5. Geographic Breakdown (Countries & Cities)
  try {
    const geoRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 10
      }
    });

    console.log('🌍 TOP GEOGRAPHIC LOCATIONS (Last 7 Days):');
    if (geoRes.data.rows && geoRes.data.rows.length > 0) {
      geoRes.data.rows.forEach((r, i) => {
        const country = r.dimensionValues[0].value;
        const city = r.dimensionValues[1].value;
        const users = r.metricValues[0].value;
        console.log(`   ${i + 1}. ${city}, ${country} → ${users} user(s)`);
      });
    }
  } catch (e) {
    console.log(`   Geo check: ${e.message}`);
  }
  console.log('========================================================\n');
}

runGA4Dashboard().catch(console.error);
