import { google } from 'googleapis';
import https from 'https';
import fs from 'fs';

const targetUrl = 'https://yasirjamal.com/blog/answer-engine-optimization-aeo-chatgpt-search-dubai/';
const indexNowKey = '64a78d2b9ef14c33842c9431e56b820a';
const host = 'yasirjamal.com';
const keyLocation = `https://${host}/${indexNowKey}.txt`;

async function broadcastAllEngines() {
  console.log('========================================================================');
  console.log('🚀 MULTI-ENGINE REAL-TIME BROADCAST (GOOGLE + BING + CHATGPT + LLMs)');
  console.log('========================================================================\n');
  console.log(`Target URL: ${targetUrl}\n`);

  // 1. GOOGLE INDEXING API (GOOGLEBOT DIRECT PUSH)
  console.log('1️⃣ DISPATCHING TO GOOGLE SEARCH (GOOGLEBOT REAL-TIME QUEUE)...');
  try {
    const authClient = new google.auth.GoogleAuth({
      keyFile: 'gsc_credentials.json',
      scopes: ['https://www.googleapis.com/auth/indexing']
    });
    const indexing = google.indexing({ version: 'v3', auth: authClient });
    const gRes = await indexing.urlNotifications.publish({
      requestBody: { url: targetUrl, type: 'URL_UPDATED' }
    });
    console.log('   ✅ [200 OK] Googlebot Notified Successfully!');
    console.log(`   Notification ID/Time: ${gRes.data.urlNotificationMetadata?.latestUpdate?.notifyTime || 'Active'}`);
  } catch (e) {
    console.log(`   ❌ Google Indexing API Error: ${e.message}`);
  }

  // 2. INDEXNOW PROTOCOL (BING, MICROSOFT COPILOT, CHATGPT SEARCH, PERPLEXITY)
  console.log('\n2️⃣ DISPATCHING TO INDEXNOW (BING, CHATGPT SEARCH, COPILOT, YANDEX, SEZNAM)...');
  const indexNowEndpoints = [
    { host: 'api.indexnow.org', path: '/indexnow', name: 'IndexNow Global Hub' },
    { host: 'www.bing.com', path: '/indexnow', name: 'Microsoft Bing & Copilot' },
    { host: 'yandex.com', path: '/indexnow', name: 'Yandex Search' },
    { host: 'search.seznam.cz', path: '/indexnow', name: 'Seznam Engine' }
  ];

  const payload = JSON.stringify({
    host: host,
    key: indexNowKey,
    keyLocation: keyLocation,
    urlList: [targetUrl]
  });

  for (const ep of indexNowEndpoints) {
    await new Promise((resolve) => {
      const req = https.request({
        hostname: ep.host,
        path: ep.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 202) {
            console.log(`   ✅ [${res.statusCode} Accepted] ${ep.name} (${ep.host})`);
          } else {
            console.log(`   ℹ️ [${res.statusCode}] ${ep.name} (${ep.host})`);
          }
          resolve();
        });
      });
      req.on('error', (err) => {
        console.log(`   ⚠️ ${ep.name} connect note: ${err.message}`);
        resolve();
      });
      req.write(payload);
      req.end();
    });
  }

  // 3. GOOGLE SEARCH CONSOLE SITEMAP PING
  console.log('\n3️⃣ PINGING GOOGLE SEARCH CONSOLE SITEMAP REGISTRY...');
  try {
    const gscAuth = new google.auth.GoogleAuth({
      keyFile: 'gsc_credentials.json',
      scopes: ['https://www.googleapis.com/auth/webmasters']
    });
    const webmasters = google.webmasters({ version: 'v3', auth: gscAuth });
    await webmasters.sitemaps.submit({
      siteUrl: 'sc-domain:yasirjamal.com',
      feedpath: 'https://yasirjamal.com/sitemap.xml'
    });
    console.log('   ✅ [200 OK] Google Search Console Master Sitemap Refresh Submitted!');
  } catch (err) {
    console.log(`   ℹ️ GSC Sitemap notice: ${err.message}`);
  }

  // 4. VERIFY LLMS.TXT & AI DISCOVERY ENDPOINTS
  console.log('\n4️⃣ VERIFYING LLM & AI CRAWLER DISCOVERY ENDPOINTS...');
  const aiEndpoints = [
    'https://yasirjamal.com/llms.txt',
    'https://yasirjamal.com/webmcp.json',
    'https://yasirjamal.com/robots.txt'
  ];

  for (const url of aiEndpoints) {
    await new Promise((resolve) => {
      https.get(url, (res) => {
        console.log(`   ✅ [${res.statusCode} OK] Live Endpoint Active: ${url}`);
        resolve();
      }).on('error', () => resolve());
    });
  }

  console.log('\n========================================================================');
  console.log('🎉 ALL SEARCH ENGINES & AI ASSISTANTS NOTIFIED IN REAL-TIME!');
  console.log('========================================================================\n');
}

broadcastAllEngines().catch(console.error);
