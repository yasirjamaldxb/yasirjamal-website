import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

const sampleLeads = [
  {
    name: "Ahmed",
    company: "Elysian Luxury Real Estate",
    email: "webandgraphicdesigner@gmail.com", // Test recipient
    niche: "luxury properties in Dubai"
  }
];

function generateBusinessFirstPitch(lead) {
  return {
    subject: `getting more client inquiries for ${lead.company}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #111827; max-width: 600px;">
        
        <p style="margin: 0 0 16px 0;">Hi ${lead.name},</p>
        
        <p style="margin: 0 0 16px 0;">
          I was looking up companies offering <strong>${lead.niche}</strong> and came across ${lead.company}.
        </p>

        <p style="margin: 0 0 16px 0;">
          Right now, when people in Dubai search for your services on Google or ask ChatGPT for recommendations, your competitors are showing up first and taking those client inquiries.
        </p>

        <p style="margin: 0 0 16px 0;">
          Your current website isn't set up to get recommended by modern search engines, which means you're missing out on high-paying clients who are looking to hire right now.
        </p>

        <p style="margin: 0 0 16px 0;">
          I've been helping Dubai businesses (including <strong>Julphar Pharmaceuticals</strong> and <strong>Westminster Properties</strong>) design clean websites that rank on Google, get recommended by AI, and bring in direct WhatsApp inquiries from qualified buyers.
        </p>

        <p style="margin: 0 0 24px 0;">
          Mind if I send over a quick screenshot showing where your website is losing potential clients?
        </p>

        <p style="margin: 0 0 28px 0;">
          Best,<br>
          Yasir
        </p>

        <!-- High-Trust Signature Block -->
        <div style="border-top: 2px solid #01013E; padding-top: 18px; margin-top: 28px;">
          
          <div style="font-size: 22px; font-weight: 900; color: #01013E; letter-spacing: -0.03em; margin-bottom: 8px;">
            YASIR JAMAL
          </div>

          <div style="font-size: 16px; font-weight: 700; color: #111827; margin-bottom: 2px;">
            Yasir Jamal
          </div>

          <div style="font-size: 14px; color: #4b5563; margin-bottom: 4px;">
            Senior Web Designer &amp; Digital Growth Consultant
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

          <!-- Trust Verification Badges -->
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
                    15+ Years<br>
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">Dubai Experience</span>
                  </div>
                </td>
                <td>
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 10px; background-color: #fafafa; font-size: 11px; font-weight: 700; color: #1f2937; text-align: center;">
                    Direct WhatsApp<br>
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">Lead Funnels</span>
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
    text: `Hi ${lead.name},\n\nI was looking up companies offering ${lead.niche} and came across ${lead.company}.\n\nRight now, when people in Dubai search for your services on Google or ask ChatGPT for recommendations, your competitors are showing up first and taking those client inquiries.\n\nYour current website isn't set up to get recommended by modern search engines, which means you're missing out on high-paying clients who are looking to hire right now.\n\nI've been helping Dubai businesses (including Julphar Pharmaceuticals and Westminster Properties) design clean websites that rank on Google, get recommended by AI, and bring in direct WhatsApp inquiries from qualified buyers.\n\nMind if I send over a quick screenshot showing where your website is losing potential clients?\n\nBest,\nYasir\n\n---\nYASIR JAMAL\nYasir Jamal\nSenior Web Designer & Digital Growth Consultant\nDubai Media City, Building 1, Dubai, United Arab Emirates\nPhone: +971 55 2600 494\nWebsite: https://yasirjamal.com\n\nTo unsubscribe, reply with "unsubscribe".`
  };
}

async function sendBusinessFirstEmail(lead) {
  const pitch = generateBusinessFirstPitch(lead);
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

async function runBusinessFirstBatch(leads) {
  console.log('========================================================================');
  console.log('💼 ZERO-JARGON / REVENUE-FIRST COLD EMAIL DISPATCHER');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending revenue-first pitch to ${lead.name} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendBusinessFirstEmail(lead);
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

  console.log('\n🎉 Revenue-first cold email delivered successfully!\n');
}

runBusinessFirstBatch(sampleLeads).catch(console.error);
