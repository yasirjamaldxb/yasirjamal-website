import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

async function sendEmail() {
  console.log('✉️ Sending test email via Resend API...\n');

  const payload = JSON.stringify({
    from: 'Yasir Jamal Website <onboarding@resend.dev>',
    to: ['ravomotors@gmail.com'],
    subject: '⚡ Resend API Connected Successfully to yasirjamal.com',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #01013E; margin: 0;">Resend Email API Connected!</h2>
          <p style="color: #64748b; font-size: 14px;">yasirjamal.com Integration Status: ACTIVE</p>
        </div>
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0; color: #334155; font-size: 14px;"><strong>Domain:</strong> yasirjamal.com</p>
          <p style="margin: 0 0 8px 0; color: #334155; font-size: 14px;"><strong>DNS Status:</strong> DKIM, SPF & MX records added to Hostinger DNS</p>
          <p style="margin: 0; color: #334155; font-size: 14px;"><strong>Lead Notifications:</strong> Ready to receive instant contact form submissions</p>
        </div>
        <p style="color: #475569; font-size: 13px; line-height: 1.5;">
          All client inquiries and consultation bookings submitted on <strong>yasirjamal.com</strong> will be delivered directly to this inbox in real-time.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          Sent by Yasir Jamal Portfolio Engine &bull; Dubai Media City, UAE
        </p>
      </div>
    `
  });

  return new Promise((resolve, reject) => {
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
        console.log(`Resend Email API status: ${res.statusCode}`);
        console.log('Response:', body);
        resolve();
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

sendEmail().catch(console.error);
