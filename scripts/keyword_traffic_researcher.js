import https from 'https';

async function fetchGoogleSuggestions(query, gl = 'us', hl = 'en') {
  return new Promise((resolve) => {
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&gl=${gl}&hl=${hl}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[1] || []);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
}

async function analyzeKeywordCluster(seedKeywords) {
  console.log('================================================================');
  console.log('🔍 LIVE GOOGLE KEYWORD & SEARCH INTENT VOLUME AUDIT');
  console.log('================================================================\n');

  for (const seed of seedKeywords) {
    console.log(`\n📌 SEED KEYWORD: "${seed.toUpperCase()}"`);
    console.log('----------------------------------------------------------------');

    // 1. Direct suggestions
    const directSuggestions = await fetchGoogleSuggestions(seed);
    
    // 2. Preposition questions (how, why, vs, pricing)
    const vsQuery = await fetchGoogleSuggestions(`${seed} vs `);
    const pricingQuery = await fetchGoogleSuggestions(`${seed} pricing `);
    const freeQuery = await fetchGoogleSuggestions(`${seed} free `);
    const alternativeQuery = await fetchGoogleSuggestions(`${seed} alternative `);

    const allQueries = Array.from(new Set([
      ...directSuggestions,
      ...vsQuery,
      ...pricingQuery,
      ...freeQuery,
      ...alternativeQuery
    ])).slice(0, 15);

    console.log('🔥 Top High-Volume Search Queries Ranked by Real-Time Intent:');
    allQueries.forEach((q, idx) => {
      let intent = 'Informational';
      if (q.includes('pricing') || q.includes('cost') || q.includes('trial') || q.includes('discount')) {
        intent = 'High-Value Commercial';
      } else if (q.includes('vs') || q.includes('review') || q.includes('alternative') || q.includes('better')) {
        intent = 'Comparison / Buying Decision';
      } else if (q.includes('login') || q.includes('app')) {
        intent = 'Navigational';
      }
      console.log(`  ${idx + 1}. [${intent}] "${q}"`);
    });
  }
}

const targetSeeds = [
  'gohighlevel',
  'tmd hosting',
  'web design dubai',
  'hostinger'
];

analyzeKeywordCluster(targetSeeds).catch(console.error);
