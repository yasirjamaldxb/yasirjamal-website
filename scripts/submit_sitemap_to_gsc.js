import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function submit() {
  console.log('Submitting updated sitemap to GSC...');
  await sc.sitemaps.submit({
    siteUrl: 'sc-domain:yasirjamal.com',
    feedpath: 'https://yasirjamal.com/sitemap.xml'
  });
  console.log('✅ Successfully submitted https://yasirjamal.com/sitemap.xml to Google Search Console!');
}

submit().catch(console.error);
