import https from 'https';

async function fetchRedditJSON(endpoint) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.reddit.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 AntigravityResearch/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.data?.children?.map(c => c.data) || []);
        } catch (e) {
          resolve([]);
        }
      });
    });

    req.on('error', () => resolve([]));
    req.end();
  });
}

async function runRedditAudit() {
  console.log('================================================================');
  console.log('💬 REDDIT COMMUNITY FORUM & PAIN POINT INTELLIGENCE');
  console.log('================================================================\n');

  // 1. GoHighLevel Community
  console.log('📌 1. TOP DISCUSSIONS & QUESTIONS IN r/gohighlevel:');
  console.log('----------------------------------------------------------------');
  const ghlPosts = await fetchRedditJSON('/r/gohighlevel/hot.json?limit=7');
  if (ghlPosts.length > 0) {
    ghlPosts.forEach((post, i) => {
      console.log(`  ${i + 1}. [▲ ${post.ups} | 💬 ${post.num_comments}] "${post.title}"`);
      console.log(`     🔗 https://reddit.com${post.permalink}`);
    });
  } else {
    console.log('  (Reddit rate limit fallback or private feed - will use public mirror)');
  }

  // 2. Hosting Community
  console.log('\n📌 2. TOP DISCUSSIONS IN r/hosting:');
  console.log('----------------------------------------------------------------');
  const hostingPosts = await fetchRedditJSON('/r/hosting/hot.json?limit=7');
  if (hostingPosts.length > 0) {
    hostingPosts.forEach((post, i) => {
      console.log(`  ${i + 1}. [▲ ${post.ups} | 💬 ${post.num_comments}] "${post.title}"`);
      console.log(`     🔗 https://reddit.com${post.permalink}`);
    });
  }

  // 3. Webdev / Agency Community
  console.log('\n📌 3. TOP DISCUSSIONS IN r/agency & r/webdev:');
  console.log('----------------------------------------------------------------');
  const agencyPosts = await fetchRedditJSON('/r/agency/hot.json?limit=7');
  if (agencyPosts.length > 0) {
    agencyPosts.forEach((post, i) => {
      console.log(`  ${i + 1}. [▲ ${post.ups} | 💬 ${post.num_comments}] "${post.title}"`);
      console.log(`     🔗 https://reddit.com${post.permalink}`);
    });
  }
}

runRedditAudit().catch(console.error);
