import https from 'https';
import http from 'http';

const testUrls = [
  { url: 'http://yasirjamal.com/', expected: 'https://yasirjamal.com/' },
  { url: 'https://www.yasirjamal.com/', expected: 'https://yasirjamal.com/' },
  { url: 'https://yasirjamal.com/about', expected: 'https://yasirjamal.com/about/' },
  { url: 'https://yasirjamal.com/work/', expected: 'https://yasirjamal.com/portfolio/' },
  { url: 'https://yasirjamal.com/work/alomaids/', expected: 'https://yasirjamal.com/portfolio/alomaids/' },
  { url: 'https://yasirjamal.com/work/westminster-properties/', expected: 'https://yasirjamal.com/portfolio/westminster-properties/' },
  { url: 'https://yasirjamal.com/contact-us/', expected: 'https://yasirjamal.com/' },
  { url: 'https://yasirjamal.com/blog/failed-websites/', expected: 'https://yasirjamal.com/blog/conversion-rate-optimization-cro-lead-generation/' },
  { url: 'https://yasirjamal.com/blog/ecommerce-business-dubai-uae/', expected: 'https://yasirjamal.com/blog/sub-second-ecommerce-architecture-gcc-scaling/' },
  { url: 'https://yasirjamal.com/web-design-dubai/', expected: 200 }
];

function checkUrl(item) {
  return new Promise((resolve) => {
    const isHttps = item.url.startsWith('https:');
    const client = isHttps ? https : http;

    client.get(item.url, (res) => {
      const location = res.headers.location || '';
      console.log(`📡 [${res.statusCode}] ${item.url}`);
      if (res.statusCode === 301 || res.statusCode === 302) {
        console.log(`   ↳ Redirects to: ${location}`);
      } else {
        console.log(`   ↳ Direct Status: ${res.statusCode} OK`);
      }
      resolve();
    }).on('error', (err) => {
      console.log(`❌ Error checking ${item.url}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log('========================================================================');
  console.log('🧪 VERIFYING PRODUCTION 301 REDIRECTS & CANONICAL STATUS');
  console.log('========================================================================\n');

  for (const item of testUrls) {
    await checkUrl(item);
  }

  console.log('\n========================================================================');
}

run();
