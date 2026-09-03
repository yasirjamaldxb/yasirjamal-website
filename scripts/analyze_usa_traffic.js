import { google } from 'googleapis';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

const searchconsole = google.searchconsole({
  version: 'v1',
  auth
});

async function analyzeUSATraffic() {
  console.log('========================================================================');
  console.log('🇺🇸 DEEP DIVE: USA TRAFFIC & VISITOR INTENT ANALYSIS');
  console.log('========================================================================\n');

  const now = new Date();
  const endDate = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. USA Landing Pages
  const pagesRes = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: 'country',
              operator: 'equals',
              expression: 'usa'
            }
          ]
        }
      ],
      rowLimit: 25
    }
  });

  console.log('📄 WHAT PAGES ARE USA VISITORS LANDING ON?');
  const pages = pagesRes.data.rows || [];
  if (pages.length === 0) {
    console.log('   No specific page impressions found for USA filter.');
  } else {
    pages.forEach(p => {
      console.log(`   • ${p.keys[0]}`);
      console.log(`     -> Clicks: ${p.clicks} | Impressions: ${p.impressions} | CTR: ${(p.ctr * 100).toFixed(2)}% | Avg Pos: ${p.position.toFixed(1)}`);
    });
  }

  // 2. USA Search Queries
  const queryRes = await searchconsole.searchanalytics.query({
    siteUrl: 'sc-domain:yasirjamal.com',
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: 'country',
              operator: 'equals',
              expression: 'usa'
            }
          ]
        }
      ],
      rowLimit: 25
    }
  });

  console.log('\n🔍 WHAT ARE USA USERS SEARCHING FOR?');
  const queries = queryRes.data.rows || [];
  if (queries.length === 0) {
    console.log('   No specific query impressions found for USA filter.');
  } else {
    queries.forEach(q => {
      console.log(`   • "${q.keys[0]}"`);
      console.log(`     -> Clicks: ${q.clicks} | Impressions: ${q.impressions} | CTR: ${(q.ctr * 100).toFixed(2)}% | Avg Pos: ${q.position.toFixed(1)}`);
    });
  }

  console.log('\n========================================================================');
}

analyzeUSATraffic().catch(console.error);
