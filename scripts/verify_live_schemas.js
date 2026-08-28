import https from 'https';

const testUrls = [
  'https://yasirjamal.com/portfolio/markwilliams/',
  'https://yasirjamal.com/portfolio/alston-clayden/',
  'https://yasirjamal.com/blog/generative-engine-optimization-geo-ai-search/',
  'https://yasirjamal.com/blog/hiring-freelance-web-designer-vs-agency-dubai/',
  'https://yasirjamal.com/blog/modern-web-design-trends-2026/'
];

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
        const scriptCount = matches ? matches.length : 0;
        let validJson = true;
        let blogPostingsCount = 0;

        if (matches) {
          matches.forEach(m => {
            try {
              const raw = m.replace(/<\/?script[^>]*>/gi, '');
              const obj = JSON.parse(raw);
              const nodes = obj['@graph'] ? obj['@graph'] : [obj];
              nodes.forEach(n => {
                if (n['@type'] === 'BlogPosting') blogPostingsCount++;
              });
            } catch (e) {
              validJson = false;
            }
          });
        }

        resolve({
          url,
          status: res.statusCode,
          scriptCount,
          validJson,
          blogPostingsCount
        });
      });
    });
  });
}

async function run() {
  console.log('Testing live URLs on yasirjamal.com...');
  for (const u of testUrls) {
    const res = await checkUrl(u);
    console.log(`[${res.status}] ${u} -> Script Tags: ${res.scriptCount} | Valid JSON: ${res.validJson} | BlogPosting Count: ${res.blogPostingsCount}`);
  }
}

run().catch(console.error);
