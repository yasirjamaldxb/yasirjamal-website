import fs from 'fs';
import https from 'https';

async function listProps() {
  const token = JSON.parse(fs.readFileSync('ga4_token.json', 'utf8'));
  const accessToken = token.access_token;

  const req = https.request('https://analyticsadmin.googleapis.com/v1beta/accountSummaries', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Account Summaries:');
      const data = JSON.parse(body);
      console.log(JSON.stringify(data, null, 2));

      if (data.accountSummaries) {
        data.accountSummaries.forEach(acc => {
          console.log(`Account: ${acc.displayName} (${acc.account})`);
          if (acc.propertySummaries) {
            acc.propertySummaries.forEach(p => {
              console.log(`  -> Property: ${p.displayName} (${p.property})`);
            });
          }
        });
      }
    });
  });

  req.end();
}

listProps();
