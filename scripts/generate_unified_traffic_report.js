import { google } from 'googleapis';
import fs from 'fs';

// 1. Setup GSC Auth
const gscAuth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const sc = google.searchconsole({ version: 'v1', auth: gscAuth });

// 2. Setup GA4 Auth
const ga4Creds = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;
const ga4Token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));

const ga4Oauth = new google.auth.OAuth2(
  ga4Creds.client_id,
  ga4Creds.client_secret,
  'http://localhost:3000/oauth2callback'
);
ga4Oauth.setCredentials(ga4Token);
const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: ga4Oauth });
const ga4PropertyId = '298105942';

async function fetchTrafficReport() {
  console.log('========================================================================');
  console.log('📊 UNIFIED TRAFFIC & PERFORMANCE REPORT (GSC + GA4 LIVE API)');
  console.log('========================================================================\n');

  // A. GOOGLE SEARCH CONSOLE DATA
  try {
    const today = new Date();
    const gscEndDate = new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0];
    const gscStartDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];

    const gscOverview = await sc.searchanalytics.query({
      siteUrl: 'sc-domain:yasirjamal.com',
      requestBody: {
        startDate: gscStartDate,
        endDate: gscEndDate
      }
    });

    console.log(`🔍 GOOGLE SEARCH CONSOLE (Date Range: ${gscStartDate} to ${gscEndDate}):`);
    const gscRow = gscOverview.data.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
    console.log(`   - 🖱️ Organic Clicks: ${gscRow.clicks}`);
    console.log(`   - 👁️ Search Impressions: ${gscRow.impressions}`);
    console.log(`   - 🎯 Average CTR: ${(gscRow.ctr * 100).toFixed(2)}%`);
    console.log(`   - 📍 Average Position: ${gscRow.position.toFixed(1)}`);

    // Top Queries
    const gscQueries = await sc.searchanalytics.query({
      siteUrl: 'sc-domain:yasirjamal.com',
      requestBody: {
        startDate: gscStartDate,
        endDate: gscEndDate,
        dimensions: ['query'],
        rowLimit: 10
      }
    });

    console.log('\n   🔑 Top Google Search Queries:');
    if (gscQueries.data.rows) {
      gscQueries.data.rows.forEach((r, i) => {
        console.log(`      ${i + 1}. "${r.keys[0]}" | Clicks: ${r.clicks} | Impr: ${r.impressions} | CTR: ${(r.ctr * 100).toFixed(1)}% | Pos: #${r.position.toFixed(1)}`);
      });
    }

    // Top Pages
    const gscPages = await sc.searchanalytics.query({
      siteUrl: 'sc-domain:yasirjamal.com',
      requestBody: {
        startDate: gscStartDate,
        endDate: gscEndDate,
        dimensions: ['page'],
        rowLimit: 10
      }
    });

    console.log('\n   📄 Top Organic Landing Pages:');
    if (gscPages.data.rows) {
      gscPages.data.rows.forEach((r, i) => {
        const pageName = r.keys[0].replace('https://yasirjamal.com', '').replace('https://www.yasirjamal.com', '') || '/';
        console.log(`      ${i + 1}. ${pageName} | Clicks: ${r.clicks} | Impr: ${r.impressions} | CTR: ${(r.ctr * 100).toFixed(1)}%`);
      });
    }

  } catch (e) {
    console.log('GSC Error:', e.message);
  }

  console.log('\n------------------------------------------------------------------------\n');

  // B. GOOGLE ANALYTICS 4 DATA
  try {
    // 1. Realtime Active Users
    const realtimeRes = await analyticsdata.properties.runRealtimeReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'unifiedScreenName' }, { name: 'country' }, { name: 'city' }]
      }
    });

    console.log('📈 GOOGLE ANALYTICS 4 (LIVE USER JOURNEYS & SESSIONS):');
    console.log('   🔴 Real-Time Active Users (Last 30 Minutes):');
    if (realtimeRes.data.rows && realtimeRes.data.rows.length > 0) {
      realtimeRes.data.rows.forEach(r => {
        console.log(`      - 👤 ${r.metricValues[0].value} active user(s) in ${r.dimensionValues[2].value}, ${r.dimensionValues[1].value} on "${r.dimensionValues[0].value}"`);
      });
    } else {
      console.log('      ℹ️ 0 active visitors in the last 30 minutes.');
    }

    // 2. 7-Day Performance Overview
    const ga4Overview = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
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

    const gRow = ga4Overview.data.rows?.[0];
    if (gRow) {
      const activeUsers = gRow.metricValues[0].value;
      const newUsers = gRow.metricValues[1].value;
      const sessions = gRow.metricValues[2].value;
      const views = gRow.metricValues[3].value;
      const engRate = (parseFloat(gRow.metricValues[4].value) * 100).toFixed(1);
      const avgDurationSec = sessions > 0 ? (parseFloat(gRow.metricValues[5].value) / sessions).toFixed(0) : 0;

      console.log('\n   👥 7-Day Audience & Engagement:');
      console.log(`      - Active Users: ${activeUsers}`);
      console.log(`      - New First-Time Visitors: ${newUsers}`);
      console.log(`      - Total Sessions: ${sessions}`);
      console.log(`      - Total Pageviews: ${views}`);
      console.log(`      - Engagement Rate: ${engRate}%`);
      console.log(`      - Avg Session Duration: ${avgDurationSec} seconds`);
    }

    // 3. Traffic Acquisition Channels
    const ga4Sources = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8
      }
    });

    console.log('\n   🌐 Top Traffic Sources & Channels:');
    if (ga4Sources.data.rows) {
      ga4Sources.data.rows.forEach((r, i) => {
        const eng = (parseFloat(r.metricValues[2].value) * 100).toFixed(1);
        console.log(`      ${i + 1}. [${r.dimensionValues[0].value}] → Sessions: ${r.metricValues[0].value} | Users: ${r.metricValues[1].value} | Engagement: ${eng}%`);
      });
    }

    // 4. Top Visited Pages
    const ga4Pages = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10
      }
    });

    console.log('\n   📄 Top Visited Pages (Most Read Content):');
    if (ga4Pages.data.rows) {
      ga4Pages.data.rows.forEach((r, i) => {
        console.log(`      ${i + 1}. ${r.dimensionValues[0].value} → Views: ${r.metricValues[0].value} | Users: ${r.metricValues[1].value}`);
      });
    }

    // 5. Geographic Locations
    const ga4Geo = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8
      }
    });

    console.log('\n   📍 Top Geographic Locations:');
    if (ga4Geo.data.rows) {
      ga4Geo.data.rows.forEach((r, i) => {
        console.log(`      ${i + 1}. ${r.dimensionValues[1].value}, ${r.dimensionValues[0].value} → ${r.metricValues[1].value} sessions (${r.metricValues[0].value} users)`);
      });
    }

  } catch (e) {
    console.log('GA4 Error:', e.message);
  }

  console.log('\n========================================================================\n');
}

fetchTrafficReport().catch(console.error);
