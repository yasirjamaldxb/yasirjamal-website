import fs from 'fs';
import https from 'https';

async function refreshAndFetch() {
  try {
    const clientSecret = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;
    const token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));

    const postData = new URLSearchParams({
      client_id: clientSecret.client_id,
      client_secret: clientSecret.client_secret,
      refresh_token: token.refresh_token,
      grant_type: 'refresh_token'
    }).toString();

    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', async () => {
        console.log('Token Refresh Status:', res.statusCode);
        const tokenRes = JSON.parse(body);
        if (tokenRes.access_token) {
          token.access_token = tokenRes.access_token;
          fs.writeFileSync('ga4_token.json', JSON.stringify(token, null, 2));
          console.log('Access token successfully refreshed!');

          // Now query GA4 properties via REST
          queryGA4Properties(tokenRes.access_token);
        } else {
          console.error('Failed to refresh token:', body);
        }
      });
    });

    req.write(postData);
    req.end();
  } catch (err) {
    console.error('Error:', err);
  }
}

function queryGA4Properties(accessToken) {
  const req = https.request('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Account Summaries Status:', res.statusCode);
      const data = JSON.parse(body);
      console.log('Accounts Data:', JSON.stringify(data, null, 2));

      if (data.accountSummaries && data.accountSummaries.length > 0) {
        const prop = data.accountSummaries[0].propertySummaries[0];
        console.log('Querying GA4 Data for:', prop.displayName, prop.property);
        runGA4Report(accessToken, prop.property);
      }
    });
  });

  req.end();
}

function runGA4Report(accessToken, propertyName) {
  const requestBody = JSON.stringify({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'sessionSourceMedium' },
      { name: 'country' },
      { name: 'city' }
    ],
    metrics: [
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' }
    ]
  });

  const req = https.request(`https://analyticsdata.googleapis.com/v1beta/${propertyName}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(requestBody)
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('\n=== GA4 REPORT DATA ===');
      console.log(body);
    });
  });

  req.write(requestBody);
  req.end();
}

refreshAndFetch();
