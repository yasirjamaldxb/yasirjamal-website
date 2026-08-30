import { google } from 'googleapis';
import fs from 'fs';

const creds = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;
const token = JSON.parse(fs.readFileSync('gbp_token.json', 'utf8'));

const oauth2Client = new google.auth.OAuth2(
  creds.client_id,
  creds.client_secret,
  'http://localhost:3000/oauth2callback'
);
oauth2Client.setCredentials(token);

async function fetchGbpDetails() {
  console.log('========================================================');
  console.log('📍 GOOGLE BUSINESS PROFILE LIVE AUDIT');
  console.log('========================================================\n');

  try {
    const mybusinessAccount = google.mybusinessaccountmanagement({ version: 'v1', auth: oauth2Client });
    const accountsRes = await mybusinessAccount.accounts.list();

    console.log('🏢 ACCOUNTS FOUND:');
    console.log(JSON.stringify(accountsRes.data, null, 2));

    if (!accountsRes.data.accounts || accountsRes.data.accounts.length === 0) {
      console.log('No Google Business accounts returned.');
      return;
    }

    for (const account of accountsRes.data.accounts) {
      console.log(`\n--------------------------------------------------------`);
      console.log(`Account: ${account.accountName} (${account.name})`);
      console.log(`Type: ${account.type} | Verification State: ${account.verificationState}`);

      try {
        const mybusinessBusiness = google.mybusinessbusinessinformation({ version: 'v1', auth: oauth2Client });
        const locationsRes = await mybusinessBusiness.accounts.locations.list({
          parent: account.name,
          readMask: 'name,title,storefrontAddress,websiteUri,phoneNumbers,categories,regularHours,specialHours,serviceArea,profile,relationshipData,metadata'
        });

        console.log('\n📍 LOCATIONS FOUND:');
        console.log(JSON.stringify(locationsRes.data, null, 2));

      } catch (locErr) {
        console.log(`ℹ️ Business Information API Note: ${locErr.message}`);
      }
    }

  } catch (err) {
    console.error('❌ Error fetching Google Business Profile:', err.message);
  }

  console.log('\n========================================================');
}

fetchGbpDetails().catch(console.error);
