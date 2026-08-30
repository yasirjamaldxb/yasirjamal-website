import https from 'https';

const competitors = [
  { name: 'Digital Gravity (#1 Agency)', url: 'https://www.digitalgravity.ae/' },
  { name: 'RedSpider (#2 Agency)', url: 'https://www.redspider.ae/' },
  { name: 'WebCastle (#3 Agency)', url: 'https://webcastle.ae/' },
  { name: 'Dubai Website Design', url: 'https://www.dubaiwebsitedesign.ae/' },
  { name: 'Atif Iqbal (Top Freelancer)', url: 'https://atif.ae/' },
  { name: 'Sajid Sulaiman (Top Freelancer)', url: 'https://sajidsulaiman.com/' }
];

async function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

async function auditH1s() {
  console.log('========================================================================');
  console.log('🔍 LIVE TOP 5 DUBAI COMPETITORS H1 & TITLE TAG AUDIT');
  console.log('========================================================================\n');

  for (const comp of competitors) {
    const html = await fetchPage(comp.url);
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : 'N/A';
    const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ') : 'N/A';

    console.log(`📌 ${comp.name}:`);
    console.log(`   URL:   ${comp.url}`);
    console.log(`   TITLE: ${title}`);
    console.log(`   H1:    ${h1}\n`);
  }
}

auditH1s().catch(console.error);
