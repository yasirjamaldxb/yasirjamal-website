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

        <p style="margin: 0 0 28px 0;">
          If you'd like, I can send you the quick AI visibility check I ran on ${lead.company}. No pitch attached.
        </p>

        <!-- Bigger Profile Photo -->
        <div style="margin: 28px 0 16px 0;">
          <img 
            src="https://yasirjamal.com/images/logo.webp" 
            alt="Yasir Jamal" 
            style="width: 72px; height: 72px; border-radius: 50%; border: 2px solid #e2e8f0; object-fit: cover; display: block;" 
          />
        </div>

        <p style="margin: 0 0 4px 0;">Best regards,</p>
        <p style="margin: 0 0 2px 0; font-weight: 700; color: #111827; font-size: 16px;">Yasir Jamal</p>
        <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 14px;">Product Designer &amp; AI Consultant</p>

        <div style="font-size: 14px; color: #374151; line-height: 1.6; margin-bottom: 24px;">
          <a href="mailto:yasir@yasirjamal.com" style="color: #111827; text-decoration: none;">yasir@yasirjamal.com</a><br>
          WhatsApp: <a href="https://wa.me/971552600494" style="color: #111827; text-decoration: none; font-weight: 500;">+971 55 260 0494</a><br><br>
          W: <a href="https://yasirjamal.com" style="color: #1559E7; text-decoration: none; font-weight: 600;">yasirjamal.com</a>
        </div>

        <!-- P.S. Friendly Opt-Out -->
        <p style="margin: 28px 0 0 0; font-size: 13px; color: #6b7280; font-style: italic;">
          P.S. Not relevant to you? Just reply “no thanks” and I won't follow up.
        </p>
      </div>
    `,
    text: `Hi ${lead.firstName},\n\nI was checking how businesses in ${lead.city} are appearing when potential customers ask ChatGPT for recommendations.\n\nI tested ${lead.company} against a few searches around ${lead.service}, and I noticed something interesting: ${lead.finding}.\n\nI’m currently helping businesses improve their visibility across AI search and recommendation results.\n\nIf you'd like, I can send you the quick AI visibility check I ran on ${lead.company}. No pitch attached.\n\nBest regards,\nYasir Jamal\nProduct Designer & AI Consultant\n\nyasir@yasirjamal.com\nWhatsApp: +971 55 260 0494\n\nW: yasirjamal.com\n\nP.S. Not relevant to you? Just reply “no thanks” and I won't follow up.`
  };
}

async function sendAuthenticEmail(lead) {
  const pitch = generateAuthenticEmail(lead);
  const payload = JSON.stringify({
    from: 'Yasir Jamal <yasir@m.yasirjamal.com>',
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
  console.log('✉️ AUTHENTIC COLD SENDER (CUSTOM SIGNATURE & P.S. OPT-OUT)');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending email to ${lead.firstName} (${lead.company} - ${lead.email})...`);

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

  console.log('\n🎉 Cold email delivered successfully!\n');
}

runAuthenticBatch(sampleLeads).catch(console.error);
