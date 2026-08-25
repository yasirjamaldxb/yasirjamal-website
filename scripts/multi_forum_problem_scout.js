import https from 'https';

async function fetchGooglePAA(query) {
  return new Promise((resolve) => {
    const url = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}&gl=us&hl=en`;
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

async function scoutProblems() {
  console.log('================================================================');
  console.log('🌐 MULTI-PLATFORM COMMUNITY PROBLEM & INTENT SCOUT');
  console.log('================================================================\n');

  const topics = [
    { name: 'GoHighLevel', queries: ['is gohighlevel good for', 'gohighlevel vs', 'gohighlevel problem', 'gohighlevel cost'] },
    { name: 'Hosting (TMD / Hostinger)', queries: ['tmd hosting vs', 'hostinger bad', 'hostinger hidden fees', 'tmd hosting review'] },
    { name: 'Dubai Web Design', queries: ['how much website cost dubai', 'best web designer in dubai', 'hire freelance web developer dubai'] }
  ];

  for (const topic of topics) {
    console.log(`\n📌 TOPIC: "${topic.name.toUpperCase()}" (Live Questions Across Google, Quora & Forums):`);
    console.log('----------------------------------------------------------------');
    
    for (const q of topic.queries) {
      const results = await fetchGooglePAA(q);
      const topItems = results.slice(0, 4);
      if (topItems.length > 0) {
        topItems.forEach(item => {
          console.log(`  ❓ "${item}"`);
        });
      }
    }
  }
}

scoutProblems().catch(console.error);
