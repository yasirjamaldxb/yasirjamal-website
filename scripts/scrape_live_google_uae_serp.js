import https from 'https';

const queries = [
  'freelance web designer dubai',
  'web design dubai',
  'web designer dubai',
  'web developer dubai'
];

async function fetchGoogleSerp(query) {
  return new Promise((resolve) => {
    const encodedQuery = encodeURIComponent(query);
    // gl=ae (UAE country), hl=en (English), pws=0 (No personalized history), uule for Dubai
    const url = `https://www.google.ae/search?q=${encodedQuery}&gl=ae&hl=en&pws=0&num=30`;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-AE,en;q=0.9',
        'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
      }
    };

    https.get(url, options, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        resolve({ query, html, status: res.statusCode });
      });
    }).on('error', (err) => {
      resolve({ query, html: '', status: 500, error: err.message });
    });
  });
}

function parseSerpResults(html) {
  const results = [];
  // Match standard organic result links in Google SERP
  const regex = /<a href="(https?:\/\/[^"&?]+)"[^>]*><h3[^>]*>(.*?)<\/h3>/gi;
  let match;
  let rank = 1;

  while ((match = regex.exec(html)) !== null) {
    const link = match[1];
    const rawTitle = match[2].replace(/<[^>]+>/g, '');
    if (!link.includes('google.com') && !link.includes('google.ae') && !link.includes('youtube.com')) {
      results.push({
        rank: rank++,
        url: link,
        title: rawTitle
      });
    }
  }

  return results;
}

async function runLiveAudit() {
  console.log('========================================================================');
  console.log('🇦🇪 LIVE GOOGLE UAE (DUBAI GEO-TARGETED) REAL-TIME SERP AUDIT');
  console.log('========================================================================\n');

  for (const q of queries) {
    console.log(`🔎 SEARCHING LIVE GOOGLE.AE FOR: "${q}"...`);
    const { html, status } = await fetchGoogleSerp(q);

    if (status !== 200) {
      console.log(`   ⚠️ Google response status: ${status}\n`);
      continue;
    }

    const organicResults = parseSerpResults(html);

    if (organicResults.length === 0) {
      console.log('   (Bot verification triggered on raw fetch or zero links parsed)\n');
      continue;
    }

    console.log(`   Found ${organicResults.length} organic SERP listings:`);
    let found = false;

    organicResults.slice(0, 15).forEach(r => {
      const isYasir = r.url.includes('yasirjamal.com');
      const prefix = isYasir ? '👉 🌟 [YOU ARE HERE]' : '   ';
      console.log(`${prefix} #${r.rank.toString().padStart(2, ' ')} | ${r.title.substring(0, 45).padEnd(45, ' ')} | ${r.url}`);
      if (isYasir) found = true;
    });

    if (!found) {
      const yasirMatch = organicResults.find(r => r.url.includes('yasirjamal.com'));
      if (yasirMatch) {
        console.log(`\n   👉 🌟 [YOU ARE AT #${yasirMatch.rank}] | ${yasirMatch.url}`);
      } else {
        console.log(`\n   ℹ️ YasirJamal.com is outside the top ${organicResults.length} in this single immediate raw snapshot.`);
      }
    }

    console.log('\n────────────────────────────────────────────────────────────────────────\n');
  }
}

runLiveAudit().catch(console.error);
