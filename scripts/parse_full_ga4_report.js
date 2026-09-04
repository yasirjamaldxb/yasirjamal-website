import fs from 'fs';
import https from 'https';

async function fetchAndPrintFullReport() {
  const token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));
  const accessToken = token.access_token;
  const propertyName = 'properties/453181827'; // GA4 Property ID

  // 1. Overview Totals
  const totals = await queryGA4(accessToken, propertyName, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'engagementRate' }
    ]
  });

  // 2. Traffic Sources
  const sources = await queryGA4(accessToken, propertyName, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' }
    ],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
  });

  // 3. Top Geographic Locations
  const geo = await queryGA4(accessToken, propertyName, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }, { name: 'city' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'averageSessionDuration' }
    ],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
    limit: 20
  });

  // 4. Pages Viewed & Time on Page
  const pages = await queryGA4(accessToken, propertyName, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'userEngagementDuration' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' }
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20
  });

  // 5. Events / Actions
  const events = await queryGA4(accessToken, propertyName, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [
      { name: 'eventCount' },
      { name: 'totalUsers' }
    ],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }]
  });

  console.log('=== GA4 EXECUTIVE DATA DUMP ===');
  console.log(JSON.stringify({ totals, sources, geo, pages, events }, null, 2));
}

function queryGA4(accessToken, propertyName, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = https.request(`https://analyticsdata.googleapis.com/v1beta/${propertyName}:runReport`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

fetchAndPrintFullReport();
