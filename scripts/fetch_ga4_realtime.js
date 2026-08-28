import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/analytics.readonly']
});

const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });

async function getGA4Report(propertyId) {
  console.log('========================================================');
  console.log('📊 GOOGLE ANALYTICS 4 (GA4) - REALTIME & TRAFFIC REPORT');
  console.log('========================================================\n');

  if (!propertyId) {
    console.log('ℹ️ Please provide your GA4 Numeric Property ID (e.g. 123456789).');
    console.log('You can find it in Google Analytics > Admin > Property Settings > Property Details.');
    return;
  }

  try {
    // 1. Realtime Active Users
    const realtime = await analyticsdata.properties.runRealtimeReport({
      property: `properties/${propertyId}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }, { name: 'city' }, { name: 'unifiedScreenName' }]
      }
    });

    console.log('🔴 REAL-TIME ACTIVE USERS (Last 30 Minutes):');
    if (realtime.data.rows && realtime.data.rows.length > 0) {
      realtime.data.rows.forEach(r => {
        console.log(`   - ${r.metricValues[0].value} user(s) in ${r.dimensionValues[1].value}, ${r.dimensionValues[0].value} on page: ${r.dimensionValues[2].value}`);
      });
    } else {
      console.log('   0 active users in the last 30 minutes.');
    }
    console.log('--------------------------------------------------------\n');

    // 2. Traffic Sources (Last 7 Days)
    const sources = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }]
      }
    });

    console.log('🌐 TOP TRAFFIC SOURCES (Last 7 Days):');
    if (sources.data.rows && sources.data.rows.length > 0) {
      sources.data.rows.forEach(r => {
        console.log(`   - Source: ${r.dimensionValues[0].value} | Sessions: ${r.metricValues[0].value} | Users: ${r.metricValues[1].value} | Engagement: ${(parseFloat(r.metricValues[2].value) * 100).toFixed(1)}%`);
      });
    } else {
      console.log('   No sessions recorded in this period.');
    }
    console.log('========================================================\n');
  } catch (e) {
    console.log(`❌ Error querying GA4: ${e.message}`);
  }
}

const propId = process.argv[2];
getGA4Report(propId).catch(console.error);
