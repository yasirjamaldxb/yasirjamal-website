import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters', 'https://www.googleapis.com/auth/webmasters.readonly']
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

const urlsToInspect = [
  'https://yasirjamal.com/',
  'https://yasirjamal.com/blog/',
  'https://yasirjamal.com/blog/tmd-hosting-review/',
  'https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/',
  'https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/',
  'https://yasirjamal.com/blog/speed-up-gohighlevel-funnels-custom-css-guide/',
  'https://yasirjamal.com/blog/gohighlevel-for-real-estate-agents-review/',
  'https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/',
  'https://yasirjamal.com/blog/astro-vs-wordpress-speed-performance-guide/'
];

async function inspectUrls() {
  console.log('========================================================');
  console.log('🔍 GOOGLE SEARCH CONSOLE - URL INSPECTION & CRAWL STATUS');
  console.log('========================================================\n');

  for (const url of urlsToInspect) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: 'sc-domain:yasirjamal.com'
        }
      });
      const result = res.data.inspectionResult;
      const indexStatus = result.indexStatusResult;
      console.log(`📄 URL: ${url}`);
      console.log(`   - Coverage State: ${indexStatus.coverageState}`);
      console.log(`   - Verdict: ${indexStatus.verdict}`);
      console.log(`   - Indexing State: ${indexStatus.indexingState}`);
      console.log(`   - Last Crawl Time: ${indexStatus.lastCrawlTime || 'Never crawled yet'}`);
      console.log(`   - Crawled As: ${indexStatus.crawledAs || 'N/A'}`);
      console.log(`   - Page Fetch State: ${indexStatus.pageFetchState || 'N/A'}`);
      console.log(`   - Canonical: ${indexStatus.userCanonical || indexStatus.googleCanonical || 'N/A'}`);
      console.log('--------------------------------------------------------');
    } catch (e) {
      console.log(`❌ Error inspecting ${url}: ${e.message}`);
    }
  }
}

inspectUrls().catch(console.error);
