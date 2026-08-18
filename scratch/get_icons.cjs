const https = require('https');
const fs = require('fs');

const icons = [
  'figma',
  'astro',
  'nextdotjs',
  'react',
  'typescript',
  'tailwindcss',
  'webflow',
  'wordpress',
  'openai',
  'shopify',
  'hubspot',
  'supabase',
  'vercel',
  'amplitude',
  'stripe',
  'googleanalytics',
  'apple',
  'notion',
  'twitch',
  'wise',
  'dropbox',
  'airbnb',
  'nike'
];

async function fetchIcon(slug) {
  return new Promise((resolve, reject) => {
    const url = `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ slug, svg: data }));
    }).on('error', reject);
  });
}

async function run() {
  const results = {};
  for (const slug of icons) {
    try {
      const res = await fetchIcon(slug);
      results[slug] = res.svg;
      console.log(`Fetched ${slug}`);
    } catch (e) {
      console.error(`Failed ${slug}`, e.message);
    }
  }
  fs.writeFileSync('./scratch/icons.json', JSON.stringify(results, null, 2));
  console.log('Done writing icons.json');
}

run();
