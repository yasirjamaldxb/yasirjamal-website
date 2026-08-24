import { google } from 'googleapis';
import fs from 'fs';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/business.manage']
});

const postPayload = {
  languageCode: 'en-US',
  summary: `Fast, clean websites built to turn visitors into paying clients.\n\nBased in Dubai Media City, I design and build high-performance custom websites for companies across Dubai (DIFC, Business Bay, Downtown, Marina) and Abu Dhabi.\n\nWhat you get:\n• Custom UI/UX design in Figma from scratch\n• Lightning-fast loading speed (under 1 second on mobile)\n• English and Arabic layouts done right\n• E-commerce setups with local UAE payment gateways (Stripe, Telr, Tabby, Tamara)\n• Built-in technical SEO so Google ranks your pages\n\nYou work directly with me — a senior designer and developer with 15+ years in the industry. No junior account managers, no delays.\n\nCheck out recent work: https://yasirjamal.com/`,
  callToAction: {
    actionType: 'LEARN_MORE',
    url: 'https://yasirjamal.com/'
  },
  topicType: 'STANDARD'
};

async function publishPost() {
  const client = await auth.getClient();
  console.log('🔍 Connecting to Google My Business Local Posts API...\n');

  try {
    // 1. Fetch Accounts
    const accRes = await client.request({
      url: 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts'
    });

    const accounts = accRes.data.accounts || [];
    if (!accounts.length) {
      console.log('No GBP accounts found for this service account.');
      return;
    }

    for (const account of accounts) {
      console.log(`Checking account: ${account.name}`);
      const locRes = await client.request({
        url: `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title`
      });

      const locations = locRes.data.locations || [];
      for (const loc of locations) {
        console.log(`📍 Publishing post to location: ${loc.title} (${loc.name})...`);
        const postRes = await client.request({
          url: `https://mybusiness.googleapis.com/v4/${loc.name}/localPosts`,
          method: 'POST',
          data: postPayload
        });
        console.log('✅ Post successfully published on Google Business Profile!');
        console.log(postRes.data);
      }
    }
  } catch (err) {
    console.error('API Error:', err.status || err.response?.status, err.response?.data || err.message);
  }
}

publishPost();
