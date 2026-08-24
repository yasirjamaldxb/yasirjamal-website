import { google } from 'googleapis';
import fs from 'fs';

const CREDENTIALS_PATH = 'gsc_credentials.json';

function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error('❌ Credentials file not found at gsc_credentials.json');
    process.exit(1);
  }

  return new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: [
      'https://www.googleapis.com/auth/business.manage'
    ]
  });
}

export async function listAccountsAndLocations() {
  const auth = getAuthClient();
  const client = await auth.getClient();

  console.log('🔍 Connecting to Google Business Profile API...\n');

  try {
    const res = await client.request({
      url: 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts'
    });

    const accounts = res.data.accounts || [];
    console.log(`Found ${accounts.length} Google Business accounts:\n`);
    console.table(accounts);

    for (const account of accounts) {
      console.log(`\n📍 Fetching locations for account: ${account.name} (${account.accountName})...\n`);
      const locRes = await client.request({
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress,websiteUri,phoneNumbers,categories,regularHours`
      });

      const locations = locRes.data.locations || [];
      console.table(locations.map(loc => ({
        Name: loc.name,
        Title: loc.title,
        Address: loc.storefrontAddress?.addressLines?.join(', ') || loc.storefrontAddress?.locality,
        Website: loc.websiteUri,
        PrimaryCategory: loc.categories?.primaryCategory?.displayName
      })));
    }
  } catch (err) {
    if (err.message?.includes('API has not been used') || err.status === 403 || err.status === 404) {
      console.log('\n📌 Google Business Profile API requires enabling in your Google Cloud Project:');
      console.log('1. Go to Google Cloud Console (console.cloud.google.com).');
      console.log('2. Search for "My Business Business Information API" and "My Business Account Management API" and click Enable.');
      console.log('3. In Google Business Profile Manager (business.google.com), go to Settings > People and access > Add gsc-agent@gen-lang-client-0085760870.iam.gserviceaccount.com as Manager.\n');
    } else {
      console.error('Error querying Google Business Profile:', err.message);
    }
  }
}

const command = process.argv[2] || 'list';
if (command === 'list') {
  listAccountsAndLocations().catch(console.error);
}
