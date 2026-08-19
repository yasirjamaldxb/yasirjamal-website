import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const sites = [
  { slug: 'julphar', url: 'https://www.julphar.net/' },
  { slug: 'abayadore', url: 'https://abayadore.com/' },
  { slug: 'prime-middle-east', url: 'https://primemiddle-east.com/' },
  { slug: 'hunza-global', url: 'https://hunzaglobal.com/' },
  { slug: 'markwilliams', url: 'https://markwilliams.ae/' },
  { slug: 'fila-tech', url: 'https://fila-tech.store/' },
  { slug: 'alston-clayden', url: 'https://alstonclayden.com/' },
  { slug: 'alomaids', url: 'https://alomaids.com/' },
  { slug: 'westminster-properties', url: 'https://westminsterproperties.ae/' },
  { slug: 'skylynx', url: 'https://skylynx.ae/' },
  { slug: 'dubai-podiatrist', url: 'https://dubaipodiatrist.com/' },
  { slug: 'noor-abu-dhabi', url: 'https://noorabudhabi.com/' },
  { slug: 'baanpaa', url: 'https://baanpaa.com/' }
];

async function analyze() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const results = {};

  for (const site of sites) {
    console.log(`Analyzing ${site.slug} (${site.url})...`);
    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      );
      
      let serverHeader = '';
      page.on('response', response => {
        if (response.url() === site.url || response.url() === site.url.replace(/\/$/, '')) {
          serverHeader = response.headers()['server'] || '';
        }
      });

      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 35000 }).catch(() => {});
      
      const data = await page.evaluate(() => {
        const title = document.title || '';
        const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.innerText.trim()).filter(Boolean);
        const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.innerText.trim()).slice(0, 8);
        const bodySnippet = document.body.innerText.replace(/\s+/g, ' ').slice(0, 1500);
        return { title, metaDesc, h1s, h2s, bodySnippet };
      });

      results[site.slug] = { ...data, serverHeader, url: site.url };
      console.log(`✓ Got info for ${site.slug}: ${data.title}`);
      await page.close();
    } catch (e) {
      console.error(`Error on ${site.slug}:`, e.message);
    }
  }

  await browser.close();
  import('fs').then(fs => {
    fs.writeFileSync('scratch/business_data.json', JSON.stringify(results, null, 2));
    console.log('Saved to scratch/business_data.json');
  });
}

analyze();
