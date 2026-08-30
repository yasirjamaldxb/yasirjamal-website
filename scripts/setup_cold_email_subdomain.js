import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;
const subdomain = 'm.yasirjamal.com';

function resendRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    const req = https.request({
      hostname: 'api.resend.com',
      path: path,
      method: method,
      family: 4,
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('========================================================================');
  console.log(`✉️ REGISTERING COLD OUTREACH SUBDOMAIN IN RESEND: ${subdomain}`);
  console.log('========================================================================\n');

  // 1. Check if subdomain already exists
  const listRes = await resendRequest('/domains');
  let domainObj = listRes.data?.data?.find(d => d.name === subdomain);

  if (!domainObj) {
    console.log(`1️⃣ Creating domain ${subdomain} on Resend...`);
    const createRes = await resendRequest('/domains', 'POST', {
      name: subdomain,
      region: 'us-east-1'
    });
    console.log('Create response:', JSON.stringify(createRes.data, null, 2));
    domainObj = createRes.data;
  } else {
    console.log(`Domain ${subdomain} already exists:`, domainObj.id);
  }

  // 2. Fetch required DNS records
  const domainId = domainObj.id;
  console.log(`\n2️⃣ Fetching DNS records for ${subdomain} (ID: ${domainId})...`);
  const detailRes = await resendRequest(`/domains/${domainId}`);
  console.log(JSON.stringify(detailRes.data, null, 2));
}

run().catch(console.error);
