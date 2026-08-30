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
    industry: "Luxury Real Estate",
    currentSpeed: "4.6s",
    potentialSpeed: "0.7s"
  }
];

function generateLuxuryPitch(lead) {
  return {
    subject: `⚡ Web Architecture Audit: ${lead.company} Mobile Performance`,
    html: `
      <div style="background-color: #f8fafc; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
          
          <!-- Top Header Bar -->
          <div style="background: linear-gradient(135deg, #03050d 0%, #01013E 100%); padding: 24px 28px; color: #ffffff;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td>
                  <span style="display: inline-block; background: rgba(21, 89, 231, 0.3); border: 1px solid rgba(21, 89, 231, 0.6); color: #60A5FA; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">
                    Technical Web Performance Teardown
                  </span>
                  <h1 style="font-size: 20px; font-weight: 600; margin: 0; color: #ffffff; letter-spacing: -0.02em;">
                    ${lead.company}
                  </h1>
                </td>
                <td style="text-align: right; vertical-align: top;">
                  <span style="color: #F6CD0B; font-size: 12px; font-weight: 600; display: inline-block; background: rgba(246, 205, 11, 0.1); border: 1px solid rgba(246, 205, 11, 0.3); padding: 4px 8px; border-radius: 8px;">
                    📍 Dubai Media City
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Main Body Content -->
          <div style="padding: 28px; color: #1e293b; font-size: 15px; line-height: 1.6;">
            <p style="margin: 0 0 16px 0;">Hi ${lead.name},</p>
            
            <p style="margin: 0 0 16px 0; color: #334155;">
              I reviewed <strong>${lead.company}</strong> while analyzing digital conversion architectures across Dubai's ${lead.industry} sector.
            </p>

            <!-- Visual Metric Comparison Card -->
            <div style="background: #f1f5f9; border-radius: 14px; padding: 18px; margin: 20px 0; border: 1px solid #e2e8f0;">
              <table style="width: 100%; border-collapse: collapse; text-align: center;">
                <tr>
                  <td style="width: 50%; padding: 8px; border-right: 1px solid #cbd5e1;">
                    <div style="font-size: 11px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                      Typical UAE WordPress Site
                    </div>
                    <div style="font-size: 22px; font-weight: 800; color: #ef4444;">
                      ${lead.currentSpeed}
                    </div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                      ~40% Mobile Visitor Bounce
                    </div>
                  </td>
                  <td style="width: 50%; padding: 8px;">
                    <div style="font-size: 11px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                      Yasir Jamal Sub-Second Build
                    </div>
                    <div style="font-size: 22px; font-weight: 800; color: #10b981;">
                      ${lead.potentialSpeed}
                    </div>
                    <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                      98/100 Core Web Vitals
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <p style="margin: 0 0 16px 0; color: #334155;">
              As a Senior Web Architect with 15+ years experience (recently engineering digital platforms for ADX-listed <strong>Julphar Pharmaceuticals</strong> and luxury Dubai portal <strong>Westminster Properties</strong>), I replace bloated templates with sub-second, custom-coded web architectures that maximize high-ticket client inquiries.
            </p>

            <p style="margin: 0 0 24px 0; color: #334155;">
              Would you be open to a quick 5-minute review of ${lead.company}'s digital acquisition funnel this week?
            </p>

            <!-- Direct Action Button -->
            <div style="text-align: center; margin: 28px 0;">
              <a href="https://wa.me/971552600494?text=Hi%20Yasir,%20let's%20discuss%20${encodeURIComponent(lead.company)}%20web%20performance" style="display: inline-block; background-color: #F6CD0B; color: #03050d; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(246, 205, 11, 0.3);">
                💬 Connect Directly on WhatsApp
              </a>
            </div>

            <!-- Executive Signature Block -->
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 28px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 56px; vertical-align: top; padding-right: 14px;">
                    <img 
                      src="https://yasirjamal.com/images/logo.webp" 
                      alt="Yasir Jamal" 
                      style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #F6CD0B; display: block;" 
                    />
                  </td>
                  <td style="vertical-align: top;">
                    <div style="font-size: 15px; font-weight: 700; color: #01013E; margin-bottom: 2px;">
                      Yasir Jamal
                    </div>
                    <div style="font-size: 13px; font-weight: 500; color: #1559E7; margin-bottom: 3px;">
                      Senior Web Architect &amp; Product Designer (15+ Yrs)
                    </div>
                    <div style="font-size: 12px; color: #64748b;">
                      📍 Dubai Media City, UAE &bull; <span style="color: #F6CD0B;">★★★★★</span> <strong>5.0</strong> (48+ Reviews)
                    </div>
                    <div style="font-size: 12px; margin-top: 6px;">
                      <a href="https://yasirjamal.com/portfolio/" style="color: #1559E7; text-decoration: none; font-weight: 600; margin-right: 12px;">
                        Explore 13 Verified Case Studies &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

          </div>

          <!-- Unsubscribe Footer -->
          <div style="background-color: #f8fafc; border-top: 1px solid #f1f5f9; padding: 14px 28px; font-size: 11px; color: #94a3b8; text-align: center;">
            If you prefer not to receive future web performance teardowns, 
            <a href="mailto:webandgraphicdesigner@gmail.com?subject=Unsubscribe%20${encodeURIComponent(lead.email)}" style="color: #94a3b8; text-decoration: underline;">click here to opt-out</a>.
          </div>

        </div>
      </div>
    `,
    text: `Technical Web Performance Teardown for ${lead.company}\n\nHi ${lead.name},\n\nI reviewed ${lead.company} while analyzing digital conversion architectures across Dubai's ${lead.industry} sector.\n\nMost corporate platforms in the UAE take 4+ seconds to load, losing ~40% of mobile inquiries.\n\nAs a Senior Web Architect with 15+ years experience (Julphar Pharmaceuticals, Westminster Properties), I engineer 0.7s sub-second web platforms that maximize high-ticket client inquiries.\n\nWould you be open to a quick 5-minute review this week?\n\nConnect on WhatsApp: https://wa.me/971552600494\nExplore Case Studies: https://yasirjamal.com/portfolio/\n\n---\nYasir Jamal\nSenior Web Architect | Dubai Media City\n5.0 Star Rated (48+ Reviews)\n\nTo opt-out, reply with "unsubscribe".`
  };
}

async function sendLuxuryColdEmail(lead) {
  const pitch = generateLuxuryPitch(lead);
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

async function runLuxuryOutreachBatch(leads) {
  console.log('========================================================================');
  console.log('💎 LUXURY BENTO AUDIT COLD EMAIL DISPATCHER');
  console.log(`   Target Count: ${leads.length} Leads`);
  console.log('========================================================================\n');

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    console.log(`[${i + 1}/${leads.length}] Sending luxury audit pitch to ${lead.name} (${lead.company} - ${lead.email})...`);

    try {
      const res = await sendLuxuryColdEmail(lead);
      if (res.status === 200) {
        console.log(`   ✅ [200 OK] Luxury Audit Delivered (Resend ID: ${res.data.id})`);
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

  console.log('\n🎉 Luxury audit cold email delivered successfully!\n');
}

runLuxuryOutreachBatch(sampleLeads).catch(console.error);
