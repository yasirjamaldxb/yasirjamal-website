import https from 'https';

const urls = [
  'https://yasirjamal.com/favicon.ico',
  'https://yasirjamal.com/favicon-48x48.png',
  'https://yasirjamal.com/favicon-96x96.png',
  'https://yasirjamal.com/favicon-192x192.png',
  'https://yasirjamal.com/apple-touch-icon.png',
  'https://yasirjamal.com/favicon.svg',
  'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://yasirjamal.com&size=64',
  'https://www.google.com/s2/favicons?domain=yasirjamal.com&sz=128'
];

function fetchHeader(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let len = 0;
      res.on('data', chunk => len += chunk.length);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode,
          contentType: res.headers['content-type'],
          contentLength: len || res.headers['content-length']
        });
      });
    }).on('error', err => resolve({ url, error: err.message }));
  });
}

async function run() {
  console.log('Testing Favicon URLs & Google Favicon Cache Service...\n');
  for (const u of urls) {
    const res = await fetchHeader(u);
    console.log(`[${res.status}] ${u}`);
    console.log(`      Content-Type: ${res.contentType} | Size: ${res.contentLength} bytes\n`);
  }
}

run().catch(console.error);
