import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  keyFile: 'gsc_credentials.json',
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
});

const sc = google.searchconsole({ version: 'v1', auth });

const blogUrls = [
  'https://yasirjamal.com/blog/',
  'https://yasirjamal.com/blog/tmd-hosting-review/',
  'https://yasirjamal.com/blog/gohighlevel-30-day-free-trial-agency-setup-guide/',
  'https://yasirjamal.com/blog/speed-up-gohighlevel-funnels-custom-css-guide/',
  'https://yasirjamal.com/blog/astro-vs-wordpress-speed-performance-guide/',
  'https://yasirjamal.com/blog/hiring-freelance-web-designer-vs-agency-dubai/',
  'https://yasirjamal.com/blog/modern-web-design-trends-2026/',
  'https://yasirjamal.com/blog/conversion-rate-optimization-cro-lead-generation/',
  'https://yasirjamal.com/blog/gohighlevel-hidden-costs-pricing-calculator/',
  'https://yasirjamal.com/blog/gohighlevel-for-real-estate-agents-review/',
  'https://yasirjamal.com/blog/what-is-webmcp-agentic-web-design-guide/',
  'https://yasirjamal.com/blog/sub-second-ecommerce-architecture-gcc-scaling/',
  'https://yasirjamal.com/blog/dubai-technical-seo-audit-ranking-guide/',
  'https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/'
];

async function inspectAllBlogs() {
  console.log('========================================================');
  console.log('🔍 LIVE GOOGLE SEARCH CONSOLE URL INSPECTION AUDIT');
  console.log('========================================================\n');

  for (const url of blogUrls) {
    try {
      const res = await sc.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: 'sc-domain:yasirjamal.com'
        }
      });

      const idx = res.data.inspectionResult.indexStatusResult;
      const verdict = idx.verdict || 'UNKNOWN';
      const coverage = idx.coverageState || 'UNKNOWN';
      const lastCrawl = idx.lastCrawlTime ? idx.lastCrawlTime.split('T')[0] : 'Never';
      const indexingState = idx.indexingState || 'UNKNOWN';

      console.log(`[${verdict === 'PASS' ? '✅ PASS' : '⏳ ' + verdict}] ${url.replace('https://yasirjamal.com/blog/', '') || 'blog/'}`);
      console.log(`      Coverage: ${coverage}`);
      console.log(`      Last Crawled: ${lastCrawl} | Indexing State: ${indexingState}\n`);
    } catch (e) {
      console.log(`❌ ${url}: ${e.message}\n`);
    }
  }

  console.log('========================================================');
}

inspectAllBlogs().catch(console.error);
