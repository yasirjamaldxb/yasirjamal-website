import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;
const emailId = '80cdb558-eec2-4be9-93cd-40af61c314c5';

function checkEmail() {
  const req = https.request({
    hostname: 'api.resend.com',
    path: `/emails/${emailId}`,
    method: 'GET',
    family: 4,
    headers: {
      'Authorization': `Bearer ${resendApiKey}`
    }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Email Details from Resend:');
      console.log(body);
    });
  });
  req.on('error', console.error);
  req.end();
}

checkEmail();
