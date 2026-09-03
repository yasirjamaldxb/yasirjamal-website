import { google } from 'googleapis';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

async function main() {
  console.log('--- STARTING CONVERSION METRICS CALCULATION ---');
  
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'gsc_credentials.json',
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });

    const searchconsole = google.searchconsole({
      version: 'v1',
      auth
    });

    const now = new Date();
    // GSC data usually has a 2-3 day lag for final settled data
    const endDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const startDate28 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const startDate90 = new Date(now.getTime() - 92 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const startDate7 = new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    console.log(`Querying GSC date ranges: 7d (${startDate7} to ${endDate}), 28d (${startDate28} to ${endDate}), 90d (${startDate90} to ${endDate})`);

    const queryRange = async (sDate, eDate) => {
      const res = await searchconsole.searchanalytics.query({
        siteUrl: 'sc-domain:yasirjamal.com',
        requestBody: {
          startDate: sDate,
          endDate: eDate,
          dimensions: ['date']
        }
      });
      const rows = res.data.rows || [];
      const clicks = rows.reduce((a, r) => a + r.clicks, 0);
      const impressions = rows.reduce((a, r) => a + r.impressions, 0);
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const avgPos = rows.length > 0 ? rows.reduce((a, r) => a + r.position, 0) / rows.length : 0;
      return { clicks, impressions, ctr, avgPos, days: rows.length };
    };

    const res7 = await queryRange(startDate7, endDate);
    const res28 = await queryRange(startDate28, endDate);
    const res90 = await queryRange(startDate90, endDate);

    console.log('\n======================================================');
    console.log('📈 ACCURATE GOOGLE SEARCH TRAFFIC METRICS (GSC)');
    console.log('======================================================');
    console.log(`[Last 7 Days]  : ${res7.clicks} clicks | ${res7.impressions} impressions | SERP CTR: ${res7.ctr.toFixed(2)}% | Avg Pos: ${res7.avgPos.toFixed(1)}`);
    console.log(`[Last 28 Days] : ${res28.clicks} clicks | ${res28.impressions} impressions | SERP CTR: ${res28.ctr.toFixed(2)}% | Avg Pos: ${res28.avgPos.toFixed(1)}`);
    console.log(`[Last 90 Days] : ${res90.clicks} clicks | ${res90.impressions} impressions | SERP CTR: ${res90.ctr.toFixed(2)}% | Avg Pos: ${res90.avgPos.toFixed(1)}`);

    // Top queries
    const topQueriesRes = await searchconsole.searchanalytics.query({
      siteUrl: 'sc-domain:yasirjamal.com',
      requestBody: {
        startDate: startDate28,
        endDate: endDate,
        dimensions: ['query'],
        rowLimit: 15
      }
    });

    console.log('\n🔍 TOP 10 SEARCH QUERIES (Last 28 Days):');
    (topQueriesRes.data.rows || []).slice(0, 10).forEach((r, i) => {
      console.log(`   ${i+1}. "${r.keys[0]}" -> ${r.clicks} clicks | ${r.impressions} imp | CTR: ${(r.ctr*100).toFixed(1)}% | Pos: ${r.position.toFixed(1)}`);
    });

    // Top landing pages
    const topPagesRes = await searchconsole.searchanalytics.query({
      siteUrl: 'sc-domain:yasirjamal.com',
      requestBody: {
        startDate: startDate28,
        endDate: endDate,
        dimensions: ['page'],
        rowLimit: 10
      }
    });

    console.log('\n📄 TOP LANDING PAGES (Last 28 Days):');
    (topPagesRes.data.rows || []).forEach((r, i) => {
      console.log(`   ${i+1}. ${r.keys[0]} -> ${r.clicks} clicks | ${r.impressions} imp`);
    });

  } catch (err) {
    console.error('Error during metrics execution:', err);
  }
}

main();
