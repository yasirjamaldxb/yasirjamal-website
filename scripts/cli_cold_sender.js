import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

const sampleLeads = [
  {
    name: "Business Director",
    company: "Elysian Luxury Real Estate",
    email: "webandgraphicdesigner@gmail.com", // Test recipient
    industry: "Luxury Real Estate"
  }
];

function generatePureEmail(lead) {
  return {
    subject: `quick question re: ${lead.company} mobile speed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827; max-width: 600px;">
        
        <p style="margin: 0 0 16px 0;">Hi ${lead.name},</p>
        
        <p style="margin: 0 0 16px 0;">
          Came across <strong>${lead.company}</strong> while reviewing digital platforms in Dubai's ${lead.industry} sector.
        </p>

        <p style="margin: 0 0 16px 0;">
          Most corporate platforms in the UAE currently carry 4+ seconds of mobile load delay, causing over 40% of high-intent buyers to bounce before viewing the offer.
        </p>

        <p style="margin: 0 0 16px 0;">
          We recently engineered sub-second platforms for ADX-listed <strong>Julphar Pharmaceuticals</strong> and <strong>Westminster Properties</strong>, achieving <strong>0.7s load times</strong> and a <strong>+42% increase in inbound inquiries</strong>.
        </p>

        <p style="margin: 0 0 24px 0;">
          Mind if I send over a 60-second speed comparison for ${lead.company}?
        </p>

        <p style="margin: 0 0 28px 0;">
          Best,<br>
          Yasir
        </p>

        <!-- Pure King Kong Style High-Trust Signature (Single Website Link Only) -->
        <div style="border-top: 2px solid #01013E; padding-top: 18px; margin-top: 28px;">
          
          <div style="font-size: 22px; font-weight: 900; color: #01013E; letter-spacing: -0.03em; margin-bottom: 8px;">
            YASIR JAMAL
          </div>

          <div style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 2px;">
            Yasir Jamal
          </div>

          <div style="font-size: 14px; color: #4b5563; margin-bottom: 4px;">
            Senior Web Architect &amp; Head of Digital Engineering
          </div>

          <div style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 6px;">
            Dubai Media City, Building 1, Dubai, United Arab Emirates
          </div>

          <div style="font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 4px;">
            +971 55 2600 494
          </div>

          <div style="font-size: 14px; margin-bottom: 20px;">
            <a href="https://yasirjamal.com" style="color: #1559E7; text-decoration: underline; font-weight: 600;">
              www.yasirjamal.com
            </a>
          </div>

          <!-- Partner & Trust Verification Badges -->
          <div style="margin-bottom: 24px;">
            <table style="border-collapse: collapse;">
              <tr>
                <td style="padding-right: 8px;">
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 10px; background-color: #fafafa; font-size: 11px; font-weight: 700; color: #1f2937; text-align: center;">
                    <span style="color: #EA4335;">G</span><span style="color: #4285F4;">o</span><span style="color: #FBBC05;">o</span><span style="color: #4285F4;">g</span><span style="color: #34A853;">l</span><span style="color: #EA4335;">e</span> Partner<br>
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">Certified 2026</span>
                  </div>
                </td>
                <td style="padding-right: 8px;">
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 10px; background-color: #fafafa; font-size: 11px; font-weight: 700; color: #1f2937; text-align: center;">
                    <span style="color: #F6CD0B;">★★★★★</span> 5.0<br>
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">48+ Reviews</span>
                  </div>
                </td>
                <td style="padding-right: 8px;">
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 10px; background-color: #fafafa; font-size: 11px; font-weight: 700; color: #1f2937; text-align: center;">
                    ⚡ 0.7s Speed<br>
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">Core Web Vitals</span>
                  </div>
                </td>
                <td>
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 10px; background-color: #fafafa; font-size: 11px; font-weight: 700; color: #1f2937; text-align: center;">
                    15+ Years<br>
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">Senior Architect</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Minimal Standard Opt-Out Text -->
          <div style="border-top: 1px solid #f3f4f6; padding-top: 12px; font-size: 11px; color: #9ca3af; line-height: 1.5;">
            To opt-out from future communications, reply with "unsubscribe".
          </div>

        </div>

      </div>
    `,
    text: `Hi ${lead.name},\n\nCame across ${lead.company} while reviewing digital platforms in Dubai's ${lead.industry} sector.\n\nMost corporate platforms in the UAE currently carry 4+ seconds of mobile load delay, causing over 40% of high-intent buyers to bounce before viewing the offer.\n\nWe recently engineered sub-second platforms for ADX-listed Julphar Pharmaceuticals and Westminster Properties (0.7s load times, +42% inbound inquiries).\n\nMind if I send over a 60-second speed comparison for ${lead.company}?\n\nBest,\nYasir\n\n---\nYASIR JAMAL\nYasir Jamal\nSenior Web Architect & Head of Digital Engineering\nDubai Media City, Building 1, Dubai, United Arab Emirates\n+971 55 2600 494\nwww.yasirjamal.com\n\nTo unsubscribe, reply with "unsubscribe".`
  };
}

async function sendPureEmail(lead) {
  const pitch = generatePureEmail(lead);
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

async function runPureBatch(leads) {
  console.log('========================================================================');
  console.log('👑 PURE SINGLE-LINK COLD SENDER (WEBSITE ONLY + MINIMAL UNSUBSCRIBE)');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending pure pitch to ${lead.name} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendPureEmail(lead);
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

  console.log('\n🎉 Single-link cold email delivered successfully!\n');
}

runPureBatch(sampleLeads).catch(console.error);
