import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

async function sendTest(fromAddr, label) {
  const time = new Date().toLocaleTimeString();
  const payload = JSON.stringify({
    from: `Yasir Jamal <${fromAddr}>`,
    to: ['webandgraphicdesigner@gmail.com'],
    reply_to: 'webandgraphicdesigner@gmail.com',
    subject: `[${label}] Test Email at ${time}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <p>This is a live test from <strong>${fromAddr}</strong> at ${time}.</p>
        <p>Best regards,<br><strong>Yasir Jamal</strong></p>
      </div>
    `
  });

  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.resend.com',
      path: '/emails',
      method: 'POST',
      family: 4,
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`[${label}] Status: ${res.statusCode} | Response:`, body);
        resolve();
      });
    });
    req.on('error', console.error);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('1️⃣ Sending from Root Domain: yasir@yasirjamal.com');
  await sendTest('yasir@yasirjamal.com', 'ROOT DOMAIN');

  console.log('\n2️⃣ Sending from Subdomain: yasir@m.yasirjamal.com');
  await sendTest('yasir@m.yasirjamal.com', 'SUBDOMAIN M');
}

run();
