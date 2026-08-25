import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function showAll() {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const queryRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 100
    }
  });

  const rows = (queryRes.data.rows || [])
    .sort((a, b) => (a.position || 100) - (b.position || 100))
    .map(r => ({
      Query: r.keys[0],
      Pos: r.position?.toFixed(1),
      Clicks: r.clicks,
      Impr: r.impressions,
      CTR: ((r.ctr || 0) * 100).toFixed(1) + '%'
    }));

  console.log(JSON.stringify(rows, null, 2));
}

showAll().catch(console.error);
