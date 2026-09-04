import fs from 'fs';
import https from 'https';

const authCode = "4/1ATsMZqCjXQplZNTZb4MNZYZRV-tdOncYU5Ke9DJ4UtfmxbNap0NhboKJrVo";

async function exchangeAndRun() {
  try {
    const clientSecret = JSON.parse(fs.readFileSync('client_secret.json', 'utf8')).installed;

    const postData = new URLSearchParams({
      code: authCode,
      client_id: clientSecret.client_id,
      client_secret: clientSecret.client_secret,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
      grant_type: 'authorization_code'
    }).toString();

    console.log('Exchanging auth code for tokens...');

    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log('Token Exchange Status:', res.statusCode);
        const tokenRes = JSON.parse(body);
        if (tokenRes.access_token) {
          fs.writeFileSync('ga4_token.json', JSON.stringify(tokenRes, null, 2));
          console.log('✅ Tokens successfully saved to ga4_token.json!');
          getAccountSummaries(tokenRes.access_token);
        } else {
          console.error('❌ Failed to exchange code:', body);
        }
      });
    });

    req.write(postData);
    req.end();
  } catch (err) {
    console.error('Error in exchange:', err);
  }
}

function getAccountSummaries(accessToken) {
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
        for (const acc of data.accountSummaries) {
          if (acc.propertySummaries) {
            for (const prop of acc.propertySummaries) {
              console.log(`\n========================================`);
              console.log(`FOUND GA4 PROPERTY: ${prop.displayName} (${prop.property})`);
              console.log(`========================================`);
              fetchDetailedReports(accessToken, prop.property);
            }
          }
        }
      } else {
        console.log('No account summaries found.');
      }
    });
  });

  req.end();
}

function fetchDetailedReports(accessToken, propertyName) {
  // 1. Pages & User Behavior Report
  const req1 = https.request(`https://analyticsdata.googleapis.com/v1beta/${propertyName}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('\n--- 1. PAGES & USER BEHAVIOR ---');
      console.log(body);
    });
  });

  req1.write(JSON.stringify({
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
  }));
  req1.end();

  // 2. Events & Interactions Report
  const req2 = https.request(`https://analyticsdata.googleapis.com/v1beta/${propertyName}:runReport`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('\n--- 2. EVENTS & USER ACTIONS (SCROLLS, CLICKS, FORM FILLS) ---');
      console.log(body);
    });
  });

  req2.write(JSON.stringify({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [
      { name: 'eventName' },
      { name: 'pagePath' }
    ],
    metrics: [
      { name: 'eventCount' },
      { name: 'totalUsers' }
    ]
  }));
  req2.end();
}

exchangeAndRun();
