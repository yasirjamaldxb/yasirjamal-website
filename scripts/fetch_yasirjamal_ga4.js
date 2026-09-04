import fs from 'fs';
import https from 'https';

async function fetchFullGA4() {
  const token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));
  const accessToken = token.access_token;
  const propertyId = 'properties/298105942';

  console.log(`Fetching live Google Analytics 4 data for ${propertyId}...`);

  // 1. Overall Traffic Totals (Past 30 Days)
  const totals = await query(accessToken, propertyId, {
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

  // 2. Traffic Acquisition Sources & Mediums
  const sources = await query(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'sessionSourceMedium' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' }
    ],
    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
  });

  // 3. Top Pages Visited & Average Time on Page
  const pages = await query(accessToken, propertyId, {
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
    limit: 25
  });

  // 4. Geographic Location (Countries & Cities)
  const geo = await query(accessToken, propertyId, {
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

  // 5. Events / Actions (What did visitors click or do)
  const events = await query(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [
      { name: 'eventCount' },
      { name: 'totalUsers' }
    ],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }]
  });

  // 6. Device Categories (Mobile vs Desktop)
  const devices = await query(accessToken, propertyId, {
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [
      { name: 'activeUsers' },
      { name: 'sessions' },
      { name: 'screenPageViews' }
    ]
  });

  fs.writeFileSync('ga4_live_report_output.json', JSON.stringify({ totals, sources, pages, geo, events, devices }, null, 2));
  console.log('Saved report to ga4_live_report_output.json');
}

function query(accessToken, propertyId, body) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body);
    const req = https.request(`https://analyticsdata.googleapis.com/v1beta/${propertyId}:runReport`, {
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

fetchFullGA4();
