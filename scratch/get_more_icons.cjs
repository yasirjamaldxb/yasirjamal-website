const https = require('https');
const fs = require('fs');

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
  const slugs = ['github', 'nodedotjs'];
  for (const s of slugs) {
    const res = await fetchIcon(s);
    console.log(s, res.svg);
  }
}

run();
