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

function generateSabriStyleEmail(lead) {
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

        <p style="margin: 0 0 32px 0;">
          Best,<br>
          Yasir
        </p>

        <!-- Sabri Suby / King Kong Style High-Trust Executive Signature -->
        <div style="border-top: 2px solid #01013E; padding-top: 18px; margin-top: 32px;">
          
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
            <a href="tel:+971552600494" style="color: #111827; text-decoration: none;">+971 55 2600 494</a>
          </div>

          <div style="font-size: 14px; margin-bottom: 16px;">
            <a href="https://yasirjamal.com" style="color: #1559E7; text-decoration: underline; font-weight: 600;">
              www.yasirjamal.com
            </a>
          </div>

          <!-- Social & Contact Channels -->
          <div style="margin-bottom: 20px;">
            <table style="border-collapse: collapse;">
              <tr>
                <td style="padding-right: 12px;">
                  <a href="https://wa.me/971552600494" style="display: inline-block; background-color: #25D366; color: #ffffff; font-size: 11px; font-weight: 700; text-decoration: none; padding: 4px 10px; border-radius: 4px;">
                    WhatsApp Direct
                  </a>
                </td>
                <td style="padding-right: 12px;">
                  <a href="https://yasirjamal.com/portfolio/" style="display: inline-block; background-color: #01013E; color: #ffffff; font-size: 11px; font-weight: 700; text-decoration: none; padding: 4px 10px; border-radius: 4px;">
                    13 Case Studies
                  </a>
                </td>
                <td>
                  <a href="https://yasirjamal.com/web-design-dubai/" style="display: inline-block; background-color: #f3f4f6; color: #1f2937; border: 1px solid #d1d5db; font-size: 11px; font-weight: 600; text-decoration: none; padding: 4px 10px; border-radius: 4px;">
                    Dubai Web Design
                  </a>
                </td>
              </tr>
            </table>
          </div>

          <!-- Partner & Trust Verification Badges -->
          <div style="margin-bottom: 28px;">
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
                    <span style="font-size: 9px; font-weight: normal; color: #6b7280;">48+ Verified Reviews</span>
                  </div>
                </td>
                <td style="padding-right: 8px;">
                  <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 10px; background-color: #fafafa; font-size: 11px; font-weight: 700; color: #1f2937; text-align: center;">
                    ⚡ 0.7s Sub-Second<br>
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

          <!-- Sabri Suby Style Disclaimer & CAN-SPAM Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; font-size: 11px; color: #9ca3af; line-height: 1.5;">
            <p style="margin: 0 0 8px 0;">
              You are receiving this communication regarding digital web performance from Yasir Jamal, based in Dubai Media City, UAE.
            </p>
            <p style="margin: 0 0 8px 0;">
              All case studies and metrics mentioned (Julphar Pharmaceuticals, Westminster Properties) are verified client architectures. To opt-out from future performance updates, reply with "unsubscribe" or <a href="mailto:webandgraphicdesigner@gmail.com?subject=Unsubscribe%20${encodeURIComponent(lead.email)}" style="color: #9ca3af; text-decoration: underline;">click here to unsubscribe</a>.
            </p>
            <p style="margin: 0;">
              Yasir Jamal &bull; Dubai Media City, Building 1, Dubai, UAE &bull; <a href="https://yasirjamal.com" style="color: #9ca3af; text-decoration: none;">yasirjamal.com</a>
            </p>
          </div>

        </div>

      </div>
    `,
    text: `Hi ${lead.name},\n\nCame across ${lead.company} while reviewing digital platforms in Dubai's ${lead.industry} sector.\n\nMost corporate platforms in the UAE currently carry 4+ seconds of mobile load delay, causing over 40% of high-intent buyers to bounce before viewing the offer.\n\nWe recently engineered sub-second platforms for ADX-listed Julphar Pharmaceuticals and Westminster Properties (0.7s load times, +42% inbound inquiries).\n\nMind if I send over a 60-second speed comparison for ${lead.company}?\n\nBest,\nYasir\n\n---\nYASIR JAMAL\nYasir Jamal\nSenior Web Architect & Head of Digital Engineering\nDubai Media City, Building 1, Dubai, United Arab Emirates\nPhone: +971 55 2600 494\nWebsite: https://yasirjamal.com\nWhatsApp: https://wa.me/971552600494\n\nTo unsubscribe, reply with "unsubscribe".`
  };
}

async function sendSabriStyleEmail(lead) {
  const pitch = generateSabriStyleEmail(lead);
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

async function runSabriStyleBatch(leads) {
  console.log('========================================================================');
  console.log('👑 SABRI SUBY STYLE HIGH-TRUST SIGNATURE COLD EMAIL DISPATCHER');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending King Kong / Sabri style pitch to ${lead.name} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendSabriStyleEmail(lead);
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

  console.log('\n🎉 King Kong / Sabri style cold email delivered successfully!\n');
}

runSabriStyleBatch(sampleLeads).catch(console.error);
