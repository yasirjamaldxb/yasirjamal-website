import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/business.manage']
});

async function testDirectInformationAPI() {
  const client = await auth.getClient();
  console.log('Testing My Business Business Information API directly...');
  try {
    const res = await client.request({
      url: 'https://mybusinessbusinessinformation.googleapis.com/v1/categories?regionCode=AE&languageCode=en&pageSize=5'
    });
    console.log('✅ Business Information API is Active & Working! Categories Sample:');
    console.table(res.data.categories?.map(c => ({ Name: c.name, DisplayName: c.displayName })));
  } catch (err) {
    console.error('❌ Error on Business Information API:', err.status || err.response?.status, JSON.stringify(err.response?.data || err.message, null, 2));
  }
}

testDirectInformationAPI();
