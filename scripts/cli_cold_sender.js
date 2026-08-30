import https from 'https';
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const creds = JSON.parse(fs.readFileSync('resend_credentials.json', 'utf8'));
const resendApiKey = creds.api_key;

// Sample Leads Data (Can be loaded from JSON or CSV)
const sampleLeads = [
  {
    name: "Business Director",
    company: "Dubai Enterprise Group",
    email: "webandgraphicdesigner@gmail.com", // Test recipient
    industry: "Real Estate & Corporate Advisory"
  }
];

function generatePitch(lead) {
  return {
    subject: `Question regarding ${lead.company}'s website conversion speed`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b; max-width: 600px;">
        <p>Hi ${lead.name},</p>
        
        <p>
          I came across <strong>${lead.company}</strong> while reviewing digital platforms in Dubai's ${lead.industry} sector.
        </p>

        <p>
          Most corporate websites in the UAE suffer from heavy template bloat and 4+ second load times on mobile, causing over 50% of high-intent visitors to bounce before viewing the offer.
        </p>

        <p>
          As a Senior Web Architect based in Dubai Media City with 15+ years experience (recently engineering sub-second platforms for ADX-listed <strong>Julphar Pharmaceuticals</strong> and <strong>Westminster Properties</strong>), I build custom web architectures that achieve:
        </p>

        <ul style="color: #0f172a; padding-left: 20px;">
          <li>⚡ <strong>0.7s Sub-Second Mobile Speed</strong> (98–100 PageSpeed Score)</li>
          <li>📱 <strong>1-Click WhatsApp Lead Routing</strong> for UAE decision-makers</li>
          <li>🤖 <strong>Answer Engine Optimization (AEO)</strong> to get recommended by ChatGPT</li>
        </ul>

        <p>
          Would you be open to a quick 5-minute review of ${lead.company}'s digital performance this week?
        </p>

        <p>
          You can explore our verified Dubai case studies here: <a href="https://yasirjamal.com/portfolio/" style="color: #1559E7; font-weight: bold; text-decoration: none;">yasirjamal.com/portfolio/</a> or reach me directly on WhatsApp at <a href="https://wa.me/971552600494" style="color: #1559E7; font-weight: bold; text-decoration: none;">+971 55 2600 494</a>.
        </p>

        <p style="margin-top: 24px;">
          Best regards,<br>
          <strong>Yasir Jamal</strong><br>
          Senior Web Architect &amp; Product Designer<br>
          <span style="color: #64748b; font-size: 12px;">Dubai Media City, UAE &bull; <a href="https://yasirjamal.com" style="color: #64748b;">yasirjamal.com</a></span>
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0 12px 0;" />
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          If you prefer not to receive future web performance teardowns, reply with "unsubscribe" or <a href="mailto:webandgraphicdesigner@gmail.com?subject=Unsubscribe%20${encodeURIComponent(lead.email)}" style="color: #94a3b8; text-decoration: underline;">click here to opt-out</a>.
        </p>
      </div>
    `,
    text: `Hi ${lead.name},\n\nI came across ${lead.company} while reviewing digital platforms in Dubai's ${lead.industry} sector.\n\nMost corporate websites in the UAE suffer from 4+ second load times on mobile, causing over 50% of high-intent visitors to bounce.\n\nAs a Senior Web Architect in Dubai Media City with 15+ years experience (Julphar Pharmaceuticals, Westminster Properties), I engineer custom web architectures that achieve 0.7s speed and 3x higher lead conversion.\n\nWould you be open to a quick 5-minute review this week?\n\nVerified case studies: https://yasirjamal.com/portfolio/\nDirect WhatsApp: https://wa.me/971552600494\n\nBest regards,\nYasir Jamal\nSenior Web Architect | Dubai Media City\n\n---\nTo opt-out from future emails, reply with "unsubscribe".`
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
  console.log('🚀 100% FREE CLI COLD OUTREACH SENDER ($0 SUBSCRIPTIONS)');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending personalized pitch to ${lead.name} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendColdEmail(lead);
      if (res.status === 200) {
        console.log(`   ✅ [200 OK] Outreach Delivered (ID: ${res.data.id})`);
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

  console.log('\n🎉 Cold outreach batch completed with $0 cost!\n');
}

runColdOutreachBatch(sampleLeads).catch(console.error);
