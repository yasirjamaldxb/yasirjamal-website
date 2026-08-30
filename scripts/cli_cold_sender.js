import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

// Sample Lead
const sampleLeads = [
  {
    name: "Business Director",
    company: "Dubai Enterprise Group",
    email: "webandgraphicdesigner@gmail.com", // Test recipient
    industry: "Luxury Real Estate & Corporate Advisory"
  }
];

function generatePitch(lead) {
  return {
    subject: `quick question re: ${lead.company} mobile speed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1e293b; max-width: 580px;">
        <p style="margin: 0 0 16px 0;">Hi ${lead.name},</p>
        
        <p style="margin: 0 0 16px 0;">
          Came across <strong>${lead.company}</strong> while reviewing digital platforms in Dubai's ${lead.industry} sector.
        </p>

        <p style="margin: 0 0 16px 0;">
          Most corporate platforms in the UAE currently carry 4+ seconds of mobile load delay, losing over 40% of high-intent buyers before they reach the offer.
        </p>

        <p style="margin: 0 0 16px 0;">
          We recently engineered sub-second platforms for ADX-listed <strong>Julphar Pharmaceuticals</strong> and <strong>Westminster Properties</strong>, delivering <strong>0.7s load speeds</strong> and a <strong>+42% surge in inbound inquiries</strong>.
        </p>

        <p style="margin: 0 0 24px 0;">
          Mind if I send over a 60-second speed comparison for ${lead.company}?
        </p>

        <!-- Executive High-Trust Signature Block -->
        <table style="width: 100%; border-collapse: collapse; border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 24px;">
          <tr>
            <td style="vertical-align: top; width: 64px; padding-right: 16px;">
              <img 
                src="https://yasirjamal.com/images/logo.webp" 
                alt="Yasir Jamal" 
                style="width: 56px; height: 56px; border-radius: 50%; border: 2px solid #F6CD0B; object-fit: cover; display: block;" 
              />
            </td>
            <td style="vertical-align: top;">
              <div style="font-size: 15px; font-weight: 700; color: #01013E; margin-bottom: 2px;">
                Yasir Jamal
              </div>
              <div style="font-size: 13px; font-weight: 500; color: #1559E7; margin-bottom: 4px;">
                Senior Web Architect &amp; Product Designer (15+ Yrs)
              </div>
              <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">
                📍 Dubai Media City, UAE &bull; <span style="color: #F6CD0B;">★★★★★</span> <strong>5.0</strong> (48+ Reviews)
              </div>
              <div style="font-size: 12px;">
                <a href="https://yasirjamal.com" style="color: #1559E7; text-decoration: none; font-weight: 600; margin-right: 12px;">
                  🌐 yasirjamal.com
                </a>
                <a href="https://wa.me/971552600494" style="color: #16a34a; text-decoration: none; font-weight: 600;">
                  💬 WhatsApp: +971 55 2600 494
                </a>
              </div>
            </td>
          </tr>
        </table>

        <!-- 1-Click Unsubscribe Compliance Footer -->
        <div style="margin-top: 28px; padding-top: 12px; border-top: 1px dashed #f1f5f9; font-size: 11px; color: #94a3b8;">
          If you prefer not to receive future web performance teardowns, reply with "unsubscribe" or 
          <a href="mailto:webandgraphicdesigner@gmail.com?subject=Unsubscribe%20${encodeURIComponent(lead.email)}" style="color: #94a3b8; text-decoration: underline;">click here to opt-out</a>.
        </div>
      </div>
    `,
    text: `Hi ${lead.name},\n\nCame across ${lead.company} while reviewing digital platforms in Dubai's ${lead.industry} sector.\n\nMost corporate platforms in the UAE carry 4+ seconds of mobile load delay, losing over 40% of high-intent buyers.\n\nWe recently engineered sub-second platforms for ADX-listed Julphar Pharmaceuticals and Westminster Properties (0.7s speed, +42% inbound inquiries).\n\nMind if I send over a 60-second speed comparison for ${lead.company}?\n\n---\nYasir Jamal\nSenior Web Architect & Product Designer (15+ Yrs)\nDubai Media City, UAE | 5.0 Star Rated\nWebsite: https://yasirjamal.com\nWhatsApp: +971 55 2600 494\n\nTo opt-out from future emails, reply with "unsubscribe".`
  };
}

async function sendColdEmail(lead) {
  const pitch = generatePitch(lead);
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
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runColdOutreachBatch(leads) {
  console.log('========================================================================');
  console.log('🚀 HIGH-TRUST COLD EMAIL DISPATCHER (EXECUTIVE SIGNATURE ACTIVE)');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending high-trust pitch to ${lead.name} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendColdEmail(lead);
      if (res.status === 200) {
        console.log(`   ✅ [200 OK] Outreach Delivered (Resend ID: ${res.data.id})`);
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

  console.log('\n🎉 High-trust cold email delivered successfully!\n');
}

runColdOutreachBatch(sampleLeads).catch(console.error);
