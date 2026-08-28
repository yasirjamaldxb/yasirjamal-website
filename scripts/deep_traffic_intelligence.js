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
const propertyId = '298105942';

async function runDeepIntelligence() {
  console.log('========================================================================');
  console.log('🔬 DEEP MULTI-DIMENSIONAL TRAFFIC & ATTRIBUTION INTELLIGENCE REPORT');
  console.log('========================================================================\n');

  // 1. Granular Referrer URLs (Exact Referral URLs)
  try {
    const refRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pageReferrer' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 25
      }
    });

    console.log('🔗 EXACT REFERRER URLS (Where Traffic Originates):');
    if (refRes.data.rows && refRes.data.rows.length > 0) {
      refRes.data.rows.forEach((r, i) => {
        const ref = r.dimensionValues[0].value || '(Direct / Typed / Bookmark / In-App)';
        console.log(`   ${i + 1}. [${ref}] → Sessions: ${r.metricValues[0].value} | Users: ${r.metricValues[1].value}`);
      });
    }
  } catch (e) {
    console.log('Referrer error:', e.message);
  }
  console.log('\n------------------------------------------------------------------------\n');

  // 2. Full Source / Medium & Campaign Tracking
  try {
    const srcRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'sessionSourceMedium' }, { name: 'sessionCampaignName' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }, { name: 'engagementRate' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
      }
    });

    console.log('📊 TRAFFIC CHANNELS & CAMPAIGNS:');
    if (srcRes.data.rows && srcRes.data.rows.length > 0) {
      srcRes.data.rows.forEach((r, i) => {
        const src = r.dimensionValues[0].value;
        const camp = r.dimensionValues[1].value !== '(not set)' && r.dimensionValues[1].value !== '(direct)' ? ` | Campaign: "${r.dimensionValues[1].value}"` : '';
        const eng = (parseFloat(r.metricValues[2].value) * 100).toFixed(1);
        console.log(`   ${i + 1}. ${src}${camp} → Sessions: ${r.metricValues[0].value} | Users: ${r.metricValues[1].value} | Engagement: ${eng}%`);
      });
    }
  } catch (e) {
    console.log('Source error:', e.message);
  }
  console.log('\n------------------------------------------------------------------------\n');

  // 3. Device & Operating System Breakdown
  try {
    const devRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'deviceCategory' }, { name: 'operatingSystem' }, { name: 'browser' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 10
      }
    });

    console.log('📱 DEVICE, OS & BROWSER BREAKDOWN:');
    if (devRes.data.rows && devRes.data.rows.length > 0) {
      devRes.data.rows.forEach((r, i) => {
        const dev = r.dimensionValues[0].value;
        const os = r.dimensionValues[1].value;
        const browser = r.dimensionValues[2].value;
        console.log(`   ${i + 1}. ${dev.toUpperCase()} (${os} / ${browser}) → ${r.metricValues[1].value} sessions (${r.metricValues[0].value} users)`);
      });
    }
  } catch (e) {
    console.log('Device error:', e.message);
  }
  console.log('\n------------------------------------------------------------------------\n');

  // 4. City-Level Granular Geo Tracking
  try {
    const geoRes = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 15
      }
    });

    console.log('📍 CITY-LEVEL GEOGRAPHIC HUBS:');
    if (geoRes.data.rows && geoRes.data.rows.length > 0) {
      geoRes.data.rows.forEach((r, i) => {
        const country = r.dimensionValues[0].value;
        const city = r.dimensionValues[1].value;
        console.log(`   ${i + 1}. ${city}, ${country} → ${r.metricValues[1].value} sessions (${r.metricValues[0].value} users)`);
      });
    }
  } catch (e) {
    console.log('Geo error:', e.message);
  }
  console.log('\n========================================================================\n');
}

runDeepIntelligence().catch(console.error);
