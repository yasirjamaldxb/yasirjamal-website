import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

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
  console.log('✉️ CONNECTING RESEND DOMAIN (yasirjamal.com)');
  console.log('========================================================================\n');

  console.log('1️⃣ Checking existing domains in Resend account...');
  const listRes = await resendRequest('/domains');
  console.log('Existing domains:', JSON.stringify(listRes.data, null, 2));

  let domainObj = listRes.data?.data?.find(d => d.name === 'yasirjamal.com');

  if (!domainObj) {
    console.log('\n2️⃣ Adding yasirjamal.com to Resend...');
    const createRes = await resendRequest('/domains', 'POST', {
      name: 'yasirjamal.com',
      region: 'us-east-1'
    });
    console.log('Domain created response:', JSON.stringify(createRes.data, null, 2));
    domainObj = createRes.data;
  } else {
    console.log('\nDomain already exists in Resend:', domainObj.id);
  }

  console.log('\n3️⃣ Fetching DNS records needed for verification...');
  const domainId = domainObj.id;
  const detailRes = await resendRequest(`/domains/${domainId}`);
  console.log('Domain details & DNS records:');
  console.log(JSON.stringify(detailRes.data, null, 2));
}

run().catch(console.error);
