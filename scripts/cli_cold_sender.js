import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

const sampleLeads = [
  {
    firstName: "Ahmed",
    company: "Elysian Real Estate",
    city: "Dubai",
    service: "luxury off-plan property investment",
    finding: "your top two competitors in Business Bay are getting recommended every time, while your company isn't showing up at all",
    email: "webandgraphicdesigner@gmail.com" // Test recipient
  }
];

function generateAuthenticEmail(lead) {
  return {
    subject: `ChatGPT recommendations for ${lead.company}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827; max-width: 600px;">
        <p style="margin: 0 0 16px 0;">Hi ${lead.firstName},</p>

        <p style="margin: 0 0 16px 0;">
          I was checking how businesses in ${lead.city} are appearing when potential customers ask ChatGPT for recommendations.
        </p>

        <p style="margin: 0 0 16px 0;">
          I tested ${lead.company} against a few searches around ${lead.service}, and I noticed something interesting: ${lead.finding}.
        </p>

        <p style="margin: 0 0 16px 0;">
          I’m currently helping businesses improve their visibility across AI search and recommendation results.
        </p>

        <p style="margin: 0 0 24px 0;">
          If you'd like, I can send you the quick AI visibility check I ran on ${lead.company}. No pitch attached.
        </p>

        <p style="margin: 0 0 24px 0;">
          Best,<br>
          Yasir Jamal
        </p>

        <div style="margin-top: 24px; font-size: 14px; color: #374151; line-height: 1.5;">
          E: <a href="mailto:info@yasirjamal.com" style="color: #111827; text-decoration: none;">info@yasirjamal.com</a><br>
          W: <a href="https://www.yasirjamal.com" style="color: #1559E7; text-decoration: none;">www.yasirjamal.com</a>
        </div>

        <div style="margin-top: 36px; padding-top: 12px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #9ca3af;">
          To opt-out from future emails, reply with "unsubscribe".
        </div>
      </div>
    `,
    text: `Hi ${lead.firstName},\n\nI was checking how businesses in ${lead.city} are appearing when potential customers ask ChatGPT for recommendations.\n\nI tested ${lead.company} against a few searches around ${lead.service}, and I noticed something interesting: ${lead.finding}.\n\nI’m currently helping businesses improve their visibility across AI search and recommendation results.\n\nIf you'd like, I can send you the quick AI visibility check I ran on ${lead.company}. No pitch attached.\n\nBest,\nYasir Jamal\n\nE: info@yasirjamal.com\nW: www.yasirjamal.com\n\nTo opt-out from future emails, reply with "unsubscribe".`
  };
}

async function sendAuthenticEmail(lead) {
  const pitch = generateAuthenticEmail(lead);
  const payload = JSON.stringify({
    from: 'Yasir Jamal <yasir@yasirjamal.com>',
    to: [lead.email],
    reply_to: 'webandgraphicdesigner@gmail.com',
    headers: {
      'List-Unsubscribe': `<mailto:webandgraphicdesigner@gmail.com?subject=Unsubscribe%20${encodeURIComponent(lead.email)}>`
    },
    subject: pitch.subject,
    text: pitch.text,
    html: pitch.html
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
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runAuthenticBatch(leads) {
  console.log('========================================================================');
  console.log('✉️ AUTHENTIC 1-ON-1 HUMAN COLD SENDER (NO BOT / ZERO JARGON)');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending 1-on-1 email to ${lead.firstName} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendAuthenticEmail(lead);
      if (res.status === 200) {
        console.log(`   ✅ [200 OK] Delivered (Resend ID: ${res.data.id})`);
      } else {
        console.log(`   ⚠️ [${res.status}] Notice: ${JSON.stringify(res.data || res.raw)}`);
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
    }

    if (i < leads.length - 1) {
      const delay = Math.floor(Math.random() * 3000) + 2000;
      await new Promise(r => setTimeout(r, delay));
    }
  }

  console.log('\n🎉 Authentic 1-on-1 cold email delivered successfully!\n');
}

runAuthenticBatch(sampleLeads).catch(console.error);
