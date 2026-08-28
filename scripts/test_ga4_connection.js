import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/analytics.readonly', 'https://www.googleapis.com/auth/analytics']
});

const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });
const analyticsadmin = google.analyticsadmin({ version: 'v1beta', auth });

async function testGA4() {
  console.log('========================================================');
  console.log('📊 GOOGLE ANALYTICS 4 (GA4) API CONNECTION TEST');
  console.log('========================================================\n');

  try {
    console.log('Listing accessible GA4 account summaries...');
    const res = await analyticsadmin.accountSummaries.list();
    const summaries = res.data.accountSummaries;
    if (summaries && summaries.length > 0) {
      console.log(`✅ Found ${summaries.length} GA4 account(s):`);
      summaries.forEach((acc) => {
        console.log(`   - Account: ${acc.displayName} (${acc.name})`);
        if (acc.propertySummaries) {
          acc.propertySummaries.forEach((prop) => {
            console.log(`     └─ Property: ${prop.displayName} (Property ID: ${prop.property})`);
          });
        }
      });
    } else {
      console.log('ℹ️ No GA4 properties found for this service account yet.');
      const clientEmail = JSON.parse(fs.readFileSync('gsc_credentials.json', 'utf8')).client_email;
      console.log(`To grant API access, add this email to your Google Analytics Property Access Management:`);
      console.log(`👉 ${clientEmail} (Role: Viewer)`);
    }
  } catch (e) {
    console.log(`ℹ️ GA4 Admin API response: ${e.message}`);
    const clientEmail = JSON.parse(fs.readFileSync('gsc_credentials.json', 'utf8')).client_email;
    console.log(`\nTo allow direct GA4 API reporting, add this service account email to your Google Analytics (Admin > Property Access Management):`);
    console.log(`👉 ${clientEmail} (Role: Viewer)`);
  }
}

testGA4().catch(console.error);
