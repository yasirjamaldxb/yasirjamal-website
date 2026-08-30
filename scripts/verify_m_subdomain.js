import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;
const subdomainId = '936a69c2-5adc-424f-835f-37a3deaed5ba';

function verifySubdomain() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: `/domains/${subdomainId}/verify`,
      method: 'POST',
      family: 4,
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Verify API status: ${res.statusCode}`);
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function checkSubdomainStatus() {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: `/domains/${subdomainId}`,
      method: 'GET',
      family: 4,
      headers: {
        'Authorization': `Bearer ${resendApiKey}`
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log('🔄 Triggering verification for m.yasirjamal.com on Resend...');
  await verifySubdomain();

  console.log('\n⏳ Checking status in 3 seconds...');
  await new Promise(r => setTimeout(r, 3000));
  const s = await checkSubdomainStatus();
  console.log('Domain Status Details:');
  console.log(JSON.stringify(s, null, 2));
}

run().catch(console.error);
