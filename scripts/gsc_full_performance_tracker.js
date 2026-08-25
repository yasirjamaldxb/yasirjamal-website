import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters']
});

const sc = google.searchconsole({ version: 'v1', auth });

async function trackPerformance() {
  console.log('========================================================');
  console.log('📊 GOOGLE SEARCH CONSOLE - COMPREHENSIVE PERFORMANCE AUDIT');
  console.log('========================================================\n');

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. All Ranked Keywords
  const queryRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: 100
    }
  });

  console.log(`🎯 TOTAL RANKED QUERIES (${queryRes.data.rows?.length || 0} Keywords):`);
  const rankedQueries = (queryRes.data.rows || [])
    .sort((a, b) => (a.position || 100) - (b.position || 100))
    .map(r => ({
      Query: r.keys[0],
      Position: Number(r.position?.toFixed(1)),
      Clicks: r.clicks,
      Impressions: r.impressions,
      CTR: ((r.ctr || 0) * 100).toFixed(1) + '%'
    }));
  console.table(rankedQueries);

  // 2. Top Performing Pages
  const pageRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 25
    }
  });

  console.log('\n📄 TOP PAGES IN SEARCH:');
  console.table(pageRes.data.rows?.map(r => ({
    Page: r.keys[0].replace('https://yasirjamal.com', ''),
    Clicks: r.clicks,
    Impressions: r.impressions,
    AvgPosition: r.position?.toFixed(1),
    CTR: ((r.ctr || 0) * 100).toFixed(1) + '%'
  })));

  // 3. Country Performance
  const countryRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['country'],
      rowLimit: 20
    }
  });

  console.log('\n🌍 GEOGRAPHIC TRAFFIC BREAKDOWN:');
  console.table(countryRes.data.rows?.map(r => ({
    Country: r.keys[0].toUpperCase(),
    Clicks: r.clicks,
    Impressions: r.impressions,
    AvgPosition: r.position?.toFixed(1)
  })));

  // 4. Device Performance
  const deviceRes = await sc.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['device']
    }
  });

  console.log('\n📱 DEVICE BREAKDOWN:');
  console.table(deviceRes.data.rows?.map(r => ({
    Device: r.keys[0],
    Clicks: r.clicks,
    Impressions: r.impressions,
    CTR: ((r.ctr || 0) * 100).toFixed(1) + '%',
    AvgPosition: r.position?.toFixed(1)
  })));
}

trackPerformance().catch(console.error);
