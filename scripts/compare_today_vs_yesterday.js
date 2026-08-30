import { google } from 'googleapis';
import fs from 'fs';

// 1. Setup GA4 Auth
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

// 2. Setup GSC Auth
const gscAuth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});
const sc = google.searchconsole({ version: 'v1', auth: gscAuth });

async function compareTraffic() {
  console.log('========================================================================');
  console.log('📊 LIVE TRAFFIC COMPARISON: TODAY (AUG 30) VS YESTERDAY (AUG 29)');
  console.log('========================================================================\n');

  try {
    // 1. GA4 Today (Aug 30) vs Yesterday (Aug 29)
    const reportToday = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
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

    const reportYesterday = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: 'yesterday', endDate: 'yesterday' }],
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

    const rowT = reportToday.data.rows?.[0]?.metricValues || [{value:0},{value:0},{value:0},{value:0},{value:0},{value:0}];
    const rowY = reportYesterday.data.rows?.[0]?.metricValues || [{value:0},{value:0},{value:0},{value:0},{value:0},{value:0}];

    const usersToday = parseInt(rowT[0].value, 10);
    const usersYest = parseInt(rowY[0].value, 10);
    const newToday = parseInt(rowT[1].value, 10);
    const newYest = parseInt(rowY[1].value, 10);
    const sessToday = parseInt(rowT[2].value, 10);
    const sessYest = parseInt(rowY[2].value, 10);
    const viewsToday = parseInt(rowT[3].value, 10);
    const viewsYest = parseInt(rowY[3].value, 10);
    const engToday = (parseFloat(rowT[4].value) * 100).toFixed(1);
    const engYest = (parseFloat(rowY[4].value) * 100).toFixed(1);
    const durToday = sessToday > 0 ? (parseFloat(rowT[5].value) / sessToday).toFixed(0) : 0;
    const durYest = sessYest > 0 ? (parseFloat(rowY[5].value) / sessYest).toFixed(0) : 0;

    console.log('📈 GOOGLE ANALYTICS 4 (USER & ENGAGEMENT METRICS):');
    console.log(`   - 👥 Active Visitors:     Today: ${usersToday}  |  Yesterday: ${usersYest}  (${usersToday >= usersYest ? '🟢 +' + (usersToday - usersYest) : '🔴 ' + (usersToday - usersYest)})`);
    console.log(`   - 🆕 New First-Time Users: Today: ${newToday}  |  Yesterday: ${newYest}  (${newToday >= newYest ? '🟢 +' + (newToday - newYest) : '🔴 ' + (newToday - newYest)})`);
    console.log(`   - 🔄 Total Sessions:       Today: ${sessToday}  |  Yesterday: ${sessYest}  (${sessToday >= sessYest ? '🟢 +' + (sessToday - sessYest) : '🔴 ' + (sessToday - sessYest)})`);
    console.log(`   - 📄 Pageviews:            Today: ${viewsToday}  |  Yesterday: ${viewsYest}  (${viewsToday >= viewsYest ? '🟢 +' + (viewsToday - viewsYest) : '🔴 ' + (viewsToday - viewsYest)})`);
    console.log(`   - 🎯 Engagement Rate:      Today: ${engToday}%  |  Yesterday: ${engYest}%`);
    console.log(`   - ⏱️ Avg Session Duration: Today: ${durToday}s  |  Yesterday: ${durYest}s`);

    // 2. Acquisition Breakdown for Today & Yesterday
    const sourcesToday = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: 'yesterday', endDate: 'today' }],
        dimensions: [{ name: 'date' }, { name: 'sessionSourceMedium' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }
    });

    console.log('\n🌐 TRAFFIC SOURCES & REFERRALS (YESTERDAY & TODAY):');
    if (sourcesToday.data.rows) {
      sourcesToday.data.rows.forEach(r => {
        const d = r.dimensionValues[0].value === new Date().toISOString().split('T')[0].replace(/-/g, '') ? 'Today' : 'Yesterday';
        const src = r.dimensionValues[1].value;
        const sCount = r.metricValues[0].value;
        const uCount = r.metricValues[1].value;
        const eRate = (parseFloat(r.metricValues[2].value) * 100).toFixed(1);
        console.log(`   - [${d}] ${src} → ${sCount} session(s), ${uCount} user(s), ${eRate}% engagement`);
      });
    }

    // 3. Top Pages Read Today
    const pagesToday = await analyticsdata.properties.runReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 8
      }
    });

    console.log('\n📄 TOP PAGES VIEWED TODAY:');
    if (pagesToday.data.rows && pagesToday.data.rows.length > 0) {
      pagesToday.data.rows.forEach((r, i) => {
        console.log(`   ${i + 1}. ${r.dimensionValues[0].value} → ${r.metricValues[0].value} views (${r.metricValues[1].value} users)`);
      });
    } else {
      console.log('   (No specific subpage views logged yet today)');
    }

    // 4. Real-time active users right now
    const rtRes = await analyticsdata.properties.runRealtimeReport({
      property: `properties/${ga4PropertyId}`,
      requestBody: {
        metrics: [{ name: 'activeUsers' }],
        dimensions: [{ name: 'country' }, { name: 'city' }]
      }
    });

    console.log('\n🔴 REAL-TIME ACTIVE VISITORS (LAST 30 MIN):');
    if (rtRes.data.rows && rtRes.data.rows.length > 0) {
      rtRes.data.rows.forEach(r => {
        console.log(`   - 👤 ${r.metricValues[0].value} active user(s) in ${r.dimensionValues[1].value}, ${r.dimensionValues[0].value}`);
      });
    } else {
      console.log('   - 0 active visitors in the last 30 minutes.');
    }

  } catch (err) {
    console.error('❌ Traffic Comparison Error:', err.message);
  }

  console.log('\n========================================================================');
}

compareTraffic().catch(console.error);
