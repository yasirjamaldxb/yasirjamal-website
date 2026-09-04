import { google } from 'googleapis';
import fs from 'fs';

async function run() {
  try {
    const clientSecret = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;
    const token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));

    const oauth2Client = new google.auth.OAuth2(
      clientSecret.client_id,
      clientSecret.client_secret,
      clientSecret.redirect_uris[0]
    );

    oauth2Client.setCredentials(token);

    // Save refreshed token if refreshed
    oauth2Client.on('tokens', (newTokens) => {
      const updated = { ...token, ...newTokens };
      fs.writeFileSync('ga4_token.json', JSON.stringify(updated, null, 2));
    });

    const analyticsAdmin = google.analyticsadmin({ version: 'v1beta', auth: oauth2Client });
    const analyticsData = google.analyticsdata({ version: 'v1beta', auth: oauth2Client });

    console.log('Listing GA4 Account Summaries...');
    const accounts = await analyticsAdmin.accountSummaries.list();
    console.log('Account Summaries:', JSON.stringify(accounts.data, null, 2));

    let propertyId = null;
    if (accounts.data.accountSummaries) {
      for (const acc of accounts.data.accountSummaries) {
        if (acc.propertySummaries) {
          for (const prop of acc.propertySummaries) {
            console.log(`Found Property: ${prop.displayName} (${prop.property})`);
            propertyId = prop.property.replace('properties/', '');
          }
        }
      }
    }

    if (!propertyId) {
      console.log('No property found in account summary.');
      return;
    }

    console.log(`\n=== QUERYING GA4 PROPERTY: ${propertyId} ===`);

    // 1. Pages & User Behavior Report
    const pagesReport = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }, { name: 'sessionSourceMedium' }, { name: 'country' }, { name: 'city' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    console.log('\n--- PAGES & USER BEHAVIOR ---');
    console.log(JSON.stringify(pagesReport.data, null, 2));

    // 2. Events breakdown (What did they click or do)
    const eventsReport = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'eventName' }, { name: 'pagePath' }],
        metrics: [
          { name: 'eventCount' },
          { name: 'totalUsers' }
        ]
      }
    });

    console.log('\n--- EVENTS BREAKDOWN (SCROLLS, CLICKS, ENGAGEMENT) ---');
    console.log(JSON.stringify(eventsReport.data, null, 2));

  } catch (err) {
    console.error('Error querying GA4 API:', err.message);
    if (err.response && err.response.data) {
      console.error('Response data:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

run();
