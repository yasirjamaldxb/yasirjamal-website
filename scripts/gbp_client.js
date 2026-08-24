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
    console.error('API Status:', err.status || err.response?.status);
    console.error('API Error Details:', JSON.stringify(err.response?.data || err.message, null, 2));
  }
}

const command = process.argv[2] || 'list';
if (command === 'list') {
  listAccountsAndLocations().catch(console.error);
}
